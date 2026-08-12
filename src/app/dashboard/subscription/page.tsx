import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PlanType } from "@/generated/prisma/client";
import { CheckCircleIcon } from "@/icons";

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
    redirect("/api/auth/signin");
  }

  const vendorId = (session!.user as any).id;
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId }
  });

  if (!vendor) {
    redirect("/api/auth/signin");
  }

  // Generate checkout URL helper
  const getPakasirCheckoutUrl = (planType: string, amount: number) => {
    const slug = process.env.PAKASIR_PROJECT_SLUG || "demo";
    // We create a unique order ID that contains vendorId, planType, and timestamp
    const orderId = `SUB-${vendorId}-${planType}-${Date.now()}`;
    const redirectUrl = encodeURIComponent(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/subscription/callback`);
    
    return `https://app.pakasir.com/pay/${slug}/${amount}?order_id=${orderId}&redirect=${redirectUrl}`;
  };

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
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Tingkatkan paket Anda untuk mendapatkan akses tak terbatas ke semua fitur eksklusif SaaS Undangan Digital.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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

            <a
              href={vendor.planType === plan.type ? "#" : getPakasirCheckoutUrl(plan.type, plan.price)}
              className={`w-full rounded-lg px-4 py-3 text-center font-medium transition ${
                vendor.planType === plan.type
                  ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  : "bg-brand-500 text-white hover:bg-brand-600"
              }`}
            >
              {vendor.planType === plan.type ? "Paket Aktif" : "Pilih Paket"}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
