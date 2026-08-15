import { create } from "zustand";
import { BlockInstance } from "./types";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

interface BuilderState {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  pageMeta: {
    name: string;
    slug: string;
  };
  
  // Actions
  addBlock: (type: string, defaultData: any, index?: number) => void;
  updateBlock: (id: string, data: any) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  selectBlock: (id: string | null) => void;
  setPageMeta: (meta: Partial<{ name: string; slug: string }>) => void;
  setInitialState: (blocks: BlockInstance[], pageMeta: { name: string; slug: string }) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  blocks: [],
  selectedBlockId: null,
  pageMeta: {
    name: "",
    slug: "",
  },

  addBlock: (type, defaultData, index) => set((state) => {
    const newBlock: BlockInstance = {
      id: uuidv4(),
      type,
      data: defaultData,
    };
    
    if (index !== undefined) {
      const newBlocks = [...state.blocks];
      newBlocks.splice(index, 0, newBlock);
      return { blocks: newBlocks, selectedBlockId: newBlock.id };
    }
    
    return { blocks: [...state.blocks, newBlock], selectedBlockId: newBlock.id };
  }),

  updateBlock: (id, data) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b)
  })),

  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id),
    selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
  })),

  reorderBlocks: (activeId, overId) => set((state) => {
    const oldIndex = state.blocks.findIndex(b => b.id === activeId);
    const newIndex = state.blocks.findIndex(b => b.id === overId);
    return { blocks: arrayMove(state.blocks, oldIndex, newIndex) };
  }),

  selectBlock: (id) => set({ selectedBlockId: id }),

  setPageMeta: (meta) => set((state) => ({
    pageMeta: { ...state.pageMeta, ...meta }
  })),

  setInitialState: (blocks, pageMeta) => set({ blocks, pageMeta })
}));
