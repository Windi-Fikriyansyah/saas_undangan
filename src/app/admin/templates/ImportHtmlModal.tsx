"use client";

import { useState } from "react";
import { upsertTemplate } from "@/app/actions/admin";

export default function ImportHtmlModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "Custom HTML",
    tier: "PREMIUM",
    isActive: true,
    thumbnailUrl: "",
    htmlContent: ""
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
      // Build the JSON config for a raw-html block
      const configJson = {
        version: "1.0.0",
        colors: {},
        typography: {},
        settings: {
          theme: "custom-html",
          navigation: { enabled: false },
          music: { enabled: false }
        },
        blocks: [
          {
            id: "html-template",
            type: "raw-html",
            props: {
              html: formData.htmlContent
            }
          }
        ]
      };

      const payload = {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        tier: formData.tier,
        isActive: formData.isActive,
        thumbnailUrl: formData.thumbnailUrl,
        configJson: JSON.stringify(configJson)
      };

      await upsertTemplate(payload);
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
        className="rounded bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700 ml-3"
      >
        Import HTML
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-3xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Import Custom HTML Template
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black dark:hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">ID Tema (Unik)</label>
                  <input type="text" name="id" value={formData.id} onChange={handleChange} required placeholder="contoh: html-premium-1" className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Nama Tema</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nama Template" className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark" />
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
                    <label className="block text-sm font-medium text-black dark:text-white">Raw HTML Code</label>
                    <span className="text-xs text-gray-500">Gunakan sintaks <code>{`{{guest.name}}`}</code> untuk nama tamu</span>
                  </div>
                  <textarea name="htmlContent" value={formData.htmlContent} onChange={handleChange} required rows={10} placeholder="<!DOCTYPE html>&#10;<html>&#10;..." className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none dark:border-strokedark font-mono text-sm"></textarea>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} id="html-isActive" />
                  <label htmlFor="html-isActive" className="text-sm font-medium text-black dark:text-white">Aktif (Bisa digunakan klien)</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-stroke pt-4 dark:border-strokedark">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded border border-stroke px-6 py-2 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white">Batal</button>
                <button type="submit" disabled={isLoading} className="rounded bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                  {isLoading ? "Menyimpan..." : "Simpan HTML"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
