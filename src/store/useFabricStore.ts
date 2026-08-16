import { create } from "zustand";

// Device preset definitions
export const DEVICE_PRESETS = {
  mobile: { label: "Mobile", width: 430, height: 932, icon: "📱" },
  tablet: { label: "Tablet", width: 768, height: 1024, icon: "📋" },
  desktop: { label: "Desktop", width: 1440, height: 900, icon: "🖥️" },
} as const;

export type DeviceType = keyof typeof DEVICE_PRESETS;

export interface CanvasObjectData {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  locked: boolean;
  binding?: string; // data-binding variable path, e.g. "couple.bride"
  bindingType?: "text" | "image" | "date" | "countdown";
  [key: string]: any;
}

interface FabricState {
  // Canvas reference (set after mount)
  canvas: any | null;
  setCanvas: (canvas: any) => void;

  // Device / viewport
  activeDevice: DeviceType;
  setActiveDevice: (device: DeviceType) => void;

  // Selection
  selectedObjectIds: string[];
  setSelectedObjectIds: (ids: string[]) => void;

  // Zoom
  zoom: number;
  setZoom: (zoom: number) => void;

  // Grid & snap
  showGrid: boolean;
  toggleGrid: () => void;
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;

  // History (undo/redo)
  history: string[];
  historyIndex: number;
  pushHistory: (json: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Sidebar tab
  activeLeftTab: "elements" | "layers";
  setActiveLeftTab: (tab: "elements" | "layers") => void;
  activeRightTab: "properties" | "binding";
  setActiveRightTab: (tab: "properties" | "binding") => void;

  // Template metadata (loaded from DB)
  templateId: string | null;
  templateMeta: {
    name: string;
    category: string;
    tier: string;
    isActive: boolean;
    thumbnailUrl: string;
  };
  setTemplateId: (id: string | null) => void;
  setTemplateMeta: (meta: Partial<FabricState["templateMeta"]>) => void;

  // Dirty flag
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;

  // Preview mode
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
}

export const useFabricStore = create<FabricState>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),

  activeDevice: "mobile",
  setActiveDevice: (device) => set({ activeDevice: device }),

  selectedObjectIds: [],
  setSelectedObjectIds: (ids) => set({ selectedObjectIds: ids }),

  zoom: 1,
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),

  showGrid: false,
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  snapToGrid: false,
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),

  // History
  history: [],
  historyIndex: -1,
  pushHistory: (json) => {
    const { history, historyIndex } = get();
    // Trim any "future" states if we've undone
    const trimmed = history.slice(0, historyIndex + 1);
    const newHistory = [...trimmed, json].slice(-50); // Keep last 50
    set({ history: newHistory, historyIndex: newHistory.length - 1, isDirty: true });
  },
  undo: () => {
    const { historyIndex, history, canvas } = get();
    if (historyIndex <= 0 || !canvas) return;
    const newIndex = historyIndex - 1;
    set({ historyIndex: newIndex });
    const json = JSON.parse(history[newIndex]);
    canvas.loadFromJSON(json).then(() => {
      canvas.renderAll();
    });
  },
  redo: () => {
    const { historyIndex, history, canvas } = get();
    if (historyIndex >= history.length - 1 || !canvas) return;
    const newIndex = historyIndex + 1;
    set({ historyIndex: newIndex });
    const json = JSON.parse(history[newIndex]);
    canvas.loadFromJSON(json).then(() => {
      canvas.renderAll();
    });
  },
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  activeLeftTab: "elements",
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
  activeRightTab: "properties",
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),

  templateId: null,
  templateMeta: {
    name: "",
    category: "Custom",
    tier: "PREMIUM",
    isActive: true,
    thumbnailUrl: "",
  },
  setTemplateId: (id) => set({ templateId: id }),
  setTemplateMeta: (meta) =>
    set((s) => ({ templateMeta: { ...s.templateMeta, ...meta } })),

  isDirty: false,
  setDirty: (dirty) => set({ isDirty: dirty }),

  isPreviewMode: false,
  togglePreviewMode: () => set((s) => ({ isPreviewMode: !s.isPreviewMode })),
}));
