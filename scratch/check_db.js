const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkPayments() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB || "EPDS_DB";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        
        const collections = await db.listCollections().toArray();
        console.log("Collections in DB:", collections.map(c => c.name));

        const payments = await db.collection("payments").find({}).sort({createdAt: -1}).limit(5).toArray();
        console.log("\nLast 5 Payments in 'payments' collection:");
        console.table(payments.map(p => ({
            id: p._id,
            razorpayOrderId: p.razorpayOrderId,
            status: p.status,
            amount: p.amount,
            orderId: p.orderId
        })));

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

checkPayments();
