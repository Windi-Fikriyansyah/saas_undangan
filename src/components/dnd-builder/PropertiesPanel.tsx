"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { Trash2 } from "lucide-react";

export default function PropertiesPanel() {
  const { selectedBlockId, getBlockById, removeBlock } = useBuilderStore();

  if (!selectedBlockId) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-gray-400">
        <p className="text-sm">Pilih komponen di kanvas untuk melihat pengaturannya.</p>
      </div>
    );
  }

  const block = getBlockById(selectedBlockId);

  if (!block) return null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-stroke dark:border-strokedark flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold capitalize">{block.type}</h2>
          <p className="text-xs text-gray-500 font-mono">{block.id.split('-')[0]}</p>
        </div>
        <button 
          onClick={() => removeBlock(block.id)}
          className="text-danger hover:bg-danger hover:bg-opacity-10 p-2 rounded transition-colors"
          title="Hapus komponen"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Placeholder for Dynamic Property Forms */}
        <div className="text-sm text-gray-500 mb-4">
          Pengaturan untuk {block.type} akan muncul di sini (Task 4 & 5).
        </div>

        {/* Dummy Input for visual completeness */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Contoh Teks</label>
          <input 
            type="text" 
            className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-sm outline-none dark:border-strokedark"
            placeholder="Ketik sesuatu..."
          />
        </div>
      </div>
    </div>
  );
}
