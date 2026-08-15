import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RsvpStatus } from "@/generated/prisma/client";

import WaGeneratorWrapper from "@/components/dashboard/WaGeneratorWrapper";
import GuestsTableClient from "./GuestsTableClient";

export default async function GuestsPage({ searchParams }: { searchParams: { orderId?: string; search?: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    redirect("/signin");
  }

  const vendorId = (session!.user as any).id;
  const filterOrderId = searchParams.orderId;

  // Fetch all orders for this vendor to populate the filter dropdown
  const vendorOrders = await prisma.order.findMany({
    where: { vendorId },
    select: { id: true, clientName: true, slug: true },
    orderBy: { createdAt: "desc" }
  });

  // Fetch guests, optionally filtered by orderId
  const guests = await prisma.guest.findMany({
    where: {
      order: {
        vendorId: vendorId, // security check
      },
      ...(filterOrderId ? { orderId: filterOrderId } : {}),
      ...(searchParams.search ? { name: { contains: searchParams.search, mode: "insensitive" } } : {})
    },
    include: {
      order: { select: { clientName: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  // Calculate metrics
  const totalGuests = guests.length;
  const totalHadir = guests.filter(g => g.rsvpStatus === "HADIR").reduce((acc, curr) => acc + curr.rsvpCount, 0);
  const totalMessages = guests.filter(g => g.message && g.message.trim() !== "").length;

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Tamu & RSVP
        </h2>
        
        {vendorOrders.length > 0 && (
          <WaGeneratorWrapper orders={vendorOrders} />
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-8">
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {totalGuests}
              </h4>
              <span className="text-sm font-medium">Total Tamu (Link Dibuka)</span>
            </div>
          </div>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-meta-3 dark:text-white">
                {totalHadir}
              </h4>
              <span className="text-sm font-medium">Tamu Mengonfirmasi Hadir</span>
            </div>
          </div>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-meta-5 dark:text-white">
                {totalMessages}
              </h4>
              <span className="text-sm font-medium">Total Ucapan/Pesan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-4 flex flex-col sm:flex-row items-center gap-2">
          <form method="get" className="flex flex-col sm:flex-row items-center gap-2">
            <select
              name="orderId"
              defaultValue={filterOrderId || ""}
              className="rounded border border-stroke bg-transparent px-4 py-2 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">Semua Pesanan</option>
              {vendorOrders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.clientName} (/{o.slug})
                </option>
              ))}
            </select>
            <button 
              type="submit"
              className="rounded bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
            >
              Filter
            </button>
          </form>
        </div>
        
        <div className="max-w-full overflow-x-auto">
          <GuestsTableClient guests={guests} />
        </div>
      </div>
    </div>
  );
}
