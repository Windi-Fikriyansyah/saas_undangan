import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import InvitationWrapper from "@/components/template/InvitationWrapper";

export const revalidate = 0; // Dynamic rendering for search params

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

  // --- Domain Check Logic ---
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "saas-undangan.com";
  const isLocalhost = host.includes("localhost");
  const isMainDomain = host === mainDomain || host.endsWith("." + process.env.NEXT_PUBLIC_VERCEL_URL); // allow vercel preview urls
  
  let isWhiteLabel = false;

  if (!isLocalhost && !isMainDomain) {
    // If it's a subdomain of the main domain
    if (host.endsWith("." + mainDomain)) {
      const subdomain = host.replace("." + mainDomain, "");
      if (order.vendor.subdomain !== subdomain) {
        notFound(); // Trying to access order from wrong subdomain
      }
    } else {
      // It's a custom domain
      if (order.vendor.customDomain !== host) {
        notFound(); // Trying to access order from wrong custom domain
      }
      // Only apply whitelabel if it's accessed via the custom domain
      isWhiteLabel = order.vendor.whiteLabel;
    }
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
