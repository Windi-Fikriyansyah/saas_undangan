import { prisma } from "@/lib/db";
import React from "react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [totalVendors, totalOrders, totalTemplates, totalGuests] = await Promise.all([
    prisma.vendor.count(),
    prisma.order.count(),
    prisma.template.count(),
    prisma.guest.count(),
  ]);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Admin Dashboard
        </h2>
        <p className="text-sm text-gray-500">Ringkasan statistik platform SaaS Undangan.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {totalVendors}
              </h4>
              <span className="text-sm font-medium">Total Vendors</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {totalOrders}
              </h4>
              <span className="text-sm font-medium">Total Pesanan/Undangan</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {totalTemplates}
              </h4>
              <span className="text-sm font-medium">Total Templates</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {totalGuests}
              </h4>
              <span className="text-sm font-medium">Total Tamu (Tercatat)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
