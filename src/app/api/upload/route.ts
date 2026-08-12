import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY || "",
    secretAccessKey: process.env.R2_SECRET_KEY || "",
  },
});

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, clientToken } = await req.json();

    if (!filename || !contentType || !clientToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify clientToken
    const order = await prisma.order.findUnique({
      where: { clientToken }
    });

    if (!order) {
      return NextResponse.json({ error: "Invalid client token" }, { status: 401 });
    }

    if (order.status === "EXPIRED" || order.status === "LIVE") {
      return NextResponse.json({ error: "Order is locked" }, { status: 403 });
    }

    // Validate contentType
    if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Generate unique key
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const extension = filename.split(".").pop();
    const key = `orders/${order.id}/${uniqueId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ signedUrl, publicUrl, key });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
