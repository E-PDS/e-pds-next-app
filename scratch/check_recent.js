const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkRecentProducts() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB || "EPDS_DB";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        
        console.log("Checking last 5 products...");
        const products = await db.collection("products").find({}).sort({_id: -1}).limit(5).toArray();
        console.table(products.map(p => ({
            id: p._id,
            name: p.productName,
            price: p.sellingPrice
        })));

        console.log("\nChecking last 5 stock entries...");
        const stocks = await db.collection("stock").find({}).sort({_id: -1}).limit(5).toArray();
        console.table(stocks.map(s => ({
            id: s._id,
            storeId: s.storeId,
            productId: s.productId,
            quantity: s.quantity
        })));

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

checkRecentProducts();
