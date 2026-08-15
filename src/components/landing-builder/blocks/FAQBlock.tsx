import React, { useState } from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";

export const FAQSchema = z.object({
  title: z.string(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  }))
});

type FAQData = z.infer<typeof FAQSchema>;

const FAQComponent = ({ data }: { data: FAQData }) => {
  return (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{data.title}</h2>
        </div>
        <div className="space-y-4">
          {data.faqs.map((faq, idx) => (
            <details key={idx} className="group bg-white border border-gray-200 rounded-lg p-6 open:shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
                <span>{faq.question}</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed text-sm">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQEditor = ({ data, onChange }: { data: FAQData; onChange: (data: FAQData) => void }) => {
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
        <label className="block text-sm font-medium mb-3">Daftar Pertanyaan</label>
        {data.faqs.map((faq, idx) => (
          <div key={idx} className="p-3 bg-gray-50 border rounded mb-3 space-y-2 relative">
            <button 
              onClick={() => {
                const newFaqs = [...data.faqs];
                newFaqs.splice(idx, 1);
                onChange({ ...data, faqs: newFaqs });
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
            >
              X
            </button>
            <input 
              type="text" 
              placeholder="Pertanyaan"
              value={faq.question}
              onChange={(e) => {
                const newFaqs = [...data.faqs];
                newFaqs[idx].question = e.target.value;
                onChange({ ...data, faqs: newFaqs });
              }}
              className="w-full border rounded px-3 py-1 font-semibold text-sm"
            />
            <textarea 
              placeholder="Jawaban"
              value={faq.answer}
              onChange={(e) => {
                const newFaqs = [...data.faqs];
                newFaqs[idx].answer = e.target.value;
                onChange({ ...data, faqs: newFaqs });
              }}
              className="w-full border rounded px-3 py-1 text-sm"
              rows={3}
            />
          </div>
        ))}
        <button 
          onClick={() => onChange({ 
            ...data, 
            faqs: [...data.faqs, { question: "Pertanyaan Baru?", answer: "Jawaban untuk pertanyaan ini." }] 
          })}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
        >
          + Tambah FAQ
        </button>
      </div>
    </div>
  );
};

export const FAQBlockDef: BlockDefinition<FAQData> = {
  type: "faq",
  label: "FAQ / Tanya Jawab",
  category: "Information",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  defaultData: {
    title: "Pertanyaan yang Sering Diajukan",
    faqs: [
      { question: "Apa saja yang didapat?", answer: "Anda akan mendapatkan akses penuh ke template, manajemen tamu, dan buku tamu digital." },
      { question: "Berapa lama prosesnya?", answer: "Setelah pembayaran, undangan Anda bisa langsung digunakan hari itu juga." },
      { question: "Apakah bisa revisi?", answer: "Tentu, Anda bisa merubah data undangan kapan saja melalui dashboard admin yang disediakan." }
    ]
  },
  schema: FAQSchema,
  component: FAQComponent,
  editor: FAQEditor,
};
