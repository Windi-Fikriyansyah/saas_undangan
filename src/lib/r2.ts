import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Only initialize if we have the variables, otherwise it might throw in build time
const isR2Configured = 
  process.env.R2_ACCOUNT_ID && 
  process.env.R2_ACCESS_KEY_ID && 
  process.env.R2_SECRET_ACCESS_KEY && 
  process.env.R2_BUCKET_NAME;

export const r2 = isR2Configured ? new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
}) : null;

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

/**
 * Generate a pre-signed URL for client-side direct upload to R2
 * @param fileName - The desired file name/path in the bucket
 * @param contentType - The MIME type of the file
 * @param expiresIn - How long the URL is valid (default 300s = 5m)
 */
export async function generatePresignedUrl(
  fileName: string, 
  contentType: string, 
  expiresIn = 300
): Promise<string> {
  if (!r2) {
    throw new Error("Cloudflare R2 is not configured");
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    ContentType: contentType,
  });

  return await getSignedUrl(r2, command, { expiresIn });
}

/**
 * Returns the public URL of the uploaded file
 */
export function getPublicUrl(fileName: string): string {
  // If R2_PUBLIC_URL is not set, it cannot be accessed publicly unless bucket allows it
  // In production, you'd map this to a custom domain
  return `${R2_PUBLIC_URL}/${fileName}`;
}
