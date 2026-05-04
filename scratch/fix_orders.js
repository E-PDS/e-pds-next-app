const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fixOrders() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB || "EPDS_DB";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        
        // Find the most recent user
        const user = await db.collection("users").findOne({});
        if (!user) return console.log("No user found");

        console.log("Fixing orders for user:", user._id);

        const result = await db.collection("orders").updateMany(
            { userId: null },
            { $set: { userId: user._id } }
        );

        console.log(`Updated ${result.modifiedCount} orders.`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

fixOrders();
