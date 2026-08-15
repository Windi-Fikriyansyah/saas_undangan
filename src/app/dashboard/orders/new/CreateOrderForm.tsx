"use client";

import { useState } from "react";
import { createOrder } from "@/app/actions/order";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export default function CreateOrderForm({ templates = [] }: { templates?: any[] }) {
  const [loading, setLoading] = useState(false);
  const [successLink, setSuccessLink] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || "");
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessLink(null);

    const formData = new FormData(e.currentTarget);
    const clientName = formData.get("clientName") as string;
    const clientWa = formData.get("clientWa") as string;
    const expiresInDays = parseInt(formData.get("expiresInDays") as string);

    if (!selectedTemplateId) {
      toast.error("Silakan pilih template terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      const order = await createOrder({ 
        clientName, 
        clientWa, 
        expiresInDays, 
        templateId: selectedTemplateId 
      });
      setSuccessLink(`${window.location.origin}/form/${order.clientToken}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat link undangan.");
    } finally {
      setLoading(false);
    }
  };

  if (successLink) {
    return (
      <div className="space-y-6 text-center py-10">
        <div className="mx-auto flex h-15 w-15 items-center justify-center rounded-full bg-success/20 text-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h4 className="text-xl font-bold text-black dark:text-white">Order Berhasil Dibuat!</h4>
          <p className="mt-2 text-sm text-gray-500">Silakan kirimkan link di bawah ini kepada klien Anda untuk mulai mengisi data undangan.</p>
        </div>
        
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-2 rounded-lg border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
            <code className="flex-1 text-left text-sm text-black dark:text-white">
              {successLink}
            </code>
            <button 
              onClick={() => navigator.clipboard.writeText(successLink)}
              className="rounded bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm border border-stroke hover:bg-gray-50 dark:bg-boxdark dark:text-white dark:border-strokedark dark:hover:bg-meta-4"
            >
              Salin Link
            </button>
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard/orders")}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-brand-500 px-8 py-2.5 text-center font-medium text-white hover:bg-brand-600"
        >
          Lihat Semua Order
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h4 className="mb-4 text-lg font-medium text-black dark:text-white">1. Pilih Template</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map(t => (
            <div 
              key={t.id}
              onClick={() => setSelectedTemplateId(t.id)}
              className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
                selectedTemplateId === t.id 
                  ? "border-brand-500 bg-brand-500/5" 
                  : "border-stroke hover:border-gray-300 dark:border-strokedark dark:hover:border-gray-600"
              }`}
            >
              {selectedTemplateId === t.id && (
                <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17L4 12"/></svg>
                </div>
              )}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                {t.thumbnailUrl ? (
                  <Image src={t.thumbnailUrl} alt={t.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-sm font-medium">{t.name}</span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h5 className="font-medium text-black dark:text-white">{t.name}</h5>
                <p className="text-xs text-gray-500 uppercase">{t.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-lg font-medium text-black dark:text-white">2. Detail Klien</h4>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Nama Klien (Mempelai)
            </label>
            <input
              name="clientName"
              required
              placeholder="Romeo & Juliet"
              className="w-full rounded border border-stroke bg-transparent px-4.5 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-brand-500"
            />
          </div>

          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Nomor WhatsApp Klien
            </label>
            <input
              name="clientWa"
              required
              placeholder="08123456789"
              className="w-full rounded border border-stroke bg-transparent px-4.5 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-brand-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Masa Aktif Form
            </label>
            <select
              name="expiresInDays"
              defaultValue="30"
              className="w-full rounded border border-stroke bg-transparent px-4.5 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-brand-500"
            >
              <option value="7">7 Hari</option>
              <option value="14">14 Hari</option>
              <option value="30">30 Hari</option>
              <option value="60">60 Hari</option>
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Setelah masa aktif habis, link form tidak bisa lagi diakses atau diisi oleh klien.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-stroke dark:border-strokedark">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex justify-center rounded border border-stroke px-6 py-2.5 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center rounded bg-brand-500 px-6 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Buat Order Sekarang"}
        </button>
      </div>
    </form>
  );
}
