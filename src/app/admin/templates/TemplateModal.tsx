"use client";

import { useState } from "react";
import { upsertTemplate } from "@/app/actions/admin";

export default function TemplateModal({ template }: { template?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: template?.id || "",
    name: template?.name || "",
    category: template?.category || "Minimalist",
    tier: template?.tier || "BASIC",
    isActive: template?.isActive ?? true,
    thumbnailUrl: template?.thumbnailUrl || "",
    configJson: template?.configJson ? JSON.stringify(template.configJson, null, 2) : "{\n  \"colors\": {},\n  \"typography\": {}\n}"
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
      await upsertTemplate(formData);
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
        className={template ? "text-primary hover:underline text-sm" : "rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"}
      >
        {template ? "Edit Template" : "Tambah Template"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {template ? "Edit Template" : "Tambah Template"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black dark:hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">ID Template</label>
                  <input type="text" name="id" value={formData.id} onChange={handleChange} required readOnly={!!template} className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Nama Template</label>
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
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Config JSON</label>
                  <textarea name="configJson" value={formData.configJson} onChange={handleChange} required rows={8} className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark font-mono text-sm"></textarea>
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
