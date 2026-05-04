import mongoose from "mongoose";

const QueueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    timeSlot: { type: String, enum: ['Morning', 'Evening'], required: true }, // Morning: 8AM-12PM, Evening: 4PM-7PM
    tokenNumber: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' },
    reason: { type: String }, // For rejection
    bookedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure unique booking per user per day per store
QueueSchema.index({ userId: 1, date: 1, storeId: 1 }, { unique: true });

export default mongoose.models.Queue || mongoose.model("Queue", QueueSchema);
