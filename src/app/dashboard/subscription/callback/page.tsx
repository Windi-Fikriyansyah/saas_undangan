import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PlanType } from "@/generated/prisma/client";
import Link from "next/link";

export default async function SubscriptionCallbackPage({ searchParams }: { searchParams: { order_id?: string, amount?: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    redirect("/signin");
  }

  const vendorId = (session!.user as any).id;
  const { order_id, amount } = searchParams;

  if (!order_id || !amount) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-danger">Invalid Request</h2>
        <p className="mt-2 text-gray-500">Parameter callback tidak lengkap.</p>
        <Link href="/dashboard/subscription" className="mt-6 rounded bg-brand-500 px-6 py-2 text-white hover:bg-brand-600">
          Kembali
        </Link>
      </div>
    );
  }

  // Ensure the order_id belongs to this vendor to prevent tampering
  if (!order_id.startsWith(`SUB-${vendorId}-`)) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-danger">Akses Ditolak</h2>
        <p className="mt-2 text-gray-500">Transaksi ini bukan milik akun Anda.</p>
        <Link href="/dashboard/subscription" className="mt-6 rounded bg-brand-500 px-6 py-2 text-white hover:bg-brand-600">
          Kembali
        </Link>
      </div>
    );
  }

  // Extract requested plan from order_id: SUB-{vendorId}-{planType}-{timestamp}
  const parts = order_id.split('-');
  const requestedPlan = parts[2] as PlanType; // e.g. STARTER, PRO, BUSINESS

  // Verify transaction with Pakasir
  const projectSlug = process.env.PAKASIR_PROJECT_SLUG;
  const apiKey = process.env.PAKASIR_API_KEY;

  if (!projectSlug || !apiKey) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-warning">Konfigurasi Belum Lengkap</h2>
        <p className="mt-2 text-gray-500 text-center">
          Kredensial API Pakasir belum dikonfigurasi di .env.<br />
          Pembayaran Anda mungkin sukses, namun verifikasi otomatis gagal.
        </p>
        <Link href="/dashboard/subscription" className="mt-6 rounded bg-brand-500 px-6 py-2 text-white hover:bg-brand-600">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  let paymentSuccess = false;
  let errorMsg = "";

  try {
    const verifyUrl = `https://app.pakasir.com/api/transactiondetail?project=${projectSlug}&amount=${amount}&order_id=${order_id}&api_key=${apiKey}`;
    const res = await fetch(verifyUrl, { cache: "no-store" });
    const data = await res.json();

    // The typical success response from Pakasir might look like:
    // { "status": "success", "data": { "status": "paid" } }
    // As per generic payment gateway structures. We check for success or paid.
    if (data.status === "success" || data.status === "paid") {
      paymentSuccess = true;
    } else {
      errorMsg = "Pembayaran belum diselesaikan atau gagal verifikasi.";
    }
  } catch (error) {
    console.error("Pakasir verify error:", error);
    errorMsg = "Terjadi kesalahan koneksi ke server Pakasir.";
  }

  // If successful, update the database
  if (paymentSuccess) {
    await prisma.$transaction([
      prisma.vendor.update({
        where: { id: vendorId },
        data: {
          planType: requestedPlan,
          planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
        }
      }),
      prisma.payment.update({
        where: { orderId: order_id },
        data: { status: "SUCCESS" }
      })
    ]);
  } else {
    // If we have an order_id but it failed, mark as FAILED 
    // (Only if it exists in DB to prevent errors)
    try {
      await prisma.payment.update({
        where: { orderId: order_id },
        data: { status: "FAILED" }
      });
    } catch(e) {
      // ignore if payment not found
    }
  }

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-4 text-center">
      {paymentSuccess ? (
        <>
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-black dark:text-white">Pembayaran Sukses!</h2>
          <p className="mt-4 text-lg text-gray-500">Paket langganan Anda telah berhasil ditingkatkan ke <span className="font-bold text-brand-500">{requestedPlan}</span>.</p>
        </>
      ) : (
        <>
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-danger/20 text-danger">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-black dark:text-white">Pembayaran Gagal</h2>
          <p className="mt-4 text-lg text-gray-500">{errorMsg}</p>
        </>
      )}

      <Link href="/dashboard/subscription" className="mt-8 rounded bg-brand-500 px-8 py-3 font-medium text-white transition hover:bg-brand-600">
        Kembali ke Berlangganan
      </Link>
    </div>
  );
}
