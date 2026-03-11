import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';
import busboy from 'busboy';
import s3 from '@/lib/s3';

export default function withFileUpload(apiHandler) {
  return async function (req, res) {
    // If method does not support file upload, pass through to handler
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return apiHandler(req, res, { fields: {}, files: [] });
    }

    try {
      const bb = busboy({
        headers: req.headers,
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB limit
        }
      });

      const fields = {};
      const files = [];

      const uploadPromises = [];

      bb.on('field', (name, value) => {
        fields[name] = value;
      });

      bb.on('file', (fieldname, file, info) => {
        const mimeToExt = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/webp': 'webp',
          'image/gif': 'gif',
          'image/svg+xml': 'svg',
          'application/pdf': 'pdf',
        };

        const { filename, mimeType } = info;
        const fileExtension = mimeToExt[mimeType];
        if (!fileExtension) {
          return res.status(400).json({ error: 'Unsupported file type' });
        }
        const uuid = randomUUID();
        const timestamp = Math.floor(Date.now() / 1000);
        const tmpFileName = `${timestamp}-${uuid}.${fileExtension}`;
        const tmpKey = `tmp/${tmpFileName}`;

        const upload = new Upload({
          client: s3,
          params: {
            Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
            Key: tmpKey,
            Body: file,
            ContentType: mimeType,
            ACL: "public-read",
          },
        });

        const uploadPromise = upload.done().then(() => {
          files.push({
            fieldname,
            filename,
            mimeType,
            tmpKey,
            tmpFileName
          });
        });

        uploadPromises.push(uploadPromise);
      });

      const finished = new Promise((resolve, reject) => {
        bb.on('finish', resolve);
        bb.on('error', reject);
      });

      // Pages Router in Next.js 16 still uses Node.js IncomingMessage
      req.pipe(bb);

      await finished;
      await Promise.all(uploadPromises);

      // Pass fields and files to the wrapped handler
      return apiHandler(req, res, { fields, files });
    } catch (error) {
      console.error('Error in withFileUpload:', error);
      return res.status(500).json({
        error: 'File upload failed',
        message: error.message
      });
    }
  };
}
