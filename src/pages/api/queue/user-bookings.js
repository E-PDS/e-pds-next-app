import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { userId } = req.query;

        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Valid userId is required" });
        }

        const db = await connectToDatabase();

        const bookings = await db.collection("queues")
            .aggregate([
                { $match: { userId: new ObjectId(userId) } },
                {
                    $lookup: {
                        from: "stores",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "store"
                    }
                },
                { $unwind: "$store" },
                { $sort: { date: -1, bookedAt: -1 } }
            ]).toArray();

        return res.status(200).json({
            success: true,
            data: bookings
        });

    } catch (error) {
        console.error("User Bookings Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
