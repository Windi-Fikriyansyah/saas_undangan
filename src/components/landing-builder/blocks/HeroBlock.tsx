import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const HeroBlockSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  buttonText: z.string(),
  buttonUrl: z.string(),
});

type HeroData = z.infer<typeof HeroBlockSchema>;

const HeroComponent = ({ data, isPreview }: { data: HeroData, isPreview?: boolean }) => {
  return (
    <div className="bg-brand-500 py-20 px-4 text-center text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
      <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">{data.subtitle}</p>
      {data.buttonText && (
        <a 
          href={isPreview ? "#" : data.buttonUrl} 
          className="inline-block bg-white text-brand-500 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition"
        >
          {data.buttonText}
        </a>
      )}
    </div>
  );
};

const HeroEditor = ({ data, onChange }: { data: HeroData; onChange: (data: HeroData) => void }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input 
          type="text" 
          value={data.title} 
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        <textarea 
          value={data.subtitle} 
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input 
          type="text" 
          value={data.buttonText} 
          onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button URL</label>
        <input 
          type="text" 
          value={data.buttonUrl} 
          onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
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
  },
  schema: HeroBlockSchema,
  component: HeroComponent,
  editor: HeroEditor,
};
