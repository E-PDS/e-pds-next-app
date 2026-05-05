import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    storeId: String,
    userId: String,
    items: Array,
    totalAmount: Number,
    deliveryAddress: Object,
    deliveryType: String,
    deliveryStatus: String,
    paymentMethod: String,
    status: String
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);