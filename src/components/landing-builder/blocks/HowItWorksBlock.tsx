import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const HowItWorksSchema = z.object({
  title: z.string(),
  steps: z.array(z.object({
    title: z.string(),
    description: z.string(),
  }))
});

type HowItWorksData = z.infer<typeof HowItWorksSchema>;

const HowItWorksComponent = ({ data }: { data: HowItWorksData }) => {
  return (
    <div className="py-20 px-4 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold">{data.title}</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 max-w-5xl mx-auto">
        {data.steps.map((step, idx) => (
          <div key={idx} className="flex-1 text-center relative group">
            {idx !== data.steps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gray-200" />
            )}
            <div className="w-20 h-20 mx-auto bg-brand-50 border-4 border-white shadow-md text-brand-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6 relative z-10">
              0{idx + 1}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm px-4">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HowItWorksEditor = ({ data, onChange }: { data: HowItWorksData; onChange: (data: HowItWorksData) => void }) => {
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
      
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium mb-3">Langkah-Langkah</label>
        {data.steps.map((step, idx) => (
          <div key={idx} className="p-3 bg-gray-50 border rounded mb-3 space-y-2 relative">
            <button 
              onClick={() => {
                const newSteps = [...data.steps];
                newSteps.splice(idx, 1);
                onChange({ ...data, steps: newSteps });
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
            >
              X
            </button>
            <div className="font-bold text-gray-400 mb-1">Langkah {idx + 1}</div>
            <input 
              type="text" 
              placeholder="Judul Langkah"
              value={step.title}
              onChange={(e) => {
                const newSteps = [...data.steps];
                newSteps[idx].title = e.target.value;
                onChange({ ...data, steps: newSteps });
              }}
              className="w-full border rounded px-3 py-1 font-semibold"
            />
            <textarea 
              placeholder="Deskripsi Singkat"
              value={step.description}
              onChange={(e) => {
                const newSteps = [...data.steps];
                newSteps[idx].description = e.target.value;
                onChange({ ...data, steps: newSteps });
              }}
              className="w-full border rounded px-3 py-1 text-sm"
              rows={2}
            />
          </div>
        ))}
        <button 
          onClick={() => onChange({ 
            ...data, 
            steps: [...data.steps, { title: "Langkah Baru", description: "Deskripsi langkah." }] 
          })}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
        >
          + Tambah Langkah
        </button>
      </div>
    </div>
  );
};

export const HowItWorksBlockDef: BlockDefinition<HowItWorksData> = {
  type: "how-it-works",
  label: "Cara Pemesanan",
  category: "Content",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
  ),
  defaultData: {
    title: "Cara Pemesanan",
    steps: [
      { title: "Pilih Template", description: "Pilih desain undangan yang Anda sukai dari galeri kami." },
      { title: "Kirim Data", description: "Isi formulir data mempelai dan detail acara." },
      { title: "Proses Pembuatan", description: "Kami akan memproses undangan Anda dalam 1x24 jam." },
      { title: "Undangan Siap", description: "Undangan siap disebar ke seluruh tamu Anda!" }
    ]
  },
  schema: HowItWorksSchema,
  component: HowItWorksComponent,
  editor: HowItWorksEditor,
};
