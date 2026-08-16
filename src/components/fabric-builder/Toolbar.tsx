"use client";

import React from "react";
import { useFabricStore, DEVICE_PRESETS, type DeviceType } from "@/store/useFabricStore";
import { alignObjects } from "@/lib/fabric/fabric-helpers";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  Grid3X3,
  Magnet,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignStartHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignEndVertical,
  Eye,
  EyeOff,
  ArrowUpToLine,
  ArrowDownToLine,
  Copy,
  Trash2,
} from "lucide-react";

export default function Toolbar() {
  const {
    canvas,
    activeDevice,
    setActiveDevice,
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    snapToGrid,
    toggleSnapToGrid,
    isPreviewMode,
    togglePreviewMode,
  } = useFabricStore();

  const handleUndo = () => {
    const { canUndo, undo } = useFabricStore.getState();
    if (canUndo()) undo();
  };

  const handleRedo = () => {
    const { canRedo, redo } = useFabricStore.getState();
    if (canRedo()) redo();
  };

  const handleZoomIn = () => {
    setZoom(zoom + 0.1);
    canvas?.setZoom(zoom + 0.1);
    canvas?.renderAll();
  };

  const handleZoomOut = () => {
    setZoom(zoom - 0.1);
    canvas?.setZoom(zoom - 0.1);
    canvas?.renderAll();
  };

  const handleFitToScreen = () => {
    setZoom(1);
    canvas?.setZoom(1);
    const vpt = canvas?.viewportTransform;
    if (vpt) {
      vpt[4] = 0;
      vpt[5] = 0;
    }
    canvas?.renderAll();
  };

  const handleDuplicate = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
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
  };

  const handleDelete = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    if (active.type === "activeSelection") {
      active.getObjects().forEach((o: any) => canvas.remove(o));
      canvas.discardActiveObject();
    } else {
      canvas.remove(active);
    }
    canvas.renderAll();
  };

  const handleBringForward = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.bringObjectForward(obj);
      canvas.renderAll();
    }
  };

  const handleSendBackward = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.sendObjectBackwards(obj);
      canvas.renderAll();
    }
  };

  const devices: { key: DeviceType; icon: React.ReactNode; label: string }[] = [
    { key: "mobile", icon: <Smartphone size={14} />, label: "Mobile" },
    { key: "tablet", icon: <Tablet size={14} />, label: "Tablet" },
    { key: "desktop", icon: <Monitor size={14} />, label: "Desktop" },
  ];

  return (
    <div className="h-10 bg-gray-950 border-b border-white/10 flex items-center justify-between px-3 gap-2 flex-shrink-0">
      {/* Left: Undo/Redo + Object Actions */}
      <div className="flex items-center gap-1">
        <ToolbarButton onClick={handleUndo} title="Undo (Ctrl+Z)" disabled={!useFabricStore.getState().canUndo()}>
          <Undo2 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={handleRedo} title="Redo (Ctrl+Shift+Z)" disabled={!useFabricStore.getState().canRedo()}>
          <Redo2 size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolbarButton onClick={handleDuplicate} title="Duplicate (Ctrl+D)">
          <Copy size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={handleDelete} title="Delete (Del)">
          <Trash2 size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolbarButton onClick={handleBringForward} title="Bring Forward">
          <ArrowUpToLine size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={handleSendBackward} title="Send Backward">
          <ArrowDownToLine size={14} />
        </ToolbarButton>
      </div>

      {/* Center: Device Selector */}
      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
        {devices.map((d) => (
          <button
            key={d.key}
            onClick={() => setActiveDevice(d.key)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeDevice === d.key
                ? "bg-brand-500 text-white shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            title={d.label}
          >
            {d.icon}
            <span className="hidden sm:inline">{d.label}</span>
          </button>
        ))}
      </div>

      {/* Right: Zoom, Grid, Alignment, Preview */}
      <div className="flex items-center gap-1">
        {/* Alignment */}
        <div className="hidden md:flex items-center gap-0.5">
          <ToolbarButton onClick={() => canvas && alignObjects(canvas, "left")} title="Align Left">
            <AlignStartHorizontal size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => canvas && alignObjects(canvas, "center")} title="Align Center">
            <AlignHorizontalJustifyCenter size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => canvas && alignObjects(canvas, "right")} title="Align Right">
            <AlignEndHorizontal size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => canvas && alignObjects(canvas, "top")} title="Align Top">
            <AlignStartVertical size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => canvas && alignObjects(canvas, "middle")} title="Align Middle">
            <AlignVerticalJustifyCenter size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => canvas && alignObjects(canvas, "bottom")} title="Align Bottom">
            <AlignEndVertical size={14} />
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Grid & Snap */}
        <ToolbarButton onClick={toggleGrid} title="Toggle Grid" active={showGrid}>
          <Grid3X3 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleSnapToGrid} title="Snap to Grid" active={snapToGrid}>
          <Magnet size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Zoom */}
        <ToolbarButton onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut size={14} />
        </ToolbarButton>
        <span className="text-[10px] text-gray-400 font-mono min-w-[40px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <ToolbarButton onClick={handleZoomIn} title="Zoom In">
          <ZoomIn size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={handleFitToScreen} title="Fit to Screen">
          <Maximize2 size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Preview Toggle */}
        <ToolbarButton onClick={togglePreviewMode} title="Preview Mode" active={isPreviewMode}>
          {isPreviewMode ? <EyeOff size={14} /> : <Eye size={14} />}
        </ToolbarButton>
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  title,
  children,
  active,
  disabled,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors ${
        disabled
          ? "text-gray-700 cursor-not-allowed"
          : active
          ? "bg-brand-500/20 text-brand-400"
          : "text-gray-400 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
