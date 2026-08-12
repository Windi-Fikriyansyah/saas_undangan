"use client";

import { useFormContext } from "react-hook-form";
import { ClientFormData } from "@/lib/validations/client-form";

export default function Step2Events() {
  const { register, formState: { errors } } = useFormContext<ClientFormData>();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Acara</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Masukkan detail waktu dan lokasi akad serta resepsi pernikahan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Akad / Pemberkatan */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Akad / Pemberkatan</h3>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
            <input 
              type="date"
              {...register("step2.akadDate")} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
            {errors.step2?.akadDate && <p className="mt-1 text-xs text-red-500">{errors.step2.akadDate.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Waktu (Jam)</label>
            <input 
              type="time"
              {...register("step2.akadTime")} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
            {errors.step2?.akadTime && <p className="mt-1 text-xs text-red-500">{errors.step2.akadTime.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Tempat / Gedung</label>
            <input 
              {...register("step2.akadVenue")} 
              placeholder="Masjid Raya / Gereja / Gedung X"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
            {errors.step2?.akadVenue && <p className="mt-1 text-xs text-red-500">{errors.step2.akadVenue.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat Lengkap</label>
            <textarea 
              {...register("step2.akadAddress")} 
              rows={2}
              placeholder="Jl. Contoh No. 123, Kota..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
            {errors.step2?.akadAddress && <p className="mt-1 text-xs text-red-500">{errors.step2.akadAddress.message}</p>}
          </div>
        </div>

        {/* Resepsi */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Resepsi</h3>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
            <input 
              type="date"
              {...register("step2.resepsiDate")} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
            {errors.step2?.resepsiDate && <p className="mt-1 text-xs text-red-500">{errors.step2.resepsiDate.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Waktu (Jam)</label>
            <input 
              type="time"
              {...register("step2.resepsiTime")} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
            {errors.step2?.resepsiTime && <p className="mt-1 text-xs text-red-500">{errors.step2.resepsiTime.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Tempat / Gedung</label>
            <input 
              {...register("step2.resepsiVenue")} 
              placeholder="Gedung X / Hotel Y"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
            {errors.step2?.resepsiVenue && <p className="mt-1 text-xs text-red-500">{errors.step2.resepsiVenue.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat Lengkap</label>
            <textarea 
              {...register("step2.resepsiAddress")} 
              rows={2}
              placeholder="Jl. Contoh No. 123, Kota..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
            />
            {errors.step2?.resepsiAddress && <p className="mt-1 text-xs text-red-500">{errors.step2.resepsiAddress.message}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Link Google Maps (Acara)</label>
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          Salin link "Share" dari aplikasi Google Maps. Ini akan digunakan untuk tombol navigasi tamu.
        </p>
        <input 
          {...register("step2.gmapsLink")} 
          placeholder="https://goo.gl/maps/..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
        />
        {errors.step2?.gmapsLink && <p className="mt-1 text-xs text-red-500">{errors.step2.gmapsLink.message}</p>}
      </div>
    </div>
  );
}
