import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: String,
    orderId: String,           // Internal Order ID (MongoDB _id)
    razorpayOrderId: String,   // Razorpay Order ID (order_...)
    paymentId: String,         // Razorpay Payment ID (pay_...)
    amount: Number,
    status: String,
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema, "payments");