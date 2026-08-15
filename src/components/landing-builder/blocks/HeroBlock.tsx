import React, { useState } from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";
import ImageUploader from "@/components/ui/ImageUploader";

export const HeroBlockSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  buttonText: z.string(),
  buttonUrl: z.string(),
  backgroundImage: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  buttonColor: z.string().optional(),
});

type HeroData = z.infer<typeof HeroBlockSchema>;

const HeroComponent = ({ data, isPreview }: { data: HeroData, isPreview?: boolean }) => {
  const hasBgImage = !!data.backgroundImage;
  
  return (
    <div 
      className={`relative py-24 px-4 text-center overflow-hidden`}
      style={{
        backgroundColor: data.backgroundColor || (hasBgImage ? "#000" : "#f8fafc"),
        color: data.textColor || (hasBgImage ? "#ffffff" : "#111827"),
      }}
    >
      {/* Background Image with Overlay */}
      {hasBgImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: `url(${data.backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </>
      )}

      <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{data.title}</h1>
        <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl">{data.subtitle}</p>
        {data.buttonText && (
          <a 
            href={isPreview ? "#" : data.buttonUrl} 
            className={`inline-block font-semibold px-8 py-3 rounded-full transition shadow-lg`}
            style={{
              backgroundColor: data.buttonColor || (hasBgImage ? "#ffffff" : "#3b82f6"),
              color: hasBgImage && !data.buttonColor ? "#111827" : "#ffffff",
            }}
          >
            {data.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

const HeroEditor = ({ data, onChange }: { data: HeroData; onChange: (data: HeroData) => void }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Judul Utama</label>
        <input 
          type="text" 
          value={data.title} 
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sub Judul</label>
        <textarea 
          value={data.subtitle} 
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-1">Teks Tombol</label>
        <input 
          type="text" 
          value={data.buttonText} 
          onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL Tombol</label>
        <input 
          type="text" 
          value={data.buttonUrl} 
          onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-1">Gambar Background</label>
        
        {data.backgroundImage && (
          <div className="mb-2 relative w-full h-32 rounded border overflow-hidden">
            <img src={data.backgroundImage} alt="Background" className="w-full h-full object-cover" />
            <button 
              onClick={async () => {
                // Hapus gambar lama dari server jika ada
                if (data.backgroundImage?.includes("r2.cloudflarestorage.com") || data.backgroundImage?.includes("pub-") || data.backgroundImage?.includes("/api/image?key=")) {
                  try {
                    await fetch("/api/upload/delete", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ url: data.backgroundImage }),
                    });
                  } catch (e) {
                    console.error("Failed to delete old image", e);
                  }
                }
                onChange({ ...data, backgroundImage: "" });
              }}
              className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
              title="Hapus Gambar"
            >
              ×
            </button>
          </div>
        )}

        {!data.backgroundImage && (
          <ImageUploader 
            onUploadSuccess={(url) => onChange({ ...data, backgroundImage: url })}
            folder="landing-pages"
          />
        )}
        <p className="text-xs text-gray-500 mt-1">Gunakan gambar landscape untuk hasil terbaik (Max 2MB). Biarkan kosong jika hanya ingin menggunakan warna.</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Warna Background (Hex)</label>
        <div className="flex gap-2">
          <input type="color" value={data.backgroundColor || "#f8fafc"} onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border p-1" />
          <input type="text" value={data.backgroundColor || ""} onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })} className="flex-1 border rounded px-3 py-2" placeholder="#f8fafc" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Warna Teks (Hex)</label>
        <div className="flex gap-2">
          <input type="color" value={data.textColor || "#111827"} onChange={(e) => onChange({ ...data, textColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border p-1" />
          <input type="text" value={data.textColor || ""} onChange={(e) => onChange({ ...data, textColor: e.target.value })} className="flex-1 border rounded px-3 py-2" placeholder="#111827" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Warna Tombol (Hex)</label>
        <div className="flex gap-2">
          <input type="color" value={data.buttonColor || "#3b82f6"} onChange={(e) => onChange({ ...data, buttonColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border p-1" />
          <input type="text" value={data.buttonColor || ""} onChange={(e) => onChange({ ...data, buttonColor: e.target.value })} className="flex-1 border rounded px-3 py-2" placeholder="#3b82f6" />
        </div>
      </div>
    </div>
  );
};

export const HeroBlockDef: BlockDefinition<HeroData> = {
  type: "hero",
  label: "Hero Section",
  category: "Header",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
  ),
  defaultData: {
    title: "Buat Undangan Pernikahan Impian Anda",
    subtitle: "Solusi undangan digital terbaik dengan berbagai desain premium.",
    buttonText: "Lihat Desain",
    buttonUrl: "#templates",
    backgroundImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
    backgroundColor: "#000000",
  },
  schema: HeroBlockSchema,
  component: HeroComponent,
  editor: HeroEditor,
};
