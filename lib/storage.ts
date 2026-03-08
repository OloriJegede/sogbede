import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function uploadFile(file: File, folder: string = "uploads") {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${folder}/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: fileName,
    Body: buffer,
    ACL: "public-read",
    ContentType: file.type,
  });

  await s3Client.send(command);

  const fileUrl = `${process.env.DO_SPACES_CDN || process.env.DO_SPACES_ENDPOINT}/${process.env.DO_SPACES_BUCKET}/${fileName}`;
  return fileUrl;
}
