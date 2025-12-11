// <== IMPORTS ==>
import { create } from "zustand";

// <== COMMAND PALETTE PAGE TYPE ==>
export type CommandPalettePage = "home" | "create-task" | "search";

// <== COMMAND PALETTE STATE INTERFACE ==>
interface CommandPaletteState {
  // <== IS OPEN STATE ==>
  isOpen: boolean;
  // <== CURRENT PAGE ==>
  currentPage: CommandPalettePage;
  // <== SEARCH QUERY ==>
  searchQuery: string;
  // <== OPEN COMMAND PALETTE ==>
  openCommandPalette: () => void;
  // <== CLOSE COMMAND PALETTE ==>
  closeCommandPalette: () => void;
  // <== TOGGLE COMMAND PALETTE ==>
  toggleCommandPalette: () => void;
  // <== SET CURRENT PAGE ==>
  setCurrentPage: (page: CommandPalettePage) => void;
  // <== SET SEARCH QUERY ==>
  setSearchQuery: (query: string) => void;
  // <== RESET COMMAND PALETTE ==>
  resetCommandPalette: () => void;
}

// <== COMMAND PALETTE STORE ==>
export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  // <== DEFAULT STATE ==>
  isOpen: false,
  currentPage: "home",
  searchQuery: "",
  // <== OPEN COMMAND PALETTE ==>
  openCommandPalette: () =>
    // OPEN COMMAND PALETTE
    set({ isOpen: true }),
  // <== CLOSE COMMAND PALETTE ==>
  closeCommandPalette: () =>
    // CLOSE COMMAND PALETTE
    set({ isOpen: false, currentPage: "home", searchQuery: "" }),
  // <== TOGGLE COMMAND PALETTE ==>
  toggleCommandPalette: () =>
    // TOGGLE COMMAND PALETTE
    set((state) => ({
      isOpen: !state.isOpen,
      // RESET STATE WHEN CLOSING
      ...(state.isOpen ? { currentPage: "home", searchQuery: "" } : {}),
    })),
  // <== SET CURRENT PAGE ==>
  setCurrentPage: (page) =>
    // SET CURRENT PAGE
    set({ currentPage: page }),
  // <== SET SEARCH QUERY ==>
  setSearchQuery: (query) =>
    // SET SEARCH QUERY
    set({ searchQuery: query }),
  // <== RESET COMMAND PALETTE ==>
  resetCommandPalette: () =>
    // RESET COMMAND PALETTE
    set({ isOpen: false, currentPage: "home", searchQuery: "" }),
}));
