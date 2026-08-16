"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BuilderBlock } from "@/lib/validations/wedding-template";

// Temporary placeholder for Block rendering
function BlockRenderer({ block }: { block: BuilderBlock }) {
  return (
    <div className="p-4 bg-white dark:bg-meta-4 border border-stroke dark:border-strokedark rounded mb-2 flex items-center justify-between">
      <div>
        <span className="text-xs font-bold uppercase text-brand-500 mr-2">{block.type}</span>
        <span className="text-sm text-gray-500">{block.id.split('-')[0]}</span>
      </div>
    </div>
  );
}

function SortableBlock({ block }: { block: BuilderBlock }) {
  const { selectBlock, selectedBlockId } = useBuilderStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedBlockId === block.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
      className={`relative cursor-pointer transition-all ${isSelected ? "ring-2 ring-brand-500" : ""}`}
    >
      <BlockRenderer block={block} />
      {isSelected && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-brand-500 text-white text-[10px] px-2 py-1 rounded-full z-10">
          Selected
        </div>
      )}
    </div>
  );
}

export default function Canvas() {
  const { config, selectBlock } = useBuilderStore();
  const blocks = config.blocks;

  return (
    <div 
      className="w-full h-full min-h-[800px] p-4 flex flex-col"
      onClick={() => selectBlock(null)}
    >
      {blocks.length === 0 ? (
        <div className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400">
          <p>Tarik komponen ke sini</p>
        </div>
      ) : (
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {blocks.map((block) => (
              <SortableBlock key={block.id} block={block} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
