import { logActivity } from '@/lib/logActivity';
import connectToDatabase from "@/lib/db";
import parseSessionToken from "@/utils/sessionToken";
import { s3Delete } from '@/utils/s3Utils';
import { parseObjectId } from '@/utils/parseObjectId';

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, errorCode: "METHOD_NOT_ALLOWED", message: "Method not allowed" });
  }

  const { brandId } = req.query;
  const { userId } = parseSessionToken(req);

  if (!brandId) {
    return res.status(400).json({ success: false, errorCode: "BRAND_ID_REQUIRED", message: "Brand ID is required" });
  }

  try {
    const db = await connectToDatabase();

    const productExists = await db.collection("products").findOne({ brandId: brandId });
    if (productExists) {
      return res.status(400).json({ success: false, errorCode: "BRAND_ASSOCIATED_PRODUCTS", message: "Cannot delete brand with associated products. Please remove associated products first." });
    }

    const brand = await db.collection("brands").findOneAndDelete({ _id: parseObjectId(brandId) });

    if (!brand) {
      return res.status(404).json({ success: false, errorCode: "BRAND_NOT_FOUND", message: "Brand not found" });
    }

    if (brand.brandLogo) {
      await s3Delete(`brands/${brand.brandLogo}`);
    }

    await logActivity({
      erpUserId: userId,
      action: "brand.delete",
      message: `Deleted brand: ${brand.brandName} (ID: ${brandId})`,
      payload: { brandId: brand._id }
    });

  } catch (error) {
    console.error("Error deleting brand:", error);
    return res.status(500).json({ success: false, errorCode: "SERVER_ERROR", message: "Internal server error" });
  }

  return res.status(200).json({ success: true, errorCode: "SUCCESS", message: "Brand deleted successfully" });

}