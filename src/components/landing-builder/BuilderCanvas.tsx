import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBuilderStore } from "./store";
import { BlockRegistry } from "./BlockRegistry";

const SortableBlock = ({ id, type, data }: { id: string, type: string, data: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: "canvas-block",
    }
  });
  
  const { selectBlock, selectedBlockId } = useBuilderStore();
  const isSelected = selectedBlockId === id;
  const BlockDef = BlockRegistry[type];
  
  if (!BlockDef) return null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group border-2 ${isSelected ? "border-brand-500" : "border-transparent hover:border-brand-300 border-dashed"} cursor-pointer mb-2`}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(id);
      }}
    >
      <div 
        {...attributes} 
        {...listeners}
        className={`absolute top-0 right-0 bg-brand-500 text-white p-1 rounded-bl shadow cursor-grab ${isSelected || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity z-10`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </div>
      <BlockDef.component data={data} isPreview />
    </div>
  );
};

export const BuilderCanvas = () => {
  const { blocks, selectBlock } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
    data: {
      type: "canvas",
    },
  });

  return (
    <div 
      className="flex-1 bg-gray-100 p-8 overflow-y-auto h-[calc(100vh-80px)]"
      onClick={() => selectBlock(null)}
    >
      <div 
        ref={setNodeRef} 
        className={`max-w-4xl mx-auto min-h-[500px] bg-white shadow-sm rounded-lg overflow-hidden transition-colors ${
          isOver ? "ring-2 ring-brand-500 bg-brand-50/50" : ""
        }`}
      >
        {blocks.length === 0 ? (
          <div className="h-[500px] flex items-center justify-center flex-col text-gray-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="mb-4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
            <p>Tarik komponen ke sini untuk mulai membuat halaman</p>
          </div>
        ) : (
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <SortableBlock key={block.id} id={block.id} type={block.type} data={block.data} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};
