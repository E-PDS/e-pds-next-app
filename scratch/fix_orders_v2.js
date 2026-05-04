const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fixOrders() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB || "EPDS_DB";
    const client = new MongoClient(uri);

    // TARGET USER ID from the logs
    const targetUserId = "69f74033123e8e135ffa4816";

    try {
        await client.connect();
        const db = client.db(dbName);
        
        console.log("Fixing orders for target user:", targetUserId);

        const result = await db.collection("orders").updateMany(
            {}, // Update ALL orders for now to this user for testing
            { $set: { userId: new ObjectId(targetUserId) } }
        );

        console.log(`Updated ${result.modifiedCount} orders.`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

fixOrders();
