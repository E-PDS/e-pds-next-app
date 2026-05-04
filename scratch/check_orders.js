const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkOrders() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB || "EPDS_DB";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        
        const orders = await db.collection("orders").find({}).sort({createdAt: -1}).limit(5).toArray();
        console.log("\nLast 5 Orders in DB:");
        console.table(orders.map(o => ({
            id: o._id,
            userId: o.userId,
            status: o.status,
            total: o.totalAmount,
            itemsCount: o.items?.length
        })));

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

checkOrders();
