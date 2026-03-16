import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        let userId = null;
        const sessionTokenRaw = req.headers['x-session-token'];
        
        if (sessionTokenRaw) {
            try {
                const sessionData = JSON.parse(sessionTokenRaw);
                userId = sessionData.userId;
            } catch (e) {
                console.warn("Failed to parse x-session-token");
            }
        }
        
        // Fallback or explicit override
        if (!userId && req.headers['x-user-id']) {
            userId = req.headers['x-user-id'].replace(/"/g, '');
        }

        const db = await connectToDatabase();

        if (req.method === 'GET') {
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const orders = await db.collection("orders").find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();
            
            // For each order, fetch store info and basic product names if possible, but basic response is enough.
            return res.status(200).json({ success: true, data: orders });
        }
        
        const { storeId, items, totalAmount, deliveryAddress } = req.body;

        if (!storeId || !items || !items.length || !deliveryAddress) {
            return res.status(400).json({ success: false, message: "Missing required fields for order." });
        }

        // db already connected above.
        
        // Structure the order document
        const newOrder = {
            userId: userId ? new ObjectId(userId) : null,
            storeId: new ObjectId(storeId),
            items: items.map(item => ({
                productId: new ObjectId(item.productId),
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                total: item.total
            })),
            totalAmount: totalAmount,
            status: "pending",
            deliveryAddress: deliveryAddress,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("orders").insertOne(newOrder);

        if (result.insertedId) {
            // Deduct stock quantities directly
            for (const item of newOrder.items) {
                await db.collection("stock").updateOne(
                    { storeId: new ObjectId(storeId), productId: new ObjectId(item.productId) },
                    { $inc: { quantity: -item.quantity }, $set: { updatedAt: new Date() } }
                );
            }

            res.status(201).json({ success: true, message: "Order placed successfully", orderId: result.insertedId });
        } else {
            res.status(500).json({ success: false, message: "Failed to place order" });
        }
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
