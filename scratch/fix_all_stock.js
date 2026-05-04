const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fixAllStock() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB || "EPDS_DB";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        
        const storeId = new ObjectId('69b6bcdc8688df9eb4fea391');

        // 1. Fix Coffee Powder
        const coffee = await db.collection("products").findOne({ productName: /coffee/i });
        if (coffee) {
            await db.collection("stock").updateOne(
                { storeId: storeId, productId: coffee._id },
                { $set: { quantity: 100 } },
                { upsert: true }
            );
            console.log("Fixed Coffee Powder stock to 100.");
        }

        // 2. Add Masala Powder to Shop
        const masala = await db.collection("products").findOne({ productName: /masala/i });
        if (masala) {
            await db.collection("stock").updateOne(
                { storeId: storeId, productId: masala._id },
                { $set: { quantity: 50 } },
                { upsert: true }
            );
            console.log("Added Masala Powder stock (50) to the store.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

fixAllStock();
