"use client";

import React, { useState } from "react";
import Palette from "./Palette";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import { useBuilderStore } from "@/store/useBuilderStore";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export default function BuilderLayout() {
  const { reorderBlocks, addBlock } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // If dragging from palette
      if (active.data.current?.isPaletteItem) {
        const type = active.data.current.type;
        addBlock(type); // Simplistic add for now. Proper insertion needs index mapping.
      } else {
        // Reordering existing blocks
        reorderBlocks(active.id, over.id);
      }
    }
    
    setActiveId(null);
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden text-black dark:text-white">
        {/* Left Sidebar: Palette */}
        <div className="w-64 border-r border-stroke bg-white dark:border-strokedark dark:bg-boxdark flex-shrink-0 flex flex-col">
          <Palette />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-md bg-white dark:bg-boxdark shadow-xl min-h-[800px] border border-stroke dark:border-strokedark relative">
             <Canvas />
          </div>
        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-80 border-l border-stroke bg-white dark:border-strokedark dark:bg-boxdark flex-shrink-0 flex flex-col overflow-y-auto">
          <PropertiesPanel />
        </div>
      </div>
      
      <DragOverlay>
        {activeId ? (
          <div className="bg-brand-500 text-white px-4 py-2 rounded shadow-lg opacity-80">
            Moving Item...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
