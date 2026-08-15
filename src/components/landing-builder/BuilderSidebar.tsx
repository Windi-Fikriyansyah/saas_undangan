import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { BlockRegistry } from "./BlockRegistry";
import { useBuilderStore } from "./store";

const SidebarItem = ({ type, label, icon }: { type: string, label: string, icon: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: {
      type: "sidebar-item",
      blockType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 mb-2 rounded border bg-white cursor-grab hover:border-brand-500 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="text-gray-500">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export const BuilderSidebar = () => {
  const { selectedBlockId, blocks, updateBlock, removeBlock, pageMeta, setPageMeta } = useBuilderStore();
  
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const selectedBlockDef = selectedBlock ? BlockRegistry[selectedBlock.type] : null;

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full h-[calc(100vh-80px)] sticky top-0 overflow-hidden">
      
      {selectedBlock && selectedBlockDef ? (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <h3 className="font-semibold text-gray-800">Edit {selectedBlockDef.label}</h3>
            <button 
              onClick={() => removeBlock(selectedBlock.id)}
              className="text-danger hover:text-red-700 text-sm"
            >
              Hapus
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {selectedBlockDef.editor && (
              <selectedBlockDef.editor 
                data={selectedBlock.data} 
                onChange={(newData) => updateBlock(selectedBlock.id, newData)}
              />
            )}
          </div>
          <div className="p-4 border-t border-gray-200 bg-white">
            <button 
              onClick={() => useBuilderStore.getState().selectBlock(null)}
              className="w-full border border-gray-300 rounded py-2 text-sm font-medium hover:bg-gray-50"
            >
              Kembali ke Komponen
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-800 mb-4">Pengaturan Halaman</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-500">Nama Halaman</label>
                <input 
                  type="text" 
                  value={pageMeta.name}
                  onChange={(e) => setPageMeta({ name: e.target.value })}
                  placeholder="Promo Spesial"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-500">URL Slug</label>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-1">/</span>
                  <input 
                    type="text" 
                    value={pageMeta.slug}
                    onChange={(e) => setPageMeta({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    placeholder="promo-spesial"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Tambahkan Komponen</h3>
            <p className="text-xs text-gray-500 mb-4">Tarik komponen ke dalam canvas</p>
            
            {Object.entries(
              Object.values(BlockRegistry).reduce((acc, blockDef) => {
                const cat = blockDef.category || "Lainnya";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(blockDef);
                return acc;
              }, {} as Record<string, typeof BlockRegistry[keyof typeof BlockRegistry][]>)
            ).map(([category, blocks]) => (
              <div key={category} className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{category}</h4>
                {blocks.map((blockDef) => (
                  <SidebarItem 
                    key={blockDef.type} 
                    type={blockDef.type} 
                    label={blockDef.label} 
                    icon={blockDef.icon} 
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
