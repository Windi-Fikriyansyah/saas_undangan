import { NextRequest, NextResponse } from "next/server";
import { generatePresignedUrl, getPublicUrl } from "@/lib/r2";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, contentType, folder = "uploads" } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required" },
        { status: 400 }
      );
    }

    // Basic security: Check if file type is allowed (image or audio)
    if (!contentType.startsWith("image/") && !contentType.startsWith("audio/")) {
      return NextResponse.json(
        { error: "Only image and audio files are allowed" },
        { status: 400 }
      );
    }

    // Generate a unique file name to avoid collisions
    const extension = filename.split(".").pop();
    const uniqueFileName = `${folder}/${crypto.randomUUID()}.${extension}`;

    // Get the pre-signed URL from our R2 utility
    const signedUrl = await generatePresignedUrl(uniqueFileName, contentType);
    
    // The public URL where the file can be accessed after upload
    const publicUrl = getPublicUrl(uniqueFileName);

    return NextResponse.json({
      success: true,
      signedUrl,
      publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error: any) {
    console.error("Error generating presigned URL:", error);
    
    if (error.message === "Cloudflare R2 is not configured") {
      return NextResponse.json(
        { error: "R2 is not configured in environment variables" },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
