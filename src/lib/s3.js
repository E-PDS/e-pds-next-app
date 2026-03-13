import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_APP_BUCKET_REGION,
  endpoint: `https://${process.env.NEXT_PUBLIC_APP_BUCKET_REGION}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
  },
});

export default s3;
