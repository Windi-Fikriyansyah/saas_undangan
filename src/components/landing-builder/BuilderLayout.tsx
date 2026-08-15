"use client";

import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { BuilderSidebar } from "./BuilderSidebar";
import { BuilderCanvas } from "./BuilderCanvas";
import { useBuilderStore } from "./store";
import { BlockRegistry } from "./BlockRegistry";

export const BuilderLayout = () => {
  const { blocks, addBlock, reorderBlocks } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
    if (active.data.current?.type === "sidebar-item") {
      setActiveDragType(active.data.current.blockType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveDragType(null);
    
    const { active, over } = event;
    if (!over) return;

    // Handle dropping new block from sidebar to canvas
    if (active.data.current?.type === "sidebar-item") {
      const blockType = active.data.current.blockType;
      const blockDef = BlockRegistry[blockType];
      if (blockDef) {
        // Find drop index if dropping over an existing block
        let dropIndex = blocks.length;
        if (over.id !== "canvas") {
          const overIndex = blocks.findIndex(b => b.id === over.id);
          // Insert after the hovered block
          dropIndex = overIndex >= 0 ? overIndex + 1 : blocks.length;
        }
        
        addBlock(blockType, blockDef.defaultData, dropIndex);
      }
      return;
    }

    // Handle reordering within canvas
    if (active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  };

  const getDragOverlay = () => {
    if (!activeId) return null;

    if (activeDragType) {
      const def = BlockRegistry[activeDragType];
      if (!def) return null;
      return (
        <div className="flex items-center gap-3 p-3 rounded border border-brand-500 bg-white shadow-lg opacity-80">
          <div className="text-brand-500">{def.icon}</div>
          <span className="text-sm font-medium">{def.label}</span>
        </div>
      );
    }

    // Canvas block overlay
    const block = blocks.find(b => b.id === activeId);
    if (block) {
      const BlockDef = BlockRegistry[block.type];
      return (
        <div className="border-2 border-brand-500 shadow-xl opacity-80 scale-[0.98] bg-white pointer-events-none">
          <BlockDef.component data={block.data} isPreview />
        </div>
      );
    }

    return null;
  };

  // Prevent hydration mismatch for dnd-kit portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-screen flex items-center justify-center">Loading builder...</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex w-full h-[calc(100vh-80px)] bg-white overflow-hidden">
        <BuilderSidebar />
        <BuilderCanvas />
      </div>
      <DragOverlay dropAnimation={{ duration: 250, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {getDragOverlay()}
      </DragOverlay>
    </DndContext>
  );
};
