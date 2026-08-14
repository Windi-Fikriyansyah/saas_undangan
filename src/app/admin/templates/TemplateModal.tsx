"use client";

import { useState } from "react";
import { upsertTemplate } from "@/app/actions/admin";
import defaultTemplate from "@/lib/default-template.json";

export default function TemplateModal({ template }: { template?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isCustomHtmlInit = template?.configJson?.blocks?.some((b: any) => b.type === "raw-html") || false;
  const initialHtml = isCustomHtmlInit ? (template?.configJson?.blocks?.find((b: any) => b.type === "raw-html")?.props?.html || "") : "";

  const [formData, setFormData] = useState({
    id: template?.id || "",
    name: template?.name || "",
    category: template?.category || "Minimalist",
    tier: template?.tier || "BASIC",
    isActive: template?.isActive ?? true,
    thumbnailUrl: template?.thumbnailUrl || "",
    configJson: template?.configJson ? JSON.stringify(template.configJson, null, 2) : JSON.stringify(defaultTemplate, null, 2),
    htmlContent: initialHtml
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await upsertTemplate({
        id: formData.id,
        name: formData.name,
        category: formData.category,
        tier: formData.tier,
        isActive: formData.isActive,
        thumbnailUrl: formData.thumbnailUrl,
        configJson: formData.configJson
      });
      setIsOpen(false);
      window.location.reload();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={template ? "text-brand-500 hover:underline text-sm" : "rounded bg-brand-500 px-4 py-2 font-medium text-white hover:bg-opacity-90"}
      >
        {template ? "Edit Tema" : "Tambah Tema"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {template ? "Edit Tema" : "Tambah Tema"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black dark:hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">ID Tema</label>
                  <input type="text" name="id" value={formData.id} onChange={handleChange} required readOnly={!!template} className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Nama Tema</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Kategori</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Tier</label>
                  <select name="tier" value={formData.tier} onChange={handleChange} className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark">
                    <option value="BASIC">BASIC</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">URL Thumbnail</label>
                  <input type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark" />
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-black dark:text-white">HTML Template</label>
                    <span className="text-xs text-gray-500">Edit HTML melalui fitur Import HTML / Visual Editor</span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} id={`isActive-${formData.id}`} />
                  <label htmlFor={`isActive-${formData.id}`} className="text-sm font-medium text-black dark:text-white">Aktif (Bisa digunakan klien)</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-stroke pt-4 dark:border-strokedark">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded border border-stroke px-6 py-2 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white">Batal</button>
                <button type="submit" disabled={isLoading} className="rounded bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
