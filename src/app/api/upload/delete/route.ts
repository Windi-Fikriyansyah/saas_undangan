import { NextRequest, NextResponse } from "next/server";
import { deleteObject, R2_PUBLIC_URL } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract the file key from the URL
    let fileName = "";
    if (url.startsWith("/api/image?key=")) {
      fileName = decodeURIComponent(url.replace("/api/image?key=", ""));
    } else if (R2_PUBLIC_URL && url.startsWith(R2_PUBLIC_URL)) {
      fileName = url.replace(`${R2_PUBLIC_URL}/`, "");
    }

    if (!fileName) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }
    
    if (!fileName) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }

    const success = await deleteObject(fileName);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
