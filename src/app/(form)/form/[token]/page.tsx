import { validateClientToken } from "@/app/actions/order";
import { notFound } from "next/navigation";
import ClientFormWizard from "@/components/form/ClientFormWizard";
import ClientGuestManager from "@/components/client/ClientGuestManager";

export default async function ClientFormPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await validateClientToken(token);

  if (!result.valid || !result.order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Akses Ditolak</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {result.reason || "Link form ini tidak valid atau telah kedaluwarsa."}
          </p>
        </div>
      </div>
    );
  }

  const { order } = result;

  // If order is already LIVE, show a completed state and Guest Manager
  if (order.status === "LIVE") {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
        <div className="w-full bg-white dark:bg-gray-900 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Undangan Aktif</h2>
                <p className="text-xs text-gray-500">Data form terkunci</p>
              </div>
            </div>
          </div>
        </div>

        <ClientGuestManager 
          clientToken={token} 
          clientName={order.clientName}
          orderSlug={order.slug}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Form Undangan
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Halo <span className="font-semibold text-blue-600 dark:text-blue-400">{order.clientName}</span>!
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Lengkapi data pernikahan Anda melalui formulir di bawah ini.
        </p>
      </div>

      <ClientFormWizard 
        clientToken={token} 
        initialData={order.dataJson}
        templateName={order.template.name}
        templateConfig={order.template.configJson}
      />
    </div>
  );
}
