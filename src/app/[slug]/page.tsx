import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import InvitationWrapper from "@/components/template/InvitationWrapper";

export const revalidate = 0; // Dynamic rendering for search params

interface InvitationPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    to?: string;
  };
}

export default async function InvitationPage({ params, searchParams }: InvitationPageProps) {
  const { slug } = params;
  const guestName = searchParams.to || "Tamu Undangan";

  const order = await prisma.order.findUnique({
    where: { slug },
    include: {
      template: true,
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
      />
    </main>
  );
}
