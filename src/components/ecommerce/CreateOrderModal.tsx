"use client";

import { useState } from "react";
import { createOrder } from "@/app/actions/order";
import { useRouter } from "next/navigation";

export default function CreateOrderModal({ templates = [] }: { templates?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successLink, setSuccessLink] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessLink(null);

    const formData = new FormData(e.currentTarget);
    const clientName = formData.get("clientName") as string;
    const clientWa = formData.get("clientWa") as string;
    const expiresInDays = parseInt(formData.get("expiresInDays") as string);
    const templateId = formData.get("templateId") as string;

    try {
      const order = await createOrder({ clientName, clientWa, expiresInDays, templateId });
      setSuccessLink(`${window.location.origin}/form/${order.clientToken}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal membuat link undangan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Buat Link Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Buat Link Undangan</h3>
            
            {successLink ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <p className="font-semibold">Link Berhasil Dibuat!</p>
                  <p className="text-sm">Kirim link ini ke klien Anda:</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                  <code className="flex-1 break-all text-sm text-gray-800 dark:text-gray-300">
                    {successLink}
                  </code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(successLink)}
                    className="rounded bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    Copy
                  </button>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-center font-medium text-white hover:bg-blue-700"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Desain Template
                  </label>
                  <select
                    name="templateId"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.category} ({t.name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Klien (Mempelai)
                  </label>
                  <input
                    name="clientName"
                    required
                    placeholder="Romeo & Juliet"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nomor WhatsApp Klien
                  </label>
                  <input
                    name="clientWa"
                    required
                    placeholder="08123456789"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Masa Aktif Form (Hari)
                  </label>
                  <select
                    name="expiresInDays"
                    defaultValue="30"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="7">7 Hari</option>
                    <option value="14">14 Hari</option>
                    <option value="30">30 Hari</option>
                    <option value="60">60 Hari</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Setelah masa aktif habis, link tidak bisa lagi diisi oleh klien.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Buat Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
