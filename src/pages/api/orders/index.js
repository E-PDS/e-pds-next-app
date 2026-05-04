import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        let userId = null;

        // 🔹 Get userId safely
        const sessionTokenRaw = req.headers['sessiontoken'] || req.headers['x-session-token'];

        if (sessionTokenRaw) {
            try {
                // If it's a JSON string
                const sessionData = JSON.parse(sessionTokenRaw);
                userId = sessionData.userId || sessionData;
            } catch {
                // If it's a plain string
                userId = sessionTokenRaw;
            }
        }

        if (!userId && req.headers['x-user-id']) {
            userId = req.headers['x-user-id'].replace(/"/g, '');
        }

        const db = await connectToDatabase();

        // =========================
        // ✅ GET ORDERS
        // =========================
        if (req.method === 'GET') {
            if (!userId || !ObjectId.isValid(userId)) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const orders = await db.collection("orders")
                .find({ userId: new ObjectId(userId) })
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json({ success: true, data: orders });
        }

        // =========================
        // ✅ CREATE ORDER
        // =========================
        const { storeId, items, totalAmount, deliveryAddress } = req.body;

        // 🔹 Validation
        if (!storeId || !items?.length || !deliveryAddress) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        if (!ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storeId"
            });
        }

        // 🔹 Validate items
        for (const item of items) {
            if (!ObjectId.isValid(item.productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid productId"
                });
            }
        }

        // 🔹 Create order object
        let finalUserId = null;
        if (userId && ObjectId.isValid(userId)) {
            finalUserId = new ObjectId(userId);
        } else if (req.body.userId && ObjectId.isValid(req.body.userId)) {
            finalUserId = new ObjectId(req.body.userId);
        }

        const newOrder = {
            userId: finalUserId,
            storeId: new ObjectId(storeId),
            items: items.map(item => ({
                productId: new ObjectId(item.productId),
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                total: item.total
            })),
            totalAmount,
            status: "pending",
            deliveryAddress,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("orders").insertOne(newOrder);

        if (!result.insertedId) {
            return res.status(500).json({
                success: false,
                message: "Failed to insert order"
            });
        }

        // =========================
        // 🔹 UPDATE STOCK SAFELY
        // =========================
        for (const item of newOrder.items) {
            await db.collection("stock").updateOne(
                {
                    storeId: new ObjectId(storeId),
                    productId: item.productId
                },
                {
                    $inc: { quantity: -item.quantity },
                    $set: { updatedAt: new Date() }
                }
            );
        }

        // =========================
        // ✅ SUCCESS RESPONSE
        // =========================
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: result.insertedId
        });

    } catch (error) {
        console.error("ORDER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}
