import connectToDatabase from "@/lib/db";
import { parseObjectId } from "@/utils/parseObjectId";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, errorCode: "METHOD_NOT_ALLOWED", message: 'Method not allowed' });
  }

  const { brandId } = req.query;

  if (!brandId) {
    return res.status(400).json({ success: false, errorCode: "BRAND_ID_REQUIRED", message: 'Brand ID is required' });
  }

  try {
    const db = await connectToDatabase();
    const brand = await db.collection("brands").findOne({ _id: parseObjectId(brandId) });

    if (!brand) {
      return res.status(404).json({ success: false, errorCode: "BRAND_NOT_FOUND", message: 'Brand not found' });
    }

    return res.status(200).json({ success: true, brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return res.status(500).json({ success: false, errorCode: "SERVER_ERROR", message: 'Internal server error' });
  }
}
