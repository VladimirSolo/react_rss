import { create } from 'zustand';
import { Character } from '../types';

interface SelectionState {
  selectedItems: Record<number, Character>;
  toggle: (item: Character) => void;
  unselectAll: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedItems: {},
  toggle: (item: Character) =>
    set((state) => {
      const next = { ...state.selectedItems };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = item;
      }
      return { selectedItems: next };
    }),
  unselectAll: () => set({ selectedItems: {} }),
}));
