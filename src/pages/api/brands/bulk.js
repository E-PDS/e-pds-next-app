import { logActivity } from '@/lib/logActivity';
import connectToDatabase from '@/lib/db';
import parseSessionToken from '@/utils/sessionToken';
import { parseObjectId } from '@/utils/parseObjectId';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, errorCode: "METHOD_NOT_ALLOWED", message: 'Method not allowed' });
  }

  const { userId } = parseSessionToken(req);

  try {
    const { brands } = req.body;

    if (!Array.isArray(brands) || brands.length === 0) {
      return res.status(400).json({ success: false, errorCode: "INVALID_INPUT", message: 'Invalid input: brands array is required' });
    }

    const db = await connectToDatabase();



    // 1. Identify Existing Brands
    const brandNames = brands.map(b => b.brandName);
    const existingBrandDocs = await db.collection('brands')
      .find({ brandName: { $in: brandNames } })
      .project({ brandName: 1 })
      .toArray();

    const existingBrandNames = existingBrandDocs.map(b => b.brandName);

    // 2. Filter New Brands to Insert
    const brandsToInsertRaw = brands.filter(b => !existingBrandNames.includes(b.brandName));

    // 3. Prepare Insert Operations
    const brandsToInsert = brandsToInsertRaw.map(brand => ({
      brandName: brand.brandName,
      websiteUrl: brand.websiteURL || brand.websiteUrl || '',
      description: brand.description || '',
      isActive: brand.active === true || brand.active === 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: parseObjectId(userId),
      updatedBy: parseObjectId(userId),
      brandLogo: null
    }));

    // 4. Validate (Optional check, though we already filtered based on names)
    // If filtering removed everything, we just return success with 0 uploaded

    let insertedCount = 0;
    if (brandsToInsert.length > 0) {
      const result = await db.collection('brands').insertMany(brandsToInsert);
      insertedCount = result.insertedCount;
    }

    await logActivity({
      erpUserId: userId,
      action: "brand.bulk_create",
      message: `Bulk processed: ${insertedCount} inserted, ${existingBrandNames.length} skipped`,
      payload: { count: insertedCount, skipped: existingBrandNames.length }
    });

    // 5. Return success with detailed report
    return res.status(200).json({
      success: true,
      message: `Processed. Uploaded: ${insertedCount}, Skipped: ${existingBrandNames.length}`,
      uploadedCount: insertedCount,
      skippedCount: existingBrandNames.length,
      uploaded: brandsToInsertRaw.map(b => b.brandName),
      existing: existingBrandNames
    });

  } catch (error) {
    console.prettyLog('Error in bulk brand creation:', error);
    return res.status(500).json({ success: false, errorCode: "SERVER_ERROR", message: 'Failed to process bulk upload' });
  }
}
