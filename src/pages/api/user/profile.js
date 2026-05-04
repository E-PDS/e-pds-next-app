import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ status: "Failed", message: "Method Not Allowed" });
    }

    const { userId } = req.body;
    console.log("Fetching profile for userId:", userId);

    if (!userId) {
        return res.status(400).json({ status: "Failed", message: "User ID is required" });
    }

    try {
        const db = await connectToDatabase();
        
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            console.error("Invalid User ID format for profile:", userId);
            return res.status(400).json({ status: "Failed", message: "Invalid User ID format" });
        }

        const user = await db.collection("users").findOne(
            { _id: new ObjectId(userId) },
            { projection: { passwordHash: 0 } }
        );

        if (!user) {
            return res.status(404).json({ status: "Failed", message: "User not found" });
        }

        return res.status(200).json({ status: "Success", data: user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ status: "Failed", message: "Internal Server Error" });
    }
}
