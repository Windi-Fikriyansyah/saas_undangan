"use client";

import React, { useState } from "react";
import { useFabricStore } from "@/store/useFabricStore";
import { ELEMENT_PRESETS, type ElementPreset } from "@/lib/fabric/wedding-presets";
import { generateObjectId, centerObject } from "@/lib/fabric/fabric-helpers";
import { Eye, EyeOff, Lock, Unlock, GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";

// ─── Elements Tab ───
function ElementsTab() {
  const { canvas } = useFabricStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>("wedding");

  const categories = [
    { key: "wedding", label: "Blok Undangan", icon: "💒" },
    { key: "text", label: "Teks", icon: "T" },
    { key: "shape", label: "Bentuk", icon: "◻" },
    { key: "media", label: "Media", icon: "🖼" },
    { key: "decorative", label: "Dekoratif", icon: "✦" },
  ];

  const addElementToCanvas = async (preset: ElementPreset) => {
    if (!canvas) return;

    const fabric = await import("fabric");
    
    // Find the bottom-most point of existing objects to append below them
    const objects = canvas.getObjects().filter((o: any) => !o.data?.isGrid);
    let startY = 0;
    if (objects.length > 0) {
      startY = Math.max(...objects.map((o: any) => o.top + (o.getScaledHeight ? o.getScaledHeight() : o.height * (o.scaleY || 1))));
      // Add a little gap if we're adding a text/shape element (not a full section)
      if (preset.category !== "wedding") {
        startY += 20;
      }
    }

    // Default section height
    const sectionHeight = canvas.height! > 0 ? Math.min(canvas.height!, 932) : 932;
    const config = preset.create(canvas.width!, sectionHeight);

    // Handle preset groups (wedding sections with multiple children)
    if (config._isPresetGroup && config._children) {
      const children = config._children;
      for (const childConfig of children) {
        // Offset the top position of the preset by startY
        childConfig.top = (childConfig.top || 0) + startY;
        const obj = await createFabricObject(fabric, childConfig);
        if (obj) {
          canvas.add(obj);
        }
      }
      
      // Auto expand canvas height if needed
      const newMaxY = Math.max(...canvas.getObjects().map((o: any) => o.top + (o.getScaledHeight ? o.getScaledHeight() : o.height * (o.scaleY || 1))));
      if (newMaxY > canvas.height!) {
         canvas.setDimensions({ width: canvas.width!, height: newMaxY });
      }
      
      canvas.renderAll();
      return;
    }

    // For single elements
    if (preset.category === "wedding") {
      config.top = (config.top || 0) + startY;
    } else {
      // For simple text/shapes, we just want them at startY, centered horizontally if originally centered
      const originalTop = config.top || 0;
      // If it was meant to be centered or had a specific top relative to 0, just place it at startY
      config.top = startY;
    }

    const obj = await createFabricObject(fabric, config);
    if (obj) {
      canvas.add(obj);
      canvas.setActiveObject(obj);
      
      const newMaxY = obj.top + (obj.getScaledHeight ? obj.getScaledHeight() : obj.height * (obj.scaleY || 1));
      if (newMaxY > canvas.height!) {
         canvas.setDimensions({ width: canvas.width!, height: newMaxY + 50 });
      }
      
      canvas.renderAll();
    }
  };

  const addImageFromFile = () => {
    if (!canvas) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        const fabric = await import("fabric");

        const img = await fabric.FabricImage.fromURL(dataUrl);
        const maxW = canvas.width! * 0.8;
        const maxH = canvas.height! * 0.4;
        const scale = Math.min(maxW / img.width!, maxH / img.height!, 1);

        img.set({
          id: generateObjectId("img"),
          name: file.name.replace(/\.[^.]+$/, ""),
          scaleX: scale,
          scaleY: scale,
        } as any);

        centerObject(canvas, img);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="flex-1 overflow-y-auto p-3">
      {categories.map((cat) => {
        const items = ELEMENT_PRESETS.filter((p) => p.category === cat.key);
        if (items.length === 0) return null;
        const isExpanded = expandedCategory === cat.key;

        return (
          <div key={cat.key} className="mb-2">
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </span>
              <span className={`text-[10px] text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
            </button>

            {isExpanded && (
              <div className="mt-1 grid grid-cols-2 gap-1.5 px-1">
                {items.map((preset) => (
                  <button
                    key={preset.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/vnd.fabric.preset", preset.type);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => addElementToCanvas(preset)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-brand-500/40 transition-all text-center group cursor-grab active:cursor-grabbing"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{preset.icon}</span>
                    <span className="text-[11px] text-gray-400 group-hover:text-gray-200">{preset.label}</span>
                  </button>
                ))}
                {/* Extra: Upload image button in media category */}
                {cat.key === "media" && (
                  <button
                    onClick={addImageFromFile}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-brand-500/40 transition-all text-center group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">📤</span>
                    <span className="text-[11px] text-gray-400 group-hover:text-gray-200">Upload</span>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Layers Tab ───
function LayersTab() {
  const { canvas, selectedObjectIds, setSelectedObjectIds } = useFabricStore();
  const [, forceUpdate] = useState(0);

  const objects = canvas
    ? canvas
        .getObjects()
        .filter((o: any) => !o.data?.isGrid)
        .reverse() // Top layer first
    : [];

  const selectObject = (obj: any) => {
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.renderAll();
    setSelectedObjectIds([obj.id]);
  };

  const toggleVisibility = (obj: any) => {
    obj.visible = !obj.visible;
    canvas?.renderAll();
    forceUpdate((n) => n + 1);
  };

  const toggleLock = (obj: any) => {
    const locked = !obj.lockMovementX;
    obj.set({
      lockMovementX: locked,
      lockMovementY: locked,
      lockRotation: locked,
      lockScalingX: locked,
      lockScalingY: locked,
      hasControls: !locked,
    });
    canvas?.renderAll();
    forceUpdate((n) => n + 1);
  };

  const removeObject = (obj: any) => {
    if (!canvas) return;
    canvas.remove(obj);
    canvas.renderAll();
    forceUpdate((n) => n + 1);
  };

  const moveUp = (obj: any) => {
    if (!canvas) return;
    canvas.bringObjectForward(obj);
    canvas.renderAll();
    forceUpdate((n) => n + 1);
  };

  const moveDown = (obj: any) => {
    if (!canvas) return;
    canvas.sendObjectBackwards(obj);
    canvas.renderAll();
    forceUpdate((n) => n + 1);
  };

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {objects.length === 0 ? (
        <div className="text-center text-gray-500 text-xs py-8">
          Canvas masih kosong.
          <br />
          Tambahkan elemen dari tab Elemen.
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {objects.map((obj: any, idx: number) => {
            const isSelected = selectedObjectIds.includes(obj.id);
            const isLocked = obj.lockMovementX;
            const name = obj.name || obj.type || `Object ${idx + 1}`;

            return (
              <div
                key={obj.id || idx}
                onClick={() => selectObject(obj)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors group ${
                  isSelected
                    ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                    : "text-gray-400 hover:bg-white/5 border border-transparent"
                } ${!obj.visible ? "opacity-40" : ""}`}
              >
                <GripVertical size={12} className="text-gray-600 flex-shrink-0" />
                <span className="flex-1 truncate font-medium">{name}</span>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); moveUp(obj); }} className="p-0.5 hover:text-white" title="Move up">
                    <ChevronUp size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveDown(obj); }} className="p-0.5 hover:text-white" title="Move down">
                    <ChevronDown size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleVisibility(obj); }} className="p-0.5 hover:text-white" title="Toggle visibility">
                    {obj.visible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleLock(obj); }} className="p-0.5 hover:text-white" title="Toggle lock">
                    {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); removeObject(obj); }} className="p-0.5 hover:text-red-400" title="Delete">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Element Panel (Left Sidebar) ───
export default function ElementPanel() {
  const { activeLeftTab, setActiveLeftTab } = useFabricStore();

  return (
    <div className="w-64 border-r border-white/10 bg-gray-950 flex flex-col h-full flex-shrink-0">
      {/* Tab Switcher */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveLeftTab("elements")}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeLeftTab === "elements"
              ? "text-brand-400 border-b-2 border-brand-400 bg-white/[0.03]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Elemen
        </button>
        <button
          onClick={() => setActiveLeftTab("layers")}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeLeftTab === "layers"
              ? "text-brand-400 border-b-2 border-brand-400 bg-white/[0.03]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Layers
        </button>
      </div>

      {activeLeftTab === "elements" ? <ElementsTab /> : <LayersTab />}
    </div>
  );
}

// Helper to create fabric objects from config
export async function createFabricObject(fabric: any, config: any): Promise<any> {
  const { type, ...props } = config;

  switch (type) {
    case "Textbox":
      return new fabric.Textbox(props.text || "Text", {
        ...props,
        text: undefined,
        ...{ text: props.text || "Text" },
      });
    case "Rect":
      return new fabric.Rect(props);
    case "Circle":
      return new fabric.Circle(props);
    case "Line":
      return new fabric.Line([props.x1 || 0, props.y1 || 0, props.x2 || 100, props.y2 || 0], {
        ...props,
        x1: undefined, y1: undefined, x2: undefined, y2: undefined,
      });
    case "Image":
      if (props.src) {
        const img = await fabric.FabricImage.fromURL(props.src);
        img.set(props);
        return img;
      }
      return new fabric.Rect({ ...props, fill: "rgba(200,181,138,0.15)" });
    default:
      return new fabric.Rect(props);
  }
}
