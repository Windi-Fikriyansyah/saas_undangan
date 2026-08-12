"use client";

import { useFormContext } from "react-hook-form";
import { ClientFormData } from "@/lib/validations/client-form";

export default function Step5Review() {
  const { watch } = useFormContext<ClientFormData>();
  const data = watch();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review & Selesai</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Periksa kembali data Anda. Setelah dikunci, data tidak dapat diubah lagi.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 border-b border-gray-100 pb-2 font-semibold text-gray-800 dark:border-gray-800 dark:text-gray-200">
          1. Data Mempelai
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Mempelai Wanita</p>
            <p className="font-medium text-gray-900 dark:text-white">{data.step1?.brideName || "-"}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Mempelai Pria</p>
            <p className="font-medium text-gray-900 dark:text-white">{data.step1?.groomName || "-"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 border-b border-gray-100 pb-2 font-semibold text-gray-800 dark:border-gray-800 dark:text-gray-200">
          2. Data Acara
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Akad / Pemberkatan</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {data.step2?.akadDate} • {data.step2?.akadTime}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{data.step2?.akadVenue}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Resepsi</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {data.step2?.resepsiDate} • {data.step2?.resepsiTime}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{data.step2?.resepsiVenue}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 dark:border-amber-900/30 dark:bg-amber-900/10">
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-medium text-amber-800 dark:text-amber-400">Peringatan Kunci Data</h4>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">
              Pastikan seluruh data sudah benar. Setelah menekan tombol <strong>"Selesai & Kunci Form"</strong>, Anda tidak bisa mengedit formulir ini lagi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
