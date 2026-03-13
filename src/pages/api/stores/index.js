import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const stores = await db.collection("stores").find({}).toArray();
            res.status(200).json({ success: true, data: stores });
        } catch (error) {
            console.error("Error fetching stores:", error);
            res.status(500).json({ success: false, message: "Failed to fetch stores" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
