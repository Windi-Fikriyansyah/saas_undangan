import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ type: string, id: string }> }) {
  const resolvedParams = await params;
  const { type, id } = resolvedParams;

  try {
    let htmlContent = "";

    if (type === "template") {
      const template = await prisma.template.findUnique({
        where: { id },
      });
      const config = template?.configJson as any;
      
      if (!config || !config.isScraped) {
        return new NextResponse("Not a scraped template", { status: 404 });
      }
      
      htmlContent = config.html;
    } 
    else if (type === "slug") {
      const order = await prisma.order.findUnique({
        where: { slug: id },
        include: { template: true }
      });
      
      const config = order?.template?.configJson as any;
      if (!config || !config.isScraped) {
        return new NextResponse("Not a scraped template slug", { status: 404 });
      }
      
      htmlContent = config.html;
      
      // Future Enhancement: Here we can do String Replacement based on order details
      // Example:
      // htmlContent = htmlContent.replace(/Romeo/g, order.clientName);
    } 
    else {
      return new NextResponse("Invalid type parameter", { status: 400 });
    }

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Cache control to prevent middleware fetch overhead on every refresh for live site
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" 
      }
    });

  } catch (error) {
    console.error("Render Raw HTML Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
