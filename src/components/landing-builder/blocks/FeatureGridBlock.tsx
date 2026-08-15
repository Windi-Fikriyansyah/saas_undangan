import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const FeatureGridSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  }))
});

type FeatureGridData = z.infer<typeof FeatureGridSchema>;

const FeatureGridComponent = ({ data }: { data: FeatureGridData }) => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 text-gray-900">{data.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {data.features.map((feature, idx) => (
          <div key={idx} className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-12 h-12 mx-auto bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4 text-xl">
              {feature.icon || "✨"}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureGridEditor = ({ data, onChange }: { data: FeatureGridData; onChange: (data: FeatureGridData) => void }) => {
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
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-3">Daftar Fitur</label>
        {data.features.map((feature, idx) => (
          <div key={idx} className="p-3 bg-gray-50 border rounded mb-3 space-y-2 relative">
            <button 
              onClick={() => {
                const newFeatures = [...data.features];
                newFeatures.splice(idx, 1);
                onChange({ ...data, features: newFeatures });
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
            >
              X
            </button>
            <input 
              type="text" 
              placeholder="Icon (Emoji)"
              value={feature.icon}
              onChange={(e) => {
                const newFeatures = [...data.features];
                newFeatures[idx].icon = e.target.value;
                onChange({ ...data, features: newFeatures });
              }}
              className="w-12 border rounded px-2 py-1 text-center"
            />
            <input 
              type="text" 
              placeholder="Judul Fitur"
              value={feature.title}
              onChange={(e) => {
                const newFeatures = [...data.features];
                newFeatures[idx].title = e.target.value;
                onChange({ ...data, features: newFeatures });
              }}
              className="w-full border rounded px-3 py-1"
            />
            <textarea 
              placeholder="Deskripsi Fitur"
              value={feature.description}
              onChange={(e) => {
                const newFeatures = [...data.features];
                newFeatures[idx].description = e.target.value;
                onChange({ ...data, features: newFeatures });
              }}
              className="w-full border rounded px-3 py-1 text-sm"
              rows={2}
            />
          </div>
        ))}
        <button 
          onClick={() => onChange({ 
            ...data, 
            features: [...data.features, { title: "Fitur Baru", description: "Deskripsi", icon: "⭐" }] 
          })}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
        >
          + Tambah Fitur
        </button>
      </div>
    </div>
  );
};

export const FeatureGridDef: BlockDefinition<FeatureGridData> = {
  type: "feature-grid",
  label: "Grid Fitur",
  category: "Content",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
  defaultData: {
    title: "Mengapa Memilih Kami?",
    subtitle: "Kami memberikan pengalaman terbaik untuk hari spesial Anda.",
    features: [
      { title: "Desain Elegan", description: "Pilihan desain premium untuk berbagai tema.", icon: "🎨" },
      { title: "Mudah Digunakan", description: "Manajemen tamu yang praktis dan mudah.", icon: "⚡" },
      { title: "Harga Terjangkau", description: "Kualitas terbaik dengan harga yang bersahabat.", icon: "💰" }
    ]
  },
  schema: FeatureGridSchema,
  component: FeatureGridComponent,
  editor: FeatureGridEditor,
};
