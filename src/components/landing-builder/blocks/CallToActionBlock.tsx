import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const CallToActionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  buttonText: z.string(),
  buttonUrl: z.string(),
});

type CallToActionData = z.infer<typeof CallToActionSchema>;

const CallToActionComponent = ({ data, isPreview }: { data: CallToActionData, isPreview?: boolean }) => {
  return (
    <div className="py-20 px-4 bg-gray-900 text-center text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.title}</h2>
        <p className="text-lg text-gray-300 mb-8">{data.subtitle}</p>
        {data.buttonText && (
          <a 
            href={isPreview ? "#" : data.buttonUrl} 
            className="inline-block bg-brand-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-600 transition shadow-lg shadow-brand-500/30"
          >
            {data.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

const CallToActionEditor = ({ data, onChange }: { data: CallToActionData; onChange: (data: CallToActionData) => void }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Judul CTA</label>
        <input 
          type="text" 
          value={data.title} 
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sub Judul / Keterangan</label>
        <textarea 
          value={data.subtitle} 
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Teks Tombol</label>
        <input 
          type="text" 
          value={data.buttonText} 
          onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL / Link Tombol</label>
        <input 
          type="text" 
          value={data.buttonUrl} 
          onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="https://wa.me/..."
        />
      </div>
    </div>
  );
};

export const CallToActionBlockDef: BlockDefinition<CallToActionData> = {
  type: "call-to-action",
  label: "Call to Action",
  category: "Conversion",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  ),
  defaultData: {
    title: "Siap Membuat Undangan Anda?",
    subtitle: "Hubungi admin kami sekarang untuk berdiskusi tentang undangan pernikahan impian Anda. Proses cepat dan harga bersahabat.",
    buttonText: "Hubungi WhatsApp",
    buttonUrl: "",
  },
  schema: CallToActionSchema,
  component: CallToActionComponent,
  editor: CallToActionEditor,
};
