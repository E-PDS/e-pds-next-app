import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { storeId, date } = req.query;

        if (!storeId || !ObjectId.isValid(storeId)) {
            return res.status(400).json({ success: false, message: "Valid storeId is required" });
        }

        const db = await connectToDatabase();

        const query = { storeId: new ObjectId(storeId) };
        if (date) query.date = date;

        const bookings = await db.collection("queues")
            .aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                {
                    $project: {
                        "user.passwordHash": 0,
                        "user.password": 0
                    }
                },
                { $sort: { date: 1, tokenNumber: 1 } }
            ]).toArray();

        return res.status(200).json({
            success: true,
            data: bookings
        });

    } catch (error) {
        console.error("Store Bookings Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
