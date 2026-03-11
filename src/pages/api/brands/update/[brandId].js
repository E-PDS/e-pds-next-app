import connectToDatabase from '@/lib/db';
import { logActivity } from '@/lib/logActivity';
import { parseObjectId } from '@/utils/parseObjectId';
import { s3Copy, s3Delete } from '@/utils/s3Utils';
import parseSessionToken from '@/utils/sessionToken';
import withFileUpload from '@/utils/withFileUpload';

async function handler(req, res, { fields, files }) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, errorCode: "METHOD_NOT_ALLOWED", message: 'Method not allowed' });
  }

  const { brandId } = req.query;
  const { userId } = parseSessionToken(req);

  if (!brandId) {
    return res.status(400).json({ success: false, errorCode: "BRAND_ID_REQUIRED", message: 'Brand ID is required' });
  }

  try {
    const db = await connectToDatabase();

    // Check if brand exists
    const existingBrand = await db.collection('brands').findOne({ _id: parseObjectId(brandId) });
    if (!existingBrand) {
      return res.status(404).json({ success: false, errorCode: "BRAND_NOT_FOUND", message: 'Brand not found' });
    }

    const updateData = {
      brandName: fields.brandName,
      description: fields.description,
      websiteUrl: fields.websiteURL,
      active: fields.active === 'true',
      updatedAt: new Date(),
      updatedBy: parseObjectId(userId)
    };

    // Handle logo update if a new file is uploaded
    if (files.length > 0) {
      const file = files[0];
      const brandLogoFilename = `${brandId}-${file.tmpFileName}`;
      const key = `brands/${brandLogoFilename}`;
      updateData.brandLogo = brandLogoFilename;

      await s3Copy(file[0].tmpKey, key);

      if (existingBrand.brandLogo) {
        await s3DeleteFiles([file[0].tmpKey, `brands/${existingBrand.brandLogo}`]);
      } else {
        await s3Delete(file[0].tmpKey);
      }

    }

    await db.collection('brands').updateOne(
      { _id: parseObjectId(brandId) },
      { $set: updateData }
    );

    await logActivity({
      erpUserId: userId,
      action: "brand.update",
      message: `Updated brand: ${updateData.brandName}(ID: ${brandId})`,
      payload: { brandId: parseObjectId(brandId), oldData: existingBrand, newData: updateData }
    });

    return res.status(200).json({ success: true, message: 'Brand updated successfully' });

  } catch (error) {
    console.error("Error updating brand:", error);
    return res.status(500).json({ success: false, errorCode: "SERVER_ERROR", message: error.message || 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withFileUpload(handler);
