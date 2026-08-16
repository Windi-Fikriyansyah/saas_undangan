"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useFabricStore, DEVICE_PRESETS } from "@/store/useFabricStore";
import {
  setupZoom,
  setupPan,
  setupAlignmentGuides,
  drawGrid,
  removeGrid,
  snapObjectToGrid,
} from "@/lib/fabric/fabric-helpers";
import { ELEMENT_PRESETS } from "@/lib/fabric/wedding-presets";
import { createFabricObject } from "./ElementPanel";

export default function FabricCanvas() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<any>(null);
  const cleanupPanRef = useRef<(() => void) | null>(null);
  const isRecordingHistory = useRef(true);

  const {
    canvas,
    setCanvas,
    activeDevice,
    setSelectedObjectIds,
    zoom,
    setZoom,
    showGrid,
    snapToGrid,
    pushHistory,
    isPreviewMode,
  } = useFabricStore();

  // Initialize canvas
  useEffect(() => {
    if (!canvasElRef.current) return;

    let mounted = true;

    import("fabric").then((fabric) => {
      if (!mounted || !canvasElRef.current) return;

      const preset = DEVICE_PRESETS[activeDevice];
      const c = new fabric.Canvas(canvasElRef.current, {
        width: preset.width,
        height: preset.height,
        backgroundColor: "#111612",
        selection: true,
        preserveObjectStacking: true,
        stopContextMenu: true,
        fireRightClick: true,
      });

      // Customize selection style
      c.selectionColor = "rgba(59, 130, 246, 0.1)";
      c.selectionBorderColor = "#3B82F6";
      c.selectionLineWidth = 1;

      fabricRef.current = c;
      setCanvas(c);

      // Setup interactions
      setupZoom(c, setZoom);
      cleanupPanRef.current = setupPan(c);
      setupAlignmentGuides(c);

      // Object selection events
      c.on("selection:created", (e: any) => {
        const ids = (e.selected || []).map((o: any) => o.id).filter(Boolean);
        setSelectedObjectIds(ids);
      });
      c.on("selection:updated", (e: any) => {
        const ids = (e.selected || []).map((o: any) => o.id).filter(Boolean);
        setSelectedObjectIds(ids);
      });
      c.on("selection:cleared", () => {
        setSelectedObjectIds([]);
      });

      // History tracking
      const recordHistory = () => {
        if (!isRecordingHistory.current) return;
        const json = JSON.stringify(c.toJSON(["id", "name", "data", "selectable", "evented"]));
        pushHistory(json);
      };

      c.on("object:added", recordHistory);
      c.on("object:modified", recordHistory);
      c.on("object:removed", recordHistory);

      // Save initial empty state
      recordHistory();
    });

    return () => {
      mounted = false;
      cleanupPanRef.current?.();
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
        setCanvas(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle device change
  useEffect(() => {
    if (!canvas) return;
    const preset = DEVICE_PRESETS[activeDevice];
    canvas.setDimensions({ width: preset.width, height: preset.height });
    canvas.renderAll();
  }, [activeDevice, canvas]);

  // Handle grid toggle
  useEffect(() => {
    if (!canvas) return;
    if (showGrid) {
      drawGrid(canvas, 20);
    } else {
      removeGrid(canvas);
    }
  }, [showGrid, canvas]);

  // Handle snap to grid
  useEffect(() => {
    if (!canvas) return;
    if (snapToGrid) {
      const handler = (e: any) => {
        if (e.target) {
          snapObjectToGrid(e.target, 20);
        }
      };
      canvas.on("object:moving", handler);
      return () => {
        canvas.off("object:moving", handler);
      };
    }
  }, [snapToGrid, canvas]);

  // Handle preview mode
  useEffect(() => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj: any) => {
      if (obj.data?.isGrid) return;
      obj.selectable = !isPreviewMode;
      obj.evented = !isPreviewMode;
    });
    canvas.selection = !isPreviewMode;
    canvas.renderAll();
  }, [isPreviewMode, canvas]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!canvas) return;

      // Don't capture if user is typing in input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const { undo, redo, canUndo, canRedo } = useFabricStore.getState();

      // Ctrl+Z → Undo
      if (e.ctrlKey && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        if (canUndo()) {
          isRecordingHistory.current = false;
          undo();
          setTimeout(() => { isRecordingHistory.current = true; }, 100);
        }
      }
      // Ctrl+Shift+Z → Redo
      if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        if (canRedo()) {
          isRecordingHistory.current = false;
          redo();
          setTimeout(() => { isRecordingHistory.current = true; }, 100);
        }
      }
      // Delete / Backspace → Remove selected
      if (e.key === "Delete" || e.key === "Backspace") {
        const active = canvas.getActiveObject();
        if (active) {
          // Don't delete if editing text
          if (active.isEditing) return;
          e.preventDefault();
          if (active.type === "activeSelection") {
            active.getObjects().forEach((o: any) => canvas.remove(o));
            canvas.discardActiveObject();
          } else {
            canvas.remove(active);
          }
          canvas.renderAll();
        }
      }
      // Ctrl+D → Duplicate
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        const active = canvas.getActiveObject();
        if (active) {
          active.clone().then((cloned: any) => {
            cloned.set({
              left: (cloned.left || 0) + 20,
              top: (cloned.top || 0) + 20,
              id: `${cloned.id || "obj"}_copy`,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();
          });
        }
      }
      // Ctrl+A → Select all
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        const objects = canvas.getObjects().filter((o: any) => !o.data?.isGrid && o.selectable !== false);
        if (objects.length > 0) {
          import("fabric").then(({ ActiveSelection }) => {
            const selection = new ActiveSelection(objects, { canvas });
            canvas.setActiveObject(selection);
            canvas.renderAll();
          });
        }
      }
      // Arrow keys → nudge
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        const active = canvas.getActiveObject();
        if (active && !active.isEditing) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          switch (e.key) {
            case "ArrowLeft": active.set("left", (active.left || 0) - step); break;
            case "ArrowRight": active.set("left", (active.left || 0) + step); break;
            case "ArrowUp": active.set("top", (active.top || 0) - step); break;
            case "ArrowDown": active.set("top", (active.top || 0) + step); break;
          }
          active.setCoords();
          canvas.renderAll();
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [canvas]);

  const preset = DEVICE_PRESETS[activeDevice];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvas) return;

    const presetType = e.dataTransfer.getData("application/vnd.fabric.preset");
    if (!presetType) return;

    const preset = ELEMENT_PRESETS.find((p) => p.type === presetType);
    if (!preset) return;

    // Convert mouse coordinates to canvas coordinates handling pan and zoom
    const pointer = canvas.getScenePoint(e.nativeEvent);

    const fabric = await import("fabric");
    
    // Default section height
    const sectionHeight = canvas.height! > 0 ? Math.min(canvas.height!, 932) : 932;
    const config = preset.create(canvas.width!, sectionHeight);

    // Override the position to where the user dropped it
    if (config._isPresetGroup && config._children) {
      for (const childConfig of config._children) {
        // We offset by the drop Y
        childConfig.top = (childConfig.top || 0) + pointer.y;
        const obj = await createFabricObject(fabric, childConfig);
        if (obj) canvas.add(obj);
      }
      
      const newMaxY = Math.max(...canvas.getObjects().map((o: any) => o.top + (o.getScaledHeight ? o.getScaledHeight() : o.height * (o.scaleY || 1))));
      if (newMaxY > canvas.height!) {
         canvas.setDimensions({ width: canvas.width!, height: newMaxY });
      }
      canvas.renderAll();
      return;
    }

    // For single elements
    if (preset.category === "wedding") {
      config.top = (config.top || 0) + pointer.y;
    } else {
      // For simple text/shapes, we just want them centered at the pointer
      config.top = pointer.y;
      config.left = pointer.x;
      // We will adjust the exact center after creation
    }

    const obj = await createFabricObject(fabric, config);
    if (obj) {
      if (preset.category !== "wedding") {
         const objWidth = obj.getScaledWidth ? obj.getScaledWidth() : obj.width * (obj.scaleX || 1);
         const objHeight = obj.getScaledHeight ? obj.getScaledHeight() : obj.height * (obj.scaleY || 1);
         obj.set({
           left: pointer.x - objWidth / 2,
           top: pointer.y - objHeight / 2,
         });
         obj.setCoords();
      }

      canvas.add(obj);
      canvas.setActiveObject(obj);
      
      const newMaxY = obj.top + (obj.getScaledHeight ? obj.getScaledHeight() : obj.height * (obj.scaleY || 1));
      if (newMaxY > canvas.height!) {
         canvas.setDimensions({ width: canvas.width!, height: newMaxY + 50 });
      }
      
      canvas.renderAll();
    }
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-auto bg-gray-900 relative flex items-start justify-center p-8">
      {/* Canvas wrapper with device frame styling */}
      <div
        className="relative shadow-2xl"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 0.1s ease",
        }}
      >
        {/* Device frame label */}
        <div className="absolute -top-7 left-0 right-0 text-center">
          <span className="text-xs text-gray-500 font-mono">
            {preset.icon} {preset.label} — {preset.width}×{preset.height}
          </span>
        </div>

        {/* Canvas border */}
        <div
          className="border border-gray-700 rounded-sm overflow-hidden w-fit h-fit"
          style={{ minWidth: preset.width, minHeight: preset.height }}
        >
          <canvas ref={canvasElRef} />
        </div>
      </div>
    </div>
  );
}
