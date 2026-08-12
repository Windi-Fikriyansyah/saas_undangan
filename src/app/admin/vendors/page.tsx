import { prisma } from "@/lib/db";
import React from "react";
import VendorActions from "./VendorActions";

export const revalidate = 0;

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Manajemen Vendor
        </h2>
        <p className="text-sm text-gray-500">Daftar semua vendor/klien SaaS Anda.</p>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Data Vendor
          </h4>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Nama / Email</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Plan</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Tgl Daftar</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Jml Order</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Status Onboarding</p>
          </div>
          <div className="col-span-1 flex items-center justify-end">
            <p className="font-medium">Aksi</p>
          </div>
        </div>

        {vendors.map((vendor, key) => (
          <div
            className={`grid grid-cols-6 sm:grid-cols-8 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 ${
              key === vendors.length - 1 ? "border-b" : ""
            }`}
            key={vendor.id}
          >
            <div className="col-span-2 flex flex-col justify-center">
              <p className="text-sm font-medium text-black dark:text-white">
                {vendor.name}
              </p>
              <p className="text-xs text-gray-500">{vendor.email}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="inline-flex rounded-full bg-primary bg-opacity-10 px-3 py-1 text-xs font-medium text-primary">
                {vendor.planType}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {vendor.createdAt.toLocaleDateString('id-ID')}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {vendor._count.orders} order
              </p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-xs font-medium ${vendor.isOnboarded ? 'bg-success text-success' : 'bg-warning text-warning'}`}>
                {vendor.isOnboarded ? "Selesai" : "Belum Selesai"}
              </p>
            </div>
            <div className="col-span-1 flex items-center justify-end gap-2">
              <VendorActions vendorId={vendor.id} currentPlan={vendor.planType} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
