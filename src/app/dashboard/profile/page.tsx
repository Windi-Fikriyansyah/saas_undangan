import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ProfileForm from "./ProfileForm"; // Client Component

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    redirect("/signin");
  }

  const vendorId = (session?.user as any).id;
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  const totalOrders = await prisma.order.count({
    where: { vendorId }
  });

  const liveOrders = await prisma.order.count({
    where: { vendorId, status: "LIVE" }
  });

  if (!vendor) {
    redirect("/signin");
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Pengaturan Akun
        </h2>
      </div>

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informasi Pribadi
              </h3>
            </div>
            <div className="p-7">
              <ProfileForm vendor={vendor} />
            </div>
          </div>
        </div>

        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Detail Paket
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-4">
                <span className="text-sm font-medium">Paket Saat Ini</span>
                <p className="mt-1 font-semibold text-brand-500 uppercase">
                  {vendor.planType.replace("_", " ")}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium">Masa Aktif</span>
                <p className="mt-1 text-black dark:text-white">
                  {vendor.planExpiresAt ? vendor.planExpiresAt.toLocaleDateString("id-ID") : "Selamanya"}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium">Kuota Terpakai</span>
                <p className="mt-1 text-black dark:text-white">
                  {totalOrders} undangan (Total)
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Undangan Aktif (Live)</span>
                <p className="mt-1 font-semibold text-brand-500">
                  {liveOrders} undangan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
