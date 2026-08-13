import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ isScraped: false }, { status: 400 });
  }

  try {
    if (type === "template") {
      const template = await prisma.template.findUnique({
        where: { id },
        select: { configJson: true }
      });
      const config = template?.configJson as any;
      return NextResponse.json({ isScraped: !!config?.isScraped });
    } 
    
    if (type === "slug") {
      const order = await prisma.order.findUnique({
        where: { slug: id },
        include: { template: { select: { configJson: true } } }
      });
      const config = order?.template?.configJson as any;
      return NextResponse.json({ isScraped: !!config?.isScraped });
    }

    return NextResponse.json({ isScraped: false });
  } catch (error) {
    console.error("Internal Check Scrape Error:", error);
    return NextResponse.json({ isScraped: false }, { status: 500 });
  }
}
