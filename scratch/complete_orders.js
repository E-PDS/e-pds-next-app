const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function completeOrders() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB || "EPDS_DB";
    const client = new MongoClient(uri);

    const targetUserId = "69f74033123e8e135ffa4816";

    try {
        await client.connect();
        const db = client.db(dbName);
        
        console.log("Marking orders as COMPLETED for user:", targetUserId);

        const result = await db.collection("orders").updateMany(
            { userId: new ObjectId(targetUserId) },
            { $set: { status: "completed" } }
        );

        console.log(`Updated ${result.modifiedCount} orders to 'completed'.`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

completeOrders();
