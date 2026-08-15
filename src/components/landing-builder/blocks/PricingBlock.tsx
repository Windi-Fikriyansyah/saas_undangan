import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const PricingSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  packages: z.array(z.object({
    name: z.string(),
    price: z.string(),
    features: z.array(z.string()),
    isHighlighted: z.boolean(),
    buttonText: z.string(),
    buttonUrl: z.string(),
  })),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  highlightColor: z.string().optional(),
});

type PricingData = z.infer<typeof PricingSchema>;

const PricingComponent = ({ data, isPreview }: { data: PricingData, isPreview?: boolean }) => {
  const bgColor = data.backgroundColor || "#ffffff";
  const textColor = data.textColor || "#111827";
  const highlightColor = data.highlightColor || "#3b82f6"; // brand-500

  return (
    <div className="py-20 px-4" id="pricing" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="max-w-2xl mx-auto opacity-80">{data.subtitle}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {data.packages.map((pkg, idx) => (
          <div 
            key={idx} 
            className={`w-full md:w-80 p-8 rounded-2xl flex flex-col transition-all ${
              pkg.isHighlighted ? "shadow-xl transform md:-translate-y-4" : "border border-gray-100/10 shadow-sm"
            }`}
            style={pkg.isHighlighted ? { backgroundColor: highlightColor, color: "#ffffff" } : { backgroundColor: "rgba(0,0,0,0.02)" }}
          >
            <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold">{pkg.price}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: pkg.isHighlighted ? "#ffffff" : highlightColor }}><polyline points="20 6 9 17 4 12"/></svg>
                  <span className={pkg.isHighlighted ? "opacity-90" : "opacity-80"}>{feature}</span>
                </li>
              ))}
            </ul>
            <a 
              href={isPreview ? "#" : pkg.buttonUrl} 
              className="text-center py-3 rounded-lg font-semibold transition hover:opacity-90"
              style={pkg.isHighlighted ? { backgroundColor: "#ffffff", color: highlightColor } : { backgroundColor: highlightColor, color: "#ffffff" }}
            >
              {pkg.buttonText}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};


const PricingEditor = ({ data, onChange }: { data: PricingData; onChange: (data: PricingData) => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Judul Seksi</label>
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
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-3">Paket Harga</label>
        {data.packages.map((pkg, idx) => (
          <div key={idx} className="p-4 bg-gray-50 border rounded-lg mb-4 relative space-y-3">
            <button 
              onClick={() => {
                const newPkgs = [...data.packages];
                newPkgs.splice(idx, 1);
                onChange({ ...data, packages: newPkgs });
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
            >
              Hapus
            </button>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={pkg.isHighlighted}
                onChange={(e) => {
                  const newPkgs = [...data.packages];
                  newPkgs[idx].isHighlighted = e.target.checked;
                  onChange({ ...data, packages: newPkgs });
                }}
              />
              <span className="text-sm font-medium text-brand-600">Highlight (Rekomendasi)</span>
            </div>

            <input 
              type="text" 
              placeholder="Nama Paket"
              value={pkg.name}
              onChange={(e) => {
                const newPkgs = [...data.packages];
                newPkgs[idx].name = e.target.value;
                onChange({ ...data, packages: newPkgs });
              }}
              className="w-full border rounded px-3 py-1 font-semibold"
            />
            <input 
              type="text" 
              placeholder="Harga (misal: Rp 99.000)"
              value={pkg.price}
              onChange={(e) => {
                const newPkgs = [...data.packages];
                newPkgs[idx].price = e.target.value;
                onChange({ ...data, packages: newPkgs });
              }}
              className="w-full border rounded px-3 py-1"
            />
            
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500">Fitur (pisahkan dengan koma)</label>
              <textarea 
                value={pkg.features.join(", ")}
                onChange={(e) => {
                  const newPkgs = [...data.packages];
                  newPkgs[idx].features = e.target.value.split(",").map(f => f.trim()).filter(f => f);
                  onChange({ ...data, packages: newPkgs });
                }}
                className="w-full border rounded px-3 py-1 text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Teks Tombol"
                value={pkg.buttonText}
                onChange={(e) => {
                  const newPkgs = [...data.packages];
                  newPkgs[idx].buttonText = e.target.value;
                  onChange({ ...data, packages: newPkgs });
                }}
                className="w-1/2 border rounded px-3 py-1 text-sm"
              />
              <input 
                type="text" 
                placeholder="URL Tombol"
                value={pkg.buttonUrl}
                onChange={(e) => {
                  const newPkgs = [...data.packages];
                  newPkgs[idx].buttonUrl = e.target.value;
                  onChange({ ...data, packages: newPkgs });
                }}
                className="w-1/2 border rounded px-3 py-1 text-sm"
              />
            </div>
          </div>
        ))}
        <button 
          onClick={() => onChange({ 
            ...data, 
            packages: [...data.packages, { name: "Paket Baru", price: "Rp 0", features: ["Fitur 1"], isHighlighted: false, buttonText: "Pesan", buttonUrl: "" }] 
          })}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
        >
          + Tambah Paket
        </button>
      </div>

      {/* Colors */}
      <div className="pt-4 border-t border-gray-200 grid gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Background (Hex)</label>
          <div className="flex gap-2">
            <input type="color" value={data.backgroundColor || "#ffffff"} onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border p-0.5" />
            <input type="text" value={data.backgroundColor || ""} onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })} className="flex-1 border rounded px-3 py-1 text-sm" placeholder="#ffffff" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teks Utama (Hex)</label>
          <div className="flex gap-2">
            <input type="color" value={data.textColor || "#111827"} onChange={(e) => onChange({ ...data, textColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border p-0.5" />
            <input type="text" value={data.textColor || ""} onChange={(e) => onChange({ ...data, textColor: e.target.value })} className="flex-1 border rounded px-3 py-1 text-sm" placeholder="#111827" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Warna Highlight (Hex)</label>
          <div className="flex gap-2">
            <input type="color" value={data.highlightColor || "#3b82f6"} onChange={(e) => onChange({ ...data, highlightColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border p-0.5" />
            <input type="text" value={data.highlightColor || ""} onChange={(e) => onChange({ ...data, highlightColor: e.target.value })} className="flex-1 border rounded px-3 py-1 text-sm" placeholder="#3b82f6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PricingBlockDef: BlockDefinition<PricingData> = {
  type: "pricing",
  label: "Harga / Paket",
  category: "Conversion",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  defaultData: {
    title: "Pilih Paket Undangan Anda",
    subtitle: "Harga terjangkau dengan fitur lengkap untuk hari bahagia Anda.",
    packages: [
      { 
        name: "Basic", 
        price: "Rp 49.000", 
        features: ["1 Template Pilihan", "Custom Nama Tamu", "Countdown Timer", "Google Maps"], 
        isHighlighted: false, 
        buttonText: "Pesan Basic", 
        buttonUrl: "#" 
      },
      { 
        name: "Premium", 
        price: "Rp 99.000", 
        features: ["Semua Fitur Basic", "Fitur RSVP", "Galeri Foto", "Background Music", "Love Story"], 
        isHighlighted: true, 
        buttonText: "Pesan Premium", 
        buttonUrl: "#" 
      }
    ]
  },
  schema: PricingSchema,
  component: PricingComponent,
  editor: PricingEditor,
};
