import Razorpay from "razorpay";
import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { amount, userId, internalOrderId } = req.body;
        console.log("Create-order request:", { amount, userId, internalOrderId });

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("CRITICAL: Razorpay keys are missing from environment variables!");
            return res.status(500).json({
                success: false,
                message: "Server configuration error: Razorpay keys are missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment."
            });
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        const db = await connectToDatabase();
        const paymentsCollection = db.collection("payments");

        let razorpay;
        try {
            razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
        } catch (rzpInitErr) {
            console.error("Razorpay Init Error:", rzpInitErr);
            throw new Error("Failed to initialize payment gateway: " + rzpInitErr.message);
        }

        let order;
        try {
            order = await razorpay.orders.create({
                amount: Math.round(amount * 100), // ₹ → paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            });
        } catch (rzpOrderErr) {
            console.error("Razorpay Order Creation Error:", rzpOrderErr);
            throw new Error("Razorpay Error: " + (rzpOrderErr.description || rzpOrderErr.message));
        }

        console.log("Razorpay order created:", order.id);

        const paymentRecord = {
            userId: userId || "GUEST",
            orderId: internalOrderId || null,
            razorpayOrderId: order.id,
            amount,
            status: "created",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            console.log("Saving Payment record to DB:", paymentRecord);
            await paymentsCollection.insertOne(paymentRecord);
            console.log("Payment record saved successfully.");
        } catch (dbErr) {
            console.error("Database Insertion Error:", dbErr);
            throw new Error("Failed to save payment record to database: " + dbErr.message);
        }

        return res.status(200).json({
            success: true,
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error("❌ CREATE ORDER ERROR:", error);
        console.error("Error Stack:", error.stack);
        console.error("Request Body:", req.body);

        return res.status(500).json({
            success: false,
            message: error.message || "Error creating payment order"
        });
    }
}