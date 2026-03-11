import s3 from '@/lib/s3';
import { CopyObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const BUCKET = process.env.NEXT_PUBLIC_APP_BUCKET_NAME;

// Copy file
export async function s3Copy(sourceKey, destinationKey, ACL = 'public-read') {
  await s3.send(
    new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${sourceKey}`,
      Key: destinationKey,
      ACL: ACL
    })
  );
}

// Copy multiple files
export async function s3CopyFiles(files = []) {
  if (!files.length) return;

  await Promise.all(
    files.map(file =>
      s3Copy(file.sourceKey, file.destinationKey, file.ACL)
    )
  );
}

// Move file
export async function s3Move(sourceKey, destinationKey, ACL = 'public-read') {
  await s3Copy(sourceKey, destinationKey, ACL);
  await s3Delete(sourceKey);
}

// Move multiple files
export async function s3MoveFiles(files = []) {
  if (!files.length) return;

  await s3CopyFiles(files);

  // Extract source keys for deletion
  const sourceKeys = files.map(f => f.sourceKey);
  await s3DeleteFiles(sourceKeys);
}

// Delete multiple files
export async function s3DeleteFiles(keys = []) {
  if (!keys.length) return;

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: keys.map(k => ({ Key: k }))
      }
    })
  );
}

// Delete one file
export async function s3Delete(key) {
  return s3DeleteFiles([key]);
}

