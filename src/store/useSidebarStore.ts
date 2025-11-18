// <== IMPORTS ==>
import { create } from "zustand";

// <== SIDEBAR STATE INTERFACE ==>
interface SidebarState {
  // <== SIDEBAR OPEN STATE ==>
  isOpen: boolean;
  // <== SIDEBAR TOGGLE FUNCTION ==>
  toggleSidebar: () => void;
  // <== SIDEBAR CLOSE FUNCTION ==>
  closeSidebar: () => void;
}

// <== SIDEBAR STORE ==>
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  // <== SIDEBAR TOGGLE FUNCTION ==>
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  // <== SIDEBAR CLOSE FUNCTION ==>
  closeSidebar: () => set({ isOpen: false }),
}));
