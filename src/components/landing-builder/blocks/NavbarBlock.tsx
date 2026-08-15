import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const NavbarSchema = z.object({
  logoText: z.string(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })),
  buttonText: z.string(),
  buttonUrl: z.string(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  buttonColor: z.string().optional(),
});

type NavbarData = z.infer<typeof NavbarSchema>;

const NavbarComponent = ({ data, isPreview }: { data: NavbarData, isPreview?: boolean }) => {
  return (
    <div 
      className="border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm"
      style={{ backgroundColor: data.backgroundColor || "#ffffff", color: data.textColor || "#111827" }}
    >
      <div className="font-bold text-xl">{data.logoText}</div>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        {data.links.map((link, idx) => (
          <a key={idx} href={isPreview ? "#" : link.url} className="hover:text-brand-500 transition">
            {link.label}
          </a>
        ))}
      </div>
      {data.buttonText && (
        <a 
          href={isPreview ? "#" : data.buttonUrl}
          className="px-5 py-2 rounded-md text-sm font-medium transition hover:opacity-90"
          style={{ backgroundColor: data.buttonColor || "#3b82f6", color: "#ffffff" }}
        >
          {data.buttonText}
        </a>
      )}
    </div>
  );
};

const NavbarEditor = ({ data, onChange }: { data: NavbarData; onChange: (data: NavbarData) => void }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Teks Logo</label>
        <input 
          type="text" 
          value={data.logoText} 
          onChange={(e) => onChange({ ...data, logoText: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-3">Menu Navigasi</label>
        {data.links.map((link, idx) => (
          <div key={idx} className="flex gap-2 mb-2 relative">
            <input 
              type="text" 
              placeholder="Label"
              value={link.label}
              onChange={(e) => {
                const newLinks = [...data.links];
                newLinks[idx].label = e.target.value;
                onChange({ ...data, links: newLinks });
              }}
              className="w-1/2 border rounded px-3 py-1 text-sm"
            />
            <input 
              type="text" 
              placeholder="URL"
              value={link.url}
              onChange={(e) => {
                const newLinks = [...data.links];
                newLinks[idx].url = e.target.value;
                onChange({ ...data, links: newLinks });
              }}
              className="w-1/2 border rounded px-3 py-1 text-sm"
            />
            <button 
              onClick={() => {
                const newLinks = [...data.links];
                newLinks.splice(idx, 1);
                onChange({ ...data, links: newLinks });
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
            links: [...data.links, { label: "Menu Baru", url: "#" }] 
          })}
          className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
        >
          + Tambah Menu
        </button>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-1">Teks Tombol CTA</label>
        <input 
          type="text" 
          value={data.buttonText} 
          onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL Tombol CTA</label>
        <input 
          type="text" 
          value={data.buttonUrl} 
          onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-1">Warna Background (Hex)</label>
        <div className="flex gap-2">
          <input type="color" value={data.backgroundColor || "#ffffff"} onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border p-1" />
          <input type="text" value={data.backgroundColor || ""} onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })} className="flex-1 border rounded px-3 py-2" placeholder="#ffffff" />
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

export const NavbarBlockDef: BlockDefinition<NavbarData> = {
  type: "navbar",
  label: "Navbar",
  category: "Navigation",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  defaultData: {
    logoText: "UndanganKu",
    links: [
      { label: "Home", url: "#" },
      { label: "Templates", url: "#templates" },
      { label: "Pricing", url: "#pricing" },
      { label: "Contact", url: "#contact" },
    ],
    buttonText: "Pesan Sekarang",
    buttonUrl: "#order",
  },
  schema: NavbarSchema,
  component: NavbarComponent,
  editor: NavbarEditor,
};
