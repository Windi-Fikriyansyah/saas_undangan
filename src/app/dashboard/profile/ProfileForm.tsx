"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/vendor";

export default function ProfileForm({ vendor }: { vendor: any }) {
  const [name, setName] = useState(vendor.name || "");
  const [waNumber, setWaNumber] = useState(vendor.waNumber || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await updateProfile({ name, waNumber });
      setMessage("Profil berhasil diperbarui.");
    } catch (error: any) {
      setMessage(error.message || "Gagal memperbarui profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div className={`mb-4 rounded px-4 py-3 text-sm ${message.includes("berhasil") ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
          {message}
        </div>
      )}

      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <div className="w-full sm:w-1/2">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="name">
            Nama Lengkap / Nama Bisnis
          </label>
          <input
            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-brand-500"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="w-full sm:w-1/2">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="waNumber">
            Nomor WhatsApp
          </label>
          <input
            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-brand-500"
            type="text"
            id="waNumber"
            value={waNumber}
            onChange={(e) => setWaNumber(e.target.value)}
            placeholder="Misal: 628123..."
          />
        </div>
      </div>

      <div className="mb-5.5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="emailAddress">
          Alamat Email
        </label>
        <div className="relative">
          <span className="absolute left-4.5 top-4">
            <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.8">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.61929 1.9523 2.5 3.33301 2.5H16.6663C18.047 2.5 19.1663 3.61929 19.1663 5V15C19.1663 16.3807 18.047 17.5 16.6663 17.5H3.33301C1.9523 17.5 0.833008 16.3807 0.833008 15V5Z" fill=""/>
                <path fillRule="evenodd" clipRule="evenodd" d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99967 9.81615L17.855 4.31734C18.2321 4.05341 18.7517 4.1451 19.0156 4.52215C19.2796 4.89919 19.1879 5.4188 18.8108 5.68272L10.4775 11.5161C10.1907 11.7169 9.80859 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z" fill=""/>
              </g>
            </svg>
          </span>
          <input
            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-brand-500 cursor-not-allowed opacity-70"
            type="email"
            id="emailAddress"
            value={vendor.email}
            disabled
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah (digunakan untuk login).</p>
      </div>

      <div className="flex justify-end gap-4">
        <button
          className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          type="button"
          onClick={() => { setName(vendor.name); setWaNumber(vendor.waNumber || ""); setMessage(""); }}
        >
          Batal
        </button>
        <button
          className="flex justify-center rounded bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
