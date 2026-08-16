"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Type, Image, Layout, BoxSelect } from "lucide-react";

const PALETTE_ITEMS = [
  { type: "section", label: "Section", icon: <Layout size={18} />, category: "Layout" },
  { type: "heading", label: "Heading", icon: <Type size={18} />, category: "Elements" },
  { type: "image", label: "Image", icon: <Image size={18} />, category: "Elements" },
  { type: "cover", label: "Cover Block", icon: <BoxSelect size={18} />, category: "Invitation" },
  { type: "couple", label: "Couple Block", icon: <BoxSelect size={18} />, category: "Invitation" },
  { type: "events", label: "Events Block", icon: <BoxSelect size={18} />, category: "Invitation" },
];

function DraggableItem({ item }: { item: any }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: {
      type: item.type,
      isPaletteItem: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 mb-2 rounded border border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4 cursor-grab hover:border-brand-500 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="text-gray-500 dark:text-gray-400">{item.icon}</div>
      <span className="text-sm font-medium">{item.label}</span>
    </div>
  );
}

export default function Palette() {
  const categories = Array.from(new Set(PALETTE_ITEMS.map((i) => i.category)));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-stroke dark:border-strokedark">
        <h2 className="text-lg font-bold">Komponen</h2>
        <p className="text-xs text-gray-500">Tarik ke area kanvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {category}
            </h3>
            {PALETTE_ITEMS.filter((i) => i.category === category).map((item) => (
              <DraggableItem key={item.type} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
