import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PlanType } from "@/generated/prisma/client";
import { PLAN_LIMITS } from "@/lib/constants/billing";
import { createPaymentRequest } from "@/app/actions/payment";
import SubscriptionHistoryTableClient from "./SubscriptionHistoryTableClient";

const PLANS = [
  {
    type: PlanType.STARTER,
    name: "Starter",
    price: 99000,
    features: [
      "Kapasitas Tamu hingga 500",
      "Template Standar",
      "Masa Aktif Undangan 1 Tahun",
    ],
  },
  {
    type: PlanType.PRO,
    name: "Pro",
    price: 199000,
    features: [
      "Kapasitas Tamu Tanpa Batas",
      "Semua Template (Termasuk Premium)",
      "Masa Aktif Undangan Selamanya",
      "Fitur Custom Domain Dasar",
    ],
  },
  {
    type: PlanType.BUSINESS,
    name: "Business",
    price: 499000,
    features: [
      "Kapasitas Tamu Tanpa Batas",
      "Semua Template Premium",
      "Fitur White-label",
      "Manajemen Multi-Admin",
      "Dukungan WhatsApp Prioritas",
    ],
  }
];

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    redirect("/signin");
  }

  const vendorId = (session!.user as any).id;
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId }
  });

  if (!vendor) {
    redirect("/signin");
  }

  const orderCount = await prisma.order.count({ where: { vendorId } });
  const currentLimit = PLAN_LIMITS[vendor.planType].maxOrders;
  const payments = await prisma.payment.findMany({
    where: { vendorId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Langganan & Paket
        </h2>
      </div>

      <div className="mb-10 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
          Status Saat Ini: <span className="text-brand-500 uppercase">{vendor.planType.replace("_", " ")}</span>
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Tingkatkan paket Anda untuk mendapatkan akses tak terbatas ke semua fitur eksklusif SaaS Undangan Digital.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between border border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-sm font-medium text-black dark:text-white mb-1">Kuota Undangan Aktif</p>
            <p className="text-xs text-gray-500">Jumlah undangan yang sedang berjalan</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-brand-600 dark:text-brand-400">{orderCount}</span>
            <span className="text-sm text-gray-500 mx-1">/</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentLimit > 1000 ? "Tak Terbatas" : currentLimit}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12">
        {PLANS.map((plan) => (
          <div key={plan.type} className={`flex flex-col rounded-xl border ${vendor.planType === plan.type ? "border-brand-500 shadow-brand-200 shadow-lg" : "border-stroke"} bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark`}>
            
            {vendor.planType === plan.type && (
              <span className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 self-start">
                Paket Anda Saat Ini
              </span>
            )}
            
            <h4 className="mb-2 text-2xl font-bold text-black dark:text-white">
              {plan.name}
            </h4>
            <p className="mb-6 text-4xl font-bold text-black dark:text-white">
              Rp {plan.price.toLocaleString("id-ID")}
            </p>

            <ul className="mb-8 flex flex-col gap-4 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-black dark:text-white">
                  <span className="text-brand-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {vendor.planType === plan.type ? (
              <button disabled className="w-full rounded-lg px-4 py-3 text-center font-medium transition cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                Paket Aktif
              </button>
            ) : (
              <form action={async () => {
                "use server";
                const url = await createPaymentRequest(plan.type, plan.price);
                redirect(url);
              }}>
                <button type="submit" className="w-full rounded-lg px-4 py-3 text-center font-medium transition bg-brand-500 text-white hover:bg-brand-600">
                  Pilih Paket
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Riwayat Pembayaran
          </h3>
        </div>
        <div className="p-6">
          {payments.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">Belum ada riwayat pembayaran.</p>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <SubscriptionHistoryTableClient payments={payments} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
