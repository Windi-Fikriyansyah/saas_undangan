"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MapperFormProps {
  templateId: string;
  schema: Record<string, { type: string; default: string }>;
  initialMapping: Record<string, string>;
}

const AVAILABLE_FIELDS = [
  { group: "Mempelai", fields: [
    { value: "step1.brideNickname", label: "Panggilan Wanita" },
    { value: "step1.groomNickname", label: "Panggilan Pria" },
    { value: "step1.brideFullName", label: "Lengkap Wanita" },
    { value: "step1.groomFullName", label: "Lengkap Pria" },
    { value: "step1.brideParents", label: "Ortu Wanita" },
    { value: "step1.groomParents", label: "Ortu Pria" },
  ]},
  { group: "Acara", fields: [
    { value: "step2.akadDate", label: "Tanggal Akad" },
    { value: "step2.akadTime", label: "Waktu Akad" },
    { value: "step2.akadLocation", label: "Lokasi Akad" },
    { value: "step2.resepsiDate", label: "Tanggal Resepsi" },
    { value: "step2.resepsiTime", label: "Waktu Resepsi" },
    { value: "step2.resepsiLocation", label: "Lokasi Resepsi" },
  ]},
  { group: "Cerita & Ekstra", fields: [
    { value: "step3.loveStory", label: "Cerita Cinta" },
    { value: "step4.quote", label: "Kutipan / Doa" },
    { value: "step4.quoteAuthor", label: "Penulis Kutipan" },
    { value: "step4.liveStreamUrl", label: "Link Streaming" },
    { value: "step4.bankName", label: "Nama Bank" },
    { value: "step4.bankAccount", label: "No. Rekening" },
    { value: "step4.bankAccountName", label: "Atas Nama" },
  ]},
  { group: "Gambar", fields: [
    { value: "step1.brideImage", label: "Foto Wanita (Upload)" },
    { value: "step1.groomImage", label: "Foto Pria (Upload)" },
    { value: "step1.coverImage", label: "Cover Depan (Upload)" },
  ]}
];

export default function MapperForm({ templateId, schema, initialMapping }: MapperFormProps) {
  const router = useRouter();
  const [mapping, setMapping] = useState<Record<string, string>>(initialMapping);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleSelect = (key: string, value: string) => {
    setMapping(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/templates/${templateId}/mapping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapping })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ type: "success", text: "Mapping berhasil disimpan!" });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const textKeys = Object.entries(schema).filter(([_, v]) => v.type === 'text');
  const imgKeys = Object.entries(schema).filter(([_, v]) => v.type === 'image');

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* TEXT SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Teks ({textKeys.length})</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {textKeys.map(([key, item]) => (
            <div key={key} className="flex items-center gap-6 p-6">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                  {item.default}
                </p>
                <code className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {key}
                </code>
              </div>
              <div className="w-64 shrink-0">
                <select 
                  value={mapping[key] || ""} 
                  onChange={(e) => handleSelect(key, e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">-- Biarkan Bawaan --</option>
                  {AVAILABLE_FIELDS.filter(g => g.group !== "Gambar").map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.fields.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {textKeys.length === 0 && (
            <div className="p-6 text-center text-gray-500">Tidak ada teks dinamis ditemukan.</div>
          )}
        </div>
      </div>

      {/* IMAGE SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Gambar ({imgKeys.length})</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {imgKeys.map(([key, item]) => (
            <div key={key} className="flex items-center gap-6 p-6">
              <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative bg-gray-100">
                <img src={item.default} alt={key} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <code className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block w-max mb-2">
                  {key}
                </code>
              </div>
              <div className="w-64 shrink-0">
                <select 
                  value={mapping[key] || ""} 
                  onChange={(e) => handleSelect(key, e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">-- Biarkan Bawaan --</option>
                  <optgroup label="Gambar Klien">
                    {AVAILABLE_FIELDS.find(g => g.group === "Gambar")?.fields.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          ))}
           {imgKeys.length === 0 && (
            <div className="p-6 text-center text-gray-500">Tidak ada gambar dinamis ditemukan.</div>
          )}
        </div>
      </div>

      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Mapping"}
        </button>
      </div>

    </div>
  );
}
