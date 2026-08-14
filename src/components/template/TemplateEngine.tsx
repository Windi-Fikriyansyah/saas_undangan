"use client";

import React, { useState, useEffect } from 'react';
import { Code, X, RefreshCw, Sparkles } from 'lucide-react';
import { TemplateConfig } from "@/lib/validations/template-config";
import WeddingRenderer from "@/components/wedding/WeddingRenderer";

interface TemplateProps {
  templateName: string;
  config: TemplateConfig | any;
  data: any;
  orderId?: string;
  guests?: any[];
  guestName?: string;
  isPreviewMode?: boolean;
  isBuilder?: boolean;
}

export default function TemplateEngine({ templateName, data, config: dbConfig, orderId, guests, guestName, isPreviewMode, isBuilder }: TemplateProps) {
  // Use dbConfig if available, else empty
  const initialConfig = (dbConfig && dbConfig.blocks && dbConfig.blocks.length > 0) ? dbConfig : { blocks: [] };
  
  const [config, setConfig] = useState<any>(initialConfig);
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(initialConfig, null, 2));

  // Extract Guest Info from URL parameters
  const [guestInfo, setGuestInfo] = useState({
    name: guestName || 'Tamu Undangan',
    parents: 'Bapak & Ibu Terhormat'
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to') || params.get('name');
    const parents = params.get('parents');
    if (name || parents) {
      setGuestInfo({
        name: name || guestName || 'Tamu Undangan',
        parents: parents || 'Bapak & Ibu Terhormat'
      });
    }
  }, [guestName]);

  // Sync state if dbConfig changes externally
  useEffect(() => {
    if (dbConfig && dbConfig.blocks && dbConfig.blocks.length > 0) {
      setConfig(dbConfig);
      setJsonInput(JSON.stringify(dbConfig, null, 2));
    }
  }, [dbConfig]);

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setConfig(parsed);
      setIsConfigDrawerOpen(false);
    } catch (err) {
      alert("Invalid JSON structure format!");
    }
  };

  if (!config.blocks || config.blocks.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4 text-center">
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-xl max-w-md">
          <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-[#F5F3EF]">Tema Kosong</h2>
          <p className="mt-2 text-gray-400 font-light">
            Konfigurasi blocks di database Anda kosong. Silakan tambahkan schema blocks melalui panel Admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* NEW WEDDING TEMPLATE ENGINE */}
      <WeddingRenderer config={config} data={{ ...data, guest: guestInfo }} isPreviewMode={isPreviewMode} />

      {/* FLOATING ADMIN CONTROLS */}
      {isBuilder && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <button
            onClick={() => setIsConfigDrawerOpen(true)}
            className="w-12 h-12 rounded-full bg-[#0F211B]/80 backdrop-blur-xl flex items-center justify-center text-[#F5F3EF] border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all hover:scale-105 active:scale-95"
            title="Edit JSON Config"
          >
            <Code className="w-5 h-5 text-[#D4AF37]" />
          </button>
        </div>
      )}

      {/* LIVE JSON SCHEMA CONFIG DRAWER */}
      {isBuilder && isConfigDrawerOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xl bg-[#0F211B] border-l border-white/10 p-6 flex flex-col h-full shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif text-xl text-[#F5F3EF]">JSON Config Engine</h3>
              </div>
              <button onClick={() => setIsConfigDrawerOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-[#F5F3EF]/60 mb-3">
              Edit JSON structure directly below to update template rendering live:
            </p>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="flex-1 w-full bg-[#050B09] border border-white/10 rounded-xl p-4 font-mono text-xs text-[#D4AF37] focus:outline-none focus:border-[#D4AF37] resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setJsonInput(JSON.stringify(config, null, 2))}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3EF] hover:bg-white/10 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
              <button
                onClick={handleApplyJson}
                className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-black font-medium text-xs tracking-widest uppercase hover:bg-white transition-colors"
              >
                Apply JSON Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
