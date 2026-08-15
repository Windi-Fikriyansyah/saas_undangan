import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const TemplateShowcaseSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  templates: z.array(z.object({
    name: z.string(),
    price: z.string(),
    imageUrl: z.string(),
    demoUrl: z.string(),
  }))
});

type TemplateShowcaseData = z.infer<typeof TemplateShowcaseSchema>;

const TemplateShowcaseComponent = ({ data, isPreview }: { data: TemplateShowcaseData, isPreview?: boolean }) => {
  return (
    <div className="py-20 px-4 bg-gray-50" id="templates">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {data.templates.map((tpl, idx) => (
          <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
              {tpl.imageUrl ? (
                <img src={tpl.imageUrl} alt={tpl.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>[Gambar Template]</span>
                </div>
              )}
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
                <p className="text-brand-500 font-medium text-sm">{tpl.price}</p>
              </div>
              <a 
                href={isPreview ? "#" : tpl.demoUrl} 
                target={isPreview ? "_self" : "_blank"}
                rel="noreferrer"
                className="px-4 py-2 border border-brand-500 text-brand-500 rounded text-sm hover:bg-brand-50 transition"
              >
                Lihat Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TemplateShowcaseEditor = ({ data, onChange }: { data: TemplateShowcaseData; onChange: (data: TemplateShowcaseData) => void }) => {
  return (
    <div className="space-y-4">
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
        <label className="block text-sm font-medium mb-3">Daftar Template</label>
        {data.templates.map((tpl, idx) => (
          <div key={idx} className="p-3 bg-gray-50 border rounded mb-3 space-y-2 relative">
            <button 
              onClick={() => {
                const newTpl = [...data.templates];
                newTpl.splice(idx, 1);
                onChange({ ...data, templates: newTpl });
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
            >
              X
            </button>
            <input 
              type="text" 
              placeholder="Nama Template"
              value={tpl.name}
              onChange={(e) => {
                const newTpl = [...data.templates];
                newTpl[idx].name = e.target.value;
                onChange({ ...data, templates: newTpl });
              }}
              className="w-full border rounded px-3 py-1 font-semibold"
            />
            <input 
              type="text" 
              placeholder="Harga (misal: Rp 99.000)"
              value={tpl.price}
              onChange={(e) => {
                const newTpl = [...data.templates];
                newTpl[idx].price = e.target.value;
                onChange({ ...data, templates: newTpl });
              }}
              className="w-full border rounded px-3 py-1"
            />
            <input 
              type="text" 
              placeholder="URL Gambar Thumbnail"
              value={tpl.imageUrl}
              onChange={(e) => {
                const newTpl = [...data.templates];
                newTpl[idx].imageUrl = e.target.value;
                onChange({ ...data, templates: newTpl });
              }}
              className="w-full border rounded px-3 py-1 text-sm"
            />
            <input 
              type="text" 
              placeholder="URL Live Demo"
              value={tpl.demoUrl}
              onChange={(e) => {
                const newTpl = [...data.templates];
                newTpl[idx].demoUrl = e.target.value;
                onChange({ ...data, templates: newTpl });
              }}
              className="w-full border rounded px-3 py-1 text-sm"
            />
          </div>
        ))}
        <button 
          onClick={() => onChange({ 
            ...data, 
            templates: [...data.templates, { name: "Nama Template", price: "Rp 50.000", imageUrl: "", demoUrl: "#" }] 
          })}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
        >
          + Tambah Template
        </button>
      </div>
    </div>
  );
};

export const TemplateShowcaseBlockDef: BlockDefinition<TemplateShowcaseData> = {
  type: "template-showcase",
  label: "Template Showcase ⭐",
  category: "Content",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
  ),
  defaultData: {
    title: "Pilih Desain Favorit Anda",
    subtitle: "Ratusan koleksi template premium siap pakai.",
    templates: [
      { name: "Elegant Floral", price: "Rp 99.000", imageUrl: "", demoUrl: "#" },
      { name: "Minimalist Modern", price: "Rp 99.000", imageUrl: "", demoUrl: "#" },
      { name: "Traditional Java", price: "Rp 99.000", imageUrl: "", demoUrl: "#" },
    ]
  },
  schema: TemplateShowcaseSchema,
  component: TemplateShowcaseComponent,
  editor: TemplateShowcaseEditor,
};
