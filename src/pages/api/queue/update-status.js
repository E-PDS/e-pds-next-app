import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { bookingId, status, reason } = req.body;

        if (!bookingId || !ObjectId.isValid(bookingId) || !status) {
            return res.status(400).json({ success: false, message: "bookingId and status are required" });
        }

        const validStatuses = ['approved', 'rejected', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const db = await connectToDatabase();

        const updateData = {
            status: status,
            updatedAt: new Date()
        };
        if (reason) updateData.reason = reason;

        const result = await db.collection("queues").updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        return res.status(200).json({
            success: true,
            message: `Booking ${status} successfully.`
        });

    } catch (error) {
        console.error("Update Booking Status Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
