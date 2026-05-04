import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ status: "Failed", message: "Method Not Allowed" });
    }

    const { userId } = req.body;
    console.log("Generating E-Card for userId:", userId);

    if (!userId) {
        return res.status(400).json({ status: "Failed", message: "User ID is required" });
    }

    try {
        const db = await connectToDatabase();
        
        // Validate userId format
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
             console.error("Invalid User ID format:", userId);
             return res.status(400).json({ status: "Failed", message: "Invalid User ID format" });
        }

        const objectId = new ObjectId(userId);
        
        // Check if E-Card already exists
        const existingCard = await db.collection("e_card").findOne({ userId: objectId });
        if (existingCard) {
            console.log("E-Card already exists for user:", userId);
            return res.status(400).json({ status: "Failed", message: "E-Card already exists" });
        }

        // Fetch user details to generate card
        const user = await db.collection("users").findOne({ _id: objectId });
        if (!user) {
            return res.status(404).json({ status: "Failed", message: "User not found" });
        }

        // Generate unique 10-digit card number
        let isUnique = false;
        let cardNumber = "";
        while (!isUnique) {
            cardNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const existingCardNum = await db.collection("e_card").findOne({ cardNumber });
            if (!existingCardNum) {
                isUnique = true;
            }
        }

        // Determine card color and name based on annual income
        const income = Number(user.annualIncome) || 0;
        const members = Number(user.eligibleMembers) || 1;

        let cardColor = "White";
        let cardName = "NP-NS";
        let priorityTitle = "Low Priority";

        if (income < 15000) {
            cardColor = "Yellow";
            cardName = "AAY";
            priorityTitle = "High Priority";
        } else if (income >= 15000 && income <= 24000) {
            cardColor = "Pink";
            cardName = "BPL";
            priorityTitle = "Medium Priority";
        } else if (income > 24000 && income <= 100000) {
            cardColor = "Blue";
            cardName = "APL";
            priorityTitle = "Normal Priority";
        } else {
            cardColor = "White";
            cardName = "NP-NS";
            priorityTitle = "Low Priority";
        }

        const newCard = {
            userId: user._id,
            fullName: user.fullName,
            cardNumber: cardNumber,
            color: cardColor,
            type: cardName,
            priority: priorityTitle,
            annualIncome: income,
            eligibleMembers: members,
            address: user.address || "Not Provided",
            talukName: user.talukName || "Not Provided",
            wardNo: user.wardNo || "0",
            localBodyType: user.localBodyType || "Not Provided",
            localBodyName: user.localBodyName || "Not Provided",
            status: "Active",
            issuedDate: new Date()
        };

        await db.collection("e_card").insertOne(newCard);

        return res.status(201).json({ status: "Success", data: newCard });
    } catch (error) {
        console.error("Error generating E-Card:", error);
        return res.status(500).json({ status: "Failed", message: "Internal Server Error" });
    }
}
