import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { checkDomainStatus, addCustomDomain, removeCustomDomain } from "@/app/actions/domain";
import { revalidatePath } from "next/cache";

export default async function DomainPage() {
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

  const isEligibleForDomain = vendor.planType === "PRO" || vendor.planType === "BUSINESS";
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "saas-undangan.com";
  
  let domainStatus = null;
  if (vendor.customDomain) {
    domainStatus = await checkDomainStatus();
  }

  async function handleAddDomain(formData: FormData) {
    "use server";
    const domain = formData.get("domain") as string;
    if (domain) {
      await addCustomDomain(domain);
      revalidatePath("/dashboard/domain");
    }
  }

  async function handleRemoveDomain() {
    "use server";
    await removeCustomDomain();
    revalidatePath("/dashboard/domain");
  }

  return (
    <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Domain & Branding
        </h2>
      </div>

      {/* Subdomain Section */}
      <div className="mb-8 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Subdomain Bawaan
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          Subdomain bawaan Anda saat pertama kali mendaftar. Dapat diakses oleh klien.
        </p>
        <div className="flex w-full items-center rounded border border-stroke bg-gray-2 px-4.5 py-3 dark:border-strokedark dark:bg-meta-4">
          <span className="text-black dark:text-white font-medium">
            https://{vendor.subdomain}.{mainDomain}
          </span>
        </div>
      </div>

      {/* Custom Domain Section */}
      <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Custom Domain
          </h3>
          {!isEligibleForDomain && (
            <span className="mt-2 sm:mt-0 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Perlu Upgrade (Pro / Business)
            </span>
          )}
        </div>
        
        <p className="mb-6 text-sm text-gray-500">
          Gunakan domain Anda sendiri (misal: <code>weddingbyardi.com</code>) agar terlihat lebih profesional.
        </p>

        {vendor.customDomain ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div>
                <p className="text-sm text-gray-500">Domain Tersambung</p>
                <p className="text-lg font-bold text-black dark:text-white">{vendor.customDomain}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  domainStatus?.status === 'active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                }`}>
                  {domainStatus?.status === 'active' ? 'Aktif' : 'Menunggu Validasi'}
                </span>
              </div>
            </div>

            {domainStatus?.status !== 'active' && (
              <div className="rounded border-l-4 border-warning bg-warning/10 p-4 text-warning">
                <h4 className="font-semibold mb-2">Instruksi Konfigurasi DNS</h4>
                <p className="text-sm mb-2">Untuk mengaktifkan domain Anda, silakan masuk ke penyedia domain Anda (seperti Niagahoster, Rumahweb, Cloudflare) dan tambahkan DNS record berikut:</p>
                <div className="bg-white p-3 rounded text-sm text-black border border-warning/20">
                  <p><strong>Type:</strong> CNAME</p>
                  <p><strong>Name:</strong> @ (atau www)</p>
                  <p><strong>Target:</strong> cname.{mainDomain}</p>
                </div>
                <p className="text-xs mt-3 text-warning">Proses propagasi DNS mungkin memakan waktu hingga 24 jam.</p>
              </div>
            )}

            <form action={handleRemoveDomain}>
              <button 
                type="submit"
                className="text-sm font-medium text-danger hover:underline"
              >
                Hapus Custom Domain
              </button>
            </form>
          </div>
        ) : (
          <form action={handleAddDomain} className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="domain"
              disabled={!isEligibleForDomain}
              placeholder="Contoh: mywedding.com"
              className="w-full rounded border border-stroke bg-transparent px-4 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <button
              type="submit"
              disabled={!isEligibleForDomain}
              className="rounded bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full"
            >
              Hubungkan Domain
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
