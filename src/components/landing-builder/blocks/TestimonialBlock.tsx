import React from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const TestimonialSchema = z.object({
  title: z.string(),
  testimonials: z.array(z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
  }))
});

type TestimonialData = z.infer<typeof TestimonialSchema>;

const TestimonialComponent = ({ data }: { data: TestimonialData }) => {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">{data.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {data.testimonials.map((testi, idx) => (
          <div key={idx} className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex gap-1 text-brand-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <p className="text-gray-700 italic mb-6">"{testi.quote}"</p>
            <div>
              <h4 className="font-semibold text-gray-900">{testi.author}</h4>
              <p className="text-sm text-gray-500">{testi.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialEditor = ({ data, onChange }: { data: TestimonialData; onChange: (data: TestimonialData) => void }) => {
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
        <label className="block text-sm font-medium mb-3">Daftar Testimoni</label>
        {data.testimonials.map((testi, idx) => (
          <div key={idx} className="p-3 bg-gray-50 border rounded mb-3 space-y-2 relative">
            <button 
              onClick={() => {
                const newList = [...data.testimonials];
                newList.splice(idx, 1);
                onChange({ ...data, testimonials: newList });
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
            >
              X
            </button>
            <textarea 
              placeholder="Isi Testimoni"
              value={testi.quote}
              onChange={(e) => {
                const newList = [...data.testimonials];
                newList[idx].quote = e.target.value;
                onChange({ ...data, testimonials: newList });
              }}
              className="w-full border rounded px-3 py-1 text-sm"
              rows={3}
            />
            <input 
              type="text" 
              placeholder="Nama Klien"
              value={testi.author}
              onChange={(e) => {
                const newList = [...data.testimonials];
                newList[idx].author = e.target.value;
                onChange({ ...data, testimonials: newList });
              }}
              className="w-full border rounded px-3 py-1"
            />
            <input 
              type="text" 
              placeholder="Keterangan (Mempelai, dsb)"
              value={testi.role}
              onChange={(e) => {
                const newList = [...data.testimonials];
                newList[idx].role = e.target.value;
                onChange({ ...data, testimonials: newList });
              }}
              className="w-full border rounded px-3 py-1 text-sm"
            />
          </div>
        ))}
        <button 
          onClick={() => onChange({ 
            ...data, 
            testimonials: [...data.testimonials, { quote: "Pelayanan sangat memuaskan!", author: "Klien Baru", role: "Mempelai" }] 
          })}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
        >
          + Tambah Testimoni
        </button>
      </div>
    </div>
  );
};

export const TestimonialBlockDef: BlockDefinition<TestimonialData> = {
  type: "testimonial",
  label: "Testimoni",
  category: "Social Proof",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  defaultData: {
    title: "Apa Kata Mereka?",
    testimonials: [
      { quote: "Desain undangannya sangat cantik dan elegan. Tamu kami banyak yang memuji!", author: "Andi & Siska", role: "Mempelai" },
      { quote: "Sangat mudah digunakan dan prosesnya cepat. Sangat merekomendasikan layanan ini.", author: "Budi & Tari", role: "Mempelai" }
    ]
  },
  schema: TestimonialSchema,
  component: TestimonialComponent,
  editor: TestimonialEditor,
};
