import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const FooterSchema = z.object({
  brandName: z.string(),
  description: z.string(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })),
  copyright: z.string(),
});

type FooterData = z.infer<typeof FooterSchema>;

const FooterComponent = ({ data, isPreview }: { data: FooterData, isPreview?: boolean }) => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-6 md:px-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start mb-12">
        <div className="text-center md:text-left mb-8 md:mb-0 max-w-sm">
          <h2 className="text-2xl font-bold mb-4">{data.brandName}</h2>
          <p className="text-gray-400 leading-relaxed text-sm">
            {data.description}
          </p>
        </div>
        
        <div className="flex gap-4">
          {data.socialLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={isPreview ? "#" : link.url} 
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-500 transition text-gray-400 hover:text-white"
            >
              <span className="text-xs uppercase">{link.platform.substring(0,2)}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-8 border-t border-gray-800 text-center md:text-left text-sm text-gray-500">
        {data.copyright}
      </div>
    </footer>
  );
};

const FooterEditor = ({ data, onChange }: { data: FooterData; onChange: (data: FooterData) => void }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nama Brand</label>
        <input 
          type="text" 
          value={data.brandName} 
          onChange={(e) => onChange({ ...data, brandName: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
        <textarea 
          value={data.description} 
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-3">Sosial Media</label>
        {data.socialLinks.map((link, idx) => (
          <div key={idx} className="flex gap-2 mb-2 relative">
            <input 
              type="text" 
              placeholder="Platform (IG/FB)"
              value={link.platform}
              onChange={(e) => {
                const newLinks = [...data.socialLinks];
                newLinks[idx].platform = e.target.value;
                onChange({ ...data, socialLinks: newLinks });
              }}
              className="w-1/3 border rounded px-3 py-1 text-sm"
            />
            <input 
              type="text" 
              placeholder="URL Profil"
              value={link.url}
              onChange={(e) => {
                const newLinks = [...data.socialLinks];
                newLinks[idx].url = e.target.value;
                onChange({ ...data, socialLinks: newLinks });
              }}
              className="w-2/3 border rounded px-3 py-1 text-sm"
            />
            <button 
              onClick={() => {
                const newLinks = [...data.socialLinks];
                newLinks.splice(idx, 1);
                onChange({ ...data, socialLinks: newLinks });
              }}
              className="text-red-500 hover:text-red-700 font-bold px-2"
            >
              X
            </button>
          </div>
        ))}
        <button 
          onClick={() => onChange({ 
            ...data, 
            socialLinks: [...data.socialLinks, { platform: "IG", url: "#" }] 
          })}
          className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
        >
          + Tambah Sosmed
        </button>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-1">Teks Copyright</label>
        <input 
          type="text" 
          value={data.copyright} 
          onChange={(e) => onChange({ ...data, copyright: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};

export const FooterBlockDef: BlockDefinition<FooterData> = {
  type: "footer",
  label: "Footer",
  category: "Navigation",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="14" width="18" height="7" rx="2" ry="2"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  defaultData: {
    brandName: "UndanganKu",
    description: "Undangan digital elegan dan modern untuk menyempurnakan hari bahagia Anda. Bagikan momen tak terlupakan dengan mudah.",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "TikTok", url: "#" },
      { platform: "WhatsApp", url: "#" },
    ],
    copyright: "© 2026 UndanganKu. Hak cipta dilindungi undang-undang.",
  },
  schema: FooterSchema,
  component: FooterComponent,
  editor: FooterEditor,
};
