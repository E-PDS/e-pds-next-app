import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    storeId: String,
    items: Array,
    totalAmount: Number,
    deliveryAddress: Object,
    status: String
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);