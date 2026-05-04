import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        console.log("🔐 Starting payment verification...");
        const db = await connectToDatabase();
        const paymentsCollection = db.collection("payments");
        const ordersCollection = db.collection("orders");

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log("Verification payload:", req.body);

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        // 🔑 Verify Signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isValid = generatedSignature === razorpay_signature;
        console.log("Signature check match:", isValid);

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Signature verification failed" });
        }

        // 🔍 Update Payment Record (Native)
        console.log("Searching for payment record with razorpayOrderId:", razorpay_order_id);
        const payment = await paymentsCollection.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                $set: {
                    paymentId: razorpay_payment_id,
                    status: "success",
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        if (!payment) {
            const recent = await paymentsCollection.find({}).sort({createdAt: -1}).limit(3).toArray();
            console.error("Payment record not found for:", razorpay_order_id);
            console.log("Recent records in DB:", recent);
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }

        console.log("Payment record updated successfully. Order ID:", payment.orderId);

        // 🛒 Update Order Status (Native)
        if (payment.orderId && ObjectId.isValid(payment.orderId)) {
            const updateResult = await ordersCollection.updateOne(
                { _id: new ObjectId(payment.orderId) },
                {
                    $set: {
                        status: "paid",
                        updatedAt: new Date()
                    }
                }
            );
            console.log("Order status updated to 'paid':", updateResult.modifiedCount > 0);
        }

        return res.status(200).json({ success: true, message: "Payment verified successfully" });

    } catch (error) {
        console.error("❌ VERIFY PAYMENT ERROR:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}