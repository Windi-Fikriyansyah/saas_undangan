import { create } from 'zustand';
import { BuilderBlock, GlobalSettings, TemplateConfig, defaultTemplateConfig } from '@/lib/validations/wedding-template';
import { v4 as uuidv4 } from 'uuid';

interface BuilderState {
  // Core Data
  config: TemplateConfig;
  selectedBlockId: string | null;
  
  // Actions - Core
  setConfig: (config: TemplateConfig) => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  
  // Actions - Blocks
  selectBlock: (id: string | null) => void;
  addBlock: (type: string, parentId?: string, index?: number) => void;
  updateBlock: (id: string, updates: Partial<BuilderBlock>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  
  // Helpers
  getBlockById: (id: string) => BuilderBlock | undefined;
}

// Helper to find a block recursively
const findBlockRecursively = (blocks: BuilderBlock[], id: string): BuilderBlock | undefined => {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlockRecursively(block.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

// Helper to remove a block recursively
const removeBlockRecursively = (blocks: BuilderBlock[], id: string): BuilderBlock[] => {
  return blocks.filter(b => b.id !== id).map(b => {
    if (b.children) {
      return { ...b, children: removeBlockRecursively(b.children, id) };
    }
    return b;
  });
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  config: defaultTemplateConfig,
  selectedBlockId: null,

  setConfig: (config) => set({ config }),
  
  updateGlobalSettings: (settings) => set((state) => ({
    config: {
      ...state.config,
      global: { ...state.config.global, ...settings }
    }
  })),

  selectBlock: (id) => set({ selectedBlockId: id }),

  addBlock: (type, parentId, index) => set((state) => {
    const newBlock: BuilderBlock = {
      id: uuidv4(),
      type,
      props: {},
    };

    if (!parentId) {
      const newBlocks = [...state.config.blocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return { config: { ...state.config, blocks: newBlocks } };
    }

    // Add to specific parent (e.g. Container)
    const addRecursively = (blocks: BuilderBlock[]): BuilderBlock[] => {
      return blocks.map(b => {
        if (b.id === parentId) {
          const children = [...(b.children || [])];
          if (index !== undefined) children.splice(index, 0, newBlock);
          else children.push(newBlock);
          return { ...b, children };
        }
        if (b.children) return { ...b, children: addRecursively(b.children) };
        return b;
      });
    };

    return { config: { ...state.config, blocks: addRecursively(state.config.blocks) } };
  }),

  updateBlock: (id, updates) => set((state) => {
    const updateRecursively = (blocks: BuilderBlock[]): BuilderBlock[] => {
      return blocks.map(b => {
        if (b.id === id) return { ...b, ...updates };
        if (b.children) return { ...b, children: updateRecursively(b.children) };
        return b;
      });
    };
    return { config: { ...state.config, blocks: updateRecursively(state.config.blocks) } };
  }),

  removeBlock: (id) => set((state) => ({
    config: { ...state.config, blocks: removeBlockRecursively(state.config.blocks, id) },
    selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
  })),

  reorderBlocks: (activeId, overId) => set((state) => {
    if (activeId === overId) return state;
    
    // For simplicity in Phase 1, we only reorder top-level blocks.
    // In Phase 2, we will implement full deep tree reordering.
    const blocks = [...state.config.blocks];
    const oldIndex = blocks.findIndex(b => b.id === activeId);
    const newIndex = blocks.findIndex(b => b.id === overId);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const [movedItem] = blocks.splice(oldIndex, 1);
      blocks.splice(newIndex, 0, movedItem);
      return { config: { ...state.config, blocks } };
    }
    
    return state;
  }),

  getBlockById: (id) => {
    return findBlockRecursively(get().config.blocks, id);
  }
}));
