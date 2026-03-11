import { logActivity } from '@/lib/logActivity';
import connectToDatabase from '@/lib/db';
import parseSessionToken from '@/utils/sessionToken';
import withFileUpload from '@/utils/withFileUpload';
import { s3Copy, s3Delete } from '@/utils/s3Utils';
import { parseObjectId } from '@/utils/parseObjectId';

async function handler(req, res, { fields, files }) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, errorCode: "METHOD_NOT_ALLOWED", message: 'Method not allowed' });
  }

  const { userId } = parseSessionToken(req);

  try {
    const db = await connectToDatabase();

    const brand = await db.collection('brands').insertOne({
      brandName: fields.brandName,
      websiteUrl: fields.websiteURL,
      description: fields.description,
      isActive: fields.active === 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: parseObjectId(userId),
      updatedBy: parseObjectId(userId)
    });

    let brandLogoFilename = null;

    if (files.length > 0) {
      const file = files[0];
      brandLogoFilename = `${brand.insertedId}-${file.tmpFileName}`;
      const key = `brands/${brandLogoFilename}`;

      await s3Copy(file.tmpKey, key);

      await s3Delete(file.tmpKey);
      await db.collection('brands').updateOne(
        { _id: brand.insertedId },
        {
          $set: {
            brandLogo: brandLogoFilename,
          },
        }
      );
    }

    await logActivity({
      erpUserId: userId,
      action: "brand.create",
      message: `Created brand: ${fields.brandName}(ID: ${brand.insertedId})`,
      payload: { brandId: brand.insertedId }
    });

    return res.status(200).json({ success: true, message: 'Brand created successfully' });
  } catch (error) {
    console.prettyLog('Error creating brand:', error);
    return res.status(500).json({ success: false, errorCode: "SERVER_ERROR", message: 'Failed to create brand' });
  }
}

export default withFileUpload(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};