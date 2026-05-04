import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { storeId, userId, date, timeSlot } = req.body;

        if (!storeId || !userId || !date || !timeSlot) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const db = await connectToDatabase();

        // 1. Check if it's Sunday (0 is Sunday)
        const bookingDate = new Date(date);
        if (bookingDate.getDay() === 0) {
            return res.status(400).json({ success: false, message: "Virtual queue is not available on Sundays." });
        }

        // 2. Check if total slots for the day is already 20
        const totalBookingsToday = await db.collection("queues").countDocuments({
            storeId: new ObjectId(storeId),
            date: date,
            status: { $ne: 'cancelled' }
        });

        if (totalBookingsToday >= 20) {
            return res.status(400).json({ success: false, message: "All 20 slots for this day are fully booked." });
        }

        // 3. Check if user already has a booking for this day
        const existingBooking = await db.collection("queues").findOne({
            userId: new ObjectId(userId),
            date: date,
            storeId: new ObjectId(storeId),
            status: { $ne: 'cancelled' }
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: "You already have a booking for this day." });
        }

        // 4. Create new booking
        const tokenNumber = totalBookingsToday + 1;
        const newBooking = {
            userId: new ObjectId(userId),
            storeId: new ObjectId(storeId),
            date: date,
            timeSlot: timeSlot, // 'Morning' or 'Evening'
            tokenNumber: tokenNumber,
            status: 'pending',
            bookedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("queues").insertOne(newBooking);

        return res.status(201).json({
            success: true,
            message: "Virtual queue booked successfully. Waiting for shopkeeper approval.",
            booking: {
                id: result.insertedId,
                tokenNumber: tokenNumber
            }
        });

    } catch (error) {
        console.error("Queue Booking Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
}
