"use client";

import React from "react";
import dynamic from "next/dynamic";
import Toolbar from "./Toolbar";
import ElementPanel from "./ElementPanel";
import PropertiesPanel from "./PropertiesPanel";

// Fabric.js uses browser APIs (canvas, window) so it must be loaded client-side only
const FabricCanvas = dynamic(() => import("./FabricCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Memuat canvas editor...</p>
      </div>
    </div>
  ),
});

export default function FabricBuilderLayout() {
  return (
    <div className="flex flex-col h-full w-full bg-gray-950 text-white overflow-hidden">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content: 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Element Panel + Layers */}
        <ElementPanel />

        {/* Center: Canvas */}
        <FabricCanvas />

        {/* Right Sidebar: Properties + Binding */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
