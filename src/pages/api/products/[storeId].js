import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { storeId } = req.query;

            if (!storeId || !ObjectId.isValid(storeId)) {
                return res.status(400).json({ success: false, message: "Valid storeId is required" });
            }

            const db = await connectToDatabase();
            
            // Fetch stocks for the given store
            const stockItems = await db.collection("stock").find({ storeId: new ObjectId(storeId) }).toArray();
            
            if (!stockItems || stockItems.length === 0) {
                return res.status(200).json({ success: true, data: [] });
            }

            const productIds = stockItems.map(item => item.productId);
            
            // Fetch products matching the productIds
            const products = await db.collection("products").find({ _id: { $in: productIds } }).toArray();

            // Map and merge data
            const productsWithStock = products.map(product => {
                const stockInfo = stockItems.find(s => s.productId.toString() === product._id.toString());
                const stockQty = stockInfo ? stockInfo.quantity : 0;
                
                return {
                    id: product._id.toString(),
                    name: product.productName,
                    description: product.description || '',
                    price: product.sellingPrice || 0,
                    unit: product.unit || 'pcs',
                    stock: stockQty,
                    inStock: stockQty > 0,
                    icon: 'package' // Default icon or from product if exists
                };
            });

            res.status(200).json({ success: true, data: productsWithStock });
        } catch (error) {
            console.error("Error fetching products and stocks:", error);
            res.status(500).json({ success: false, message: "Failed to fetch products and stocks" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
