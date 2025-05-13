import { create } from "zustand";

export const useConfettiStore = create((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }), // was setting true before — probably a typo
}));
