"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadTemplateForm() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Silakan pilih file JSON' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name || file.name.replace('.json', ''));
    formData.append('category', category);

    try {
      const res = await fetch('/api/templates/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Template berhasil diunggah!' });
        setFile(null);
        setName("");
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.error || 'Terjadi kesalahan saat mengunggah' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal terhubung ke server' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 xl:p-7.5">
      {message && (
        <div className={`mb-4 rounded p-3 text-sm ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {message.text}
        </div>
      )}

      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">
          Nama Template (Opsional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Misal: Tema Elegan 1"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
        />
      </div>

      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">
          Kategori
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
        >
          <option value="General">General</option>
          <option value="Wedding">Pernikahan</option>
          <option value="Birthday">Ulang Tahun</option>
          <option value="Corporate">Perusahaan</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block text-black dark:text-white">
          File JSON Elementor <span className="text-danger">*</span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json,application/json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Silahkan pilih file JSON hasil export dari Elementor WordPress.
        </p>
      </div>
      
      <button 
        type="submit"
        disabled={isLoading}
        className="flex w-full justify-center rounded bg-brand-500 p-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
      >
        {isLoading ? 'Mengunggah...' : 'Proses & Simpan Template'}
      </button>
    </form>
  );
}
