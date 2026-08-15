import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";
import InvitationWrapper from "@/components/template/InvitationWrapper";
import StaticBlockRenderer from "@/components/landing-builder/StaticBlockRenderer";

export const revalidate = 60; // ISR: regenerate every 60 seconds

interface InvitationPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    to?: string;
  }>;
}

export default async function InvitationPage({ params, searchParams }: InvitationPageProps) {
  const { slug } = await params;
  const { to } = await searchParams;
  const guestName = to || "Tamu Undangan";

  // --- Domain Check Logic ---
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "saas-undangan.com";
  const isLocalhost = host.includes("localhost");
  const isMainDomain = host === mainDomain || host.endsWith("." + process.env.NEXT_PUBLIC_VERCEL_URL); // allow vercel preview urls
  
  let subdomain = "";
  let customDomain = "";

  if (!isLocalhost && !isMainDomain) {
    if (host.endsWith("." + mainDomain)) {
      subdomain = host.replace("." + mainDomain, "");
    } else {
      customDomain = host;
    }
  } else if (isLocalhost && host !== "localhost:3000" && host !== "localhost") {
    // Extract subdomain in localhost (e.g. tes.localhost:3000)
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "app") {
      subdomain = parts[0];
    }
  }

  // --- 1. Find Vendor based on domain ---
  let vendor = null;
  if (subdomain) {
    vendor = await prisma.vendor.findUnique({ where: { subdomain } });
  } else if (customDomain) {
    vendor = await prisma.vendor.findFirst({ where: { customDomain } });
  }

  // --- 2. Check for Landing Page ---
  if (vendor) {
    const landingPage = await prisma.landingPage.findFirst({
      where: { vendorId: vendor.id, slug, isActive: true }
    });

    if (landingPage && landingPage.content) {
      const blocksData = Array.isArray(landingPage.content) ? landingPage.content : [];

      return (
        <main className="min-h-screen w-full">
          <StaticBlockRenderer blocks={blocksData} />
        </main>
      );
    }
  }

  // --- 3. Check for Invitation Order ---
  const order = await prisma.order.findUnique({
    where: { slug },
    include: {
      template: true,
      vendor: true,
      guests: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  let isWhiteLabel = false;

  if (vendor) {
    // If accessed via a specific tenant domain, ensure the order belongs to them
    if (order.vendorId !== vendor.id) {
      notFound();
    }
    if (customDomain) {
      isWhiteLabel = order.vendor.whiteLabel;
    }
  } else if (!isLocalhost && !isMainDomain) {
     // If we had a subdomain/custom domain but no vendor was found at all
     notFound();
  }
  // --------------------------

  // Check if order is expired (based on status or expiresAt)
  if (order.status === "EXPIRED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold">Undangan Tidak Tersedia</h1>
        <p className="mt-4 text-gray-500">Masa aktif tautan undangan ini telah berakhir.</p>
      </div>
    );
  }

  if (order.expiresAt && order.expiresAt < new Date()) {
    // Optionally update status to EXPIRED here, but for now just show message
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold">Undangan Tidak Tersedia</h1>
        <p className="mt-4 text-gray-500">Masa aktif tautan undangan ini telah habis.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full">
      <InvitationWrapper 
        order={order}
        guestName={guestName}
        isWhiteLabel={isWhiteLabel}
      />
    </main>
  );
}
