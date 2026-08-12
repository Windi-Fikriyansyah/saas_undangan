"use client";

import { useFormContext } from "react-hook-form";
import { ClientFormData } from "@/lib/validations/client-form";

export default function Step1Couple() {
  const { register, formState: { errors } } = useFormContext<ClientFormData>();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Mempelai</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Masukkan informasi lengkap kedua mempelai.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Mempelai Wanita */}
        <div className="space-y-4 rounded-xl border border-pink-100 bg-pink-50/50 p-5 dark:border-pink-900/30 dark:bg-pink-900/10">
          <h3 className="font-medium text-pink-800 dark:text-pink-400">Mempelai Wanita</h3>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
            <input 
              {...register("step1.brideName")} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
            />
            {errors.step1?.brideName && <p className="mt-1 text-xs text-red-500">{errors.step1.brideName.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Panggilan</label>
            <input 
              {...register("step1.brideNickname")} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
            />
            {errors.step1?.brideNickname && <p className="mt-1 text-xs text-red-500">{errors.step1.brideNickname.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Orang Tua</label>
            <input 
              {...register("step1.brideParents")} 
              placeholder="Putri dari Bapak X & Ibu Y"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
            />
            {errors.step1?.brideParents && <p className="mt-1 text-xs text-red-500">{errors.step1.brideParents.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram (Opsional)</label>
            <input 
              {...register("step1.brideIg")} 
              placeholder="@username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
            />
          </div>
        </div>

        {/* Mempelai Pria */}
        <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
          <h3 className="font-medium text-blue-800 dark:text-blue-400">Mempelai Pria</h3>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
            <input 
              {...register("step1.groomName")} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
            />
            {errors.step1?.groomName && <p className="mt-1 text-xs text-red-500">{errors.step1.groomName.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Panggilan</label>
            <input 
              {...register("step1.groomNickname")} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
            />
            {errors.step1?.groomNickname && <p className="mt-1 text-xs text-red-500">{errors.step1.groomNickname.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Orang Tua</label>
            <input 
              {...register("step1.groomParents")} 
              placeholder="Putra dari Bapak X & Ibu Y"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
            />
            {errors.step1?.groomParents && <p className="mt-1 text-xs text-red-500">{errors.step1.groomParents.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram (Opsional)</label>
            <input 
              {...register("step1.groomIg")} 
              placeholder="@username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
