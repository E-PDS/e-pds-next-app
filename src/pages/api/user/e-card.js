import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ status: "Failed", message: "Method Not Allowed" });
    }

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ status: "Failed", message: "User ID is required" });
    }

    try {
        const db = await connectToDatabase();
        const eCard = await db.collection("e_card").findOne({ userId: new ObjectId(userId) });

        if (!eCard) {
            return res.status(404).json({ status: "Failed", message: "E-Card not found" });
        }

        return res.status(200).json({ status: "Success", data: eCard });
    } catch (error) {
        console.error("Error fetching E-Card:", error);
        return res.status(500).json({ status: "Failed", message: "Internal Server Error" });
    }
}
