/**
 * Fabric.js Canvas Serializer
 * Handles Canvas ↔ JSON ↔ configJson conversion
 */

import type { DeviceType } from "@/store/useFabricStore";

export interface FabricConfigJson {
  version: string;
  builderVersion: "fabric-v1";
  canvas: {
    width: number;
    height: number;
    backgroundColor: string;
    objects: any[];
  };
  // Responsive overrides keyed by device type
  responsive?: {
    tablet?: { objects: any[] };
    desktop?: { objects: any[] };
  };
  settings: {
    theme: string;
    music: { enabled: boolean; source?: string; autoplay?: boolean; loop?: boolean; volume?: number };
    navigation: { enabled: boolean; labels?: Record<string, string> };
  };
  colors: Record<string, string>;
  typography: {
    heading: { family: string; weight: number };
    body: { family: string; weight: number };
  };
  blocks: any[]; // Legacy block format for WeddingRenderer compatibility
  bindings: Record<string, string>; // objectId → variable path
  data?: Record<string, any>;
}

/**
 * Serialize a Fabric.js canvas into our configJson format
 */
export function serializeCanvas(
  canvas: any,
  meta: {
    settings?: FabricConfigJson["settings"];
    colors?: FabricConfigJson["colors"];
    typography?: FabricConfigJson["typography"];
    bindings?: Record<string, string>;
    responsive?: FabricConfigJson["responsive"];
  } = {}
): FabricConfigJson {
  const canvasJSON = canvas.toJSON(["id", "name", "data", "selectable", "evented", "lockMovementX", "lockMovementY"]);

  // Extract bindings from object data
  const bindings: Record<string, string> = meta.bindings || {};
  (canvasJSON.objects || []).forEach((obj: any) => {
    if (obj.data?.binding) {
      bindings[obj.id || obj.name] = obj.data.binding;
    }
  });

  return {
    version: "3.0.0",
    builderVersion: "fabric-v1",
    canvas: {
      width: canvas.width,
      height: canvas.height,
      backgroundColor: canvas.backgroundColor || "#ffffff",
      objects: canvasJSON.objects || [],
    },
    responsive: meta.responsive,
    settings: meta.settings || {
      theme: "custom-fabric",
      music: { enabled: false },
      navigation: { enabled: false },
    },
    colors: meta.colors || {
      background: "#111612",
      foreground: "#F5F2EA",
      primary: "#D8D0BD",
      accent: "#C8B58A",
    },
    typography: meta.typography || {
      heading: { family: "Cormorant Garamond, serif", weight: 400 },
      body: { family: "DM Sans, sans-serif", weight: 400 },
    },
    blocks: [], // Will be populated by canvas-to-blocks converter
    bindings,
    data: {
      guest: { name: "Tamu Undangan", parents: "Bapak & Ibu" },
    },
  };
}

/**
 * Load a serialized configJson into a Fabric.js canvas
 */
export async function deserializeCanvas(
  configJson: FabricConfigJson,
  canvas: any,
  device: DeviceType = "mobile"
): Promise<void> {
  const canvasData = configJson.canvas;
  if (!canvasData) return;

  // Set canvas dimensions
  canvas.setDimensions({
    width: canvasData.width,
    height: canvasData.height,
  });
  canvas.backgroundColor = canvasData.backgroundColor || "#ffffff";

  // Build the JSON structure Fabric expects
  const fabricJSON = {
    version: "6.0.0",
    objects: canvasData.objects || [],
    background: canvasData.backgroundColor,
  };

  await canvas.loadFromJSON(fabricJSON);

  // Re-apply bindings from configJson.bindings
  if (configJson.bindings) {
    canvas.getObjects().forEach((obj: any) => {
      const id = obj.id || obj.name;
      if (id && configJson.bindings[id]) {
        if (!obj.data) obj.data = {};
        obj.data.binding = configJson.bindings[id];
      }
    });
  }

  canvas.renderAll();
}

/**
 * Check if a configJson was created by the Fabric builder
 */
export function isFabricConfig(configJson: any): configJson is FabricConfigJson {
  return configJson?.builderVersion === "fabric-v1";
}
