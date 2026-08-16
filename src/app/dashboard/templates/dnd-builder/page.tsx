"use client";

import React from "react";
import BuilderLayout from "@/components/dnd-builder/BuilderLayout";

export default function DndBuilderPage() {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-meta-4">
      {/* Top Navigation Bar */}
      <div className="h-14 border-b border-stroke dark:border-strokedark flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.history.back()}
            className="text-sm font-medium hover:text-brand-500 transition-colors"
          >
            ← Kembali
          </button>
          <span className="mx-2 text-gray-300">|</span>
          <span className="font-semibold">Visual Builder V2</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium hover:text-brand-500">Global Settings</button>
          <button className="rounded bg-brand-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-opacity-90 transition-colors">
            Simpan Tema
          </button>
        </div>
      </div>
      
      {/* Main Builder UI */}
      <div style={{ height: 'calc(100vh - 56px)' }}>
        <BuilderLayout />
      </div>
    </div>
  );
}
