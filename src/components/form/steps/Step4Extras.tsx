"use client";

import { useFormContext } from "react-hook-form";
import { ClientFormData } from "@/lib/validations/client-form";

export default function Step4Extras() {
  const { register, formState: { errors } } = useFormContext<ClientFormData>();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Fitur Ekstra</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Masukkan informasi tambahan seperti Cashless Gift dan Live Streaming.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-4 font-medium text-gray-800 dark:text-gray-200">Amplop Digital (Cashless Gift)</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Bank / E-Wallet</label>
            <input 
              {...register("step4.bankName")} 
              placeholder="BCA / Mandiri / GoPay"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Rekening</label>
            <input 
              {...register("step4.bankAccount")} 
              placeholder="1234567890"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Atas Nama</label>
            <input 
              {...register("step4.bankAccountName")} 
              placeholder="Nama pemilik rekening"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Link Live Streaming (Opsional)</label>
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          Masukkan link YouTube atau Instagram Live untuk tamu yang tidak bisa hadir.
        </p>
        <input 
          {...register("step4.liveStreamLink")} 
          placeholder="https://..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
        />
        {errors.step4?.liveStreamLink && <p className="mt-1 text-xs text-red-500">{errors.step4.liveStreamLink.message}</p>}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Quotes / Kutipan Pernikahan</label>
        <textarea 
          {...register("step4.quotes")} 
          rows={3}
          placeholder="Tuliskan kutipan atau doa untuk pernikahan Anda..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
        />
      </div>
    </div>
  );
}
