"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScrapeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string; name: string } | null>(null);

  const [formData, setFormData] = useState({
    url: "",
    name: "",
    category: "Premium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal melakukan scraping");
      }

      setSuccess({ id: data.templateId, name: formData.name });
      setFormData({ url: "", name: "", category: "Premium" });
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100 flex flex-col gap-2">
          <p>
            <strong>Berhasil!</strong> Template "{success.name}" berhasil di-scrape dan disimpan ke database.
          </p>
          <a
            href={`/preview/template/${success.id}`}
            target="_blank"
            rel="noreferrer"
            className="text-brand-500 font-medium hover:underline inline-flex items-center gap-1"
          >
            Lihat Preview
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL Target
        </label>
        <input
          type="url"
          required
          placeholder="https://contoh-undangan.com"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="text-xs text-gray-500 mt-1">
          Pastikan URL dapat diakses secara publik. Proses ini bisa memakan waktu hingga 1 menit.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nama Template
        </label>
        <input
          type="text"
          required
          placeholder="Nama Tema (misal: Elegan Luxury 1)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Kategori
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="Premium">Premium</option>
          <option value="Minimalist">Minimalist</option>
          <option value="Rustic">Rustic</option>
          <option value="Floral">Floral</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-500 text-white font-medium py-2.5 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sedang Scraping... (Maks 1 Menit)
          </>
        ) : (
          "Mulai Scrape"
        )}
      </button>
    </form>
  );
}
