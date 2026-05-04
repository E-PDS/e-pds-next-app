import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { storeId, date } = req.query;

        if (!storeId || !date) {
            return res.status(400).json({ success: false, message: "storeId and date are required" });
        }

        const db = await connectToDatabase();

        // Count bookings for this store on this date
        const bookings = await db.collection("queues").find({
            storeId: new ObjectId(storeId),
            date: date,
            status: { $ne: 'cancelled' }
        }).toArray();

        const morningBookings = bookings.filter(b => b.timeSlot === 'Morning').length;
        const eveningBookings = bookings.filter(b => b.timeSlot === 'Evening').length;
        const totalBookings = bookings.length;

        return res.status(200).json({
            success: true,
            availability: {
                totalSlots: 20,
                bookedSlots: totalBookings,
                remainingSlots: 20 - totalBookings,
                morningBookings,
                eveningBookings
            }
        });

    } catch (error) {
        console.error("Queue Availability Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
