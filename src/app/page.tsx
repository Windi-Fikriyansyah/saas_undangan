import Image from "next/image";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Home() {
  // --- Domain Check Logic ---
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "saas-undangan.com";
  const isLocalhost = host.includes("localhost");
  const isMainDomain = host === mainDomain || host.endsWith("." + process.env.NEXT_PUBLIC_VERCEL_URL);
  
  if (!isLocalhost && !isMainDomain) {
    let vendor = null;
    
    // Check if it's a subdomain
    if (host.endsWith("." + mainDomain)) {
      const subdomain = host.replace("." + mainDomain, "");
      vendor = await prisma.vendor.findUnique({ where: { subdomain } });
    } else {
      // It's a custom domain
      vendor = await prisma.vendor.findFirst({ where: { customDomain: host } });
    }

    if (!vendor) {
      notFound();
    }

    // Render Vendor Landing Page
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-900">
        <div className="rounded-2xl bg-white p-8 shadow-lg max-w-md w-full dark:bg-gray-800">
          {vendor.logoUrl ? (
            <img src={vendor.logoUrl} alt={vendor.name} className="mx-auto mb-6 h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-600 dark:bg-brand-900/30">
              {vendor.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{vendor.name}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Jasa Pembuatan Undangan Digital Digital</p>
          
          {vendor.waNumber && (
            <a 
              href={`https://wa.me/${vendor.waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825.001 6.938 3.113 6.939 6.938-.001 3.825-3.114 6.938-6.939 6.942z"/></svg>
              Hubungi Kami
            </a>
          )}
        </div>
      </div>
    );
  }
  // --------------------------

  // Render SaaS Default Landing Page
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold mb-4">SaaS Undangan Digital</h1>
        <p className="text-xl text-gray-500 mb-8">Buat website undangan pernikahan Anda sendiri dalam hitungan menit.</p>
        
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-white transition-colors hover:bg-brand-600 md:w-auto"
            href="/api/auth/signin"
          >
            Mulai Sekarang
          </a>
        </div>
      </main>
    </div>
  );
}
