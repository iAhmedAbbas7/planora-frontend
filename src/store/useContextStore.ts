// <== IMPORTS ==>
import { create } from "zustand";
import { persist } from "zustand/middleware";

// <== CONTEXT TYPE ==>
export type ContextType = "personal" | "workspace";

// <== ACTIVE CONTEXT INTERFACE ==>
export interface ActiveContext {
  // <== CONTEXT TYPE ==>
  type: ContextType;
  // <== WORKSPACE ID (NULL FOR PERSONAL) ==>
  workspaceId: string | null;
  // <== WORKSPACE NAME (FOR DISPLAY) ==>
  workspaceName: string | null;
}

// <== CONTEXT STATE INTERFACE ==>
interface ContextState {
  // <== ACTIVE CONTEXT ==>
  activeContext: ActiveContext;
  // <== SET PERSONAL CONTEXT FUNCTION ==>
  setPersonalContext: () => void;
  // <== SET WORKSPACE CONTEXT FUNCTION ==>
  setWorkspaceContext: (workspaceId: string, workspaceName: string) => void;
  // <== IS PERSONAL CONTEXT FUNCTION ==>
  isPersonalContext: () => boolean;
  // <== IS WORKSPACE CONTEXT FUNCTION ==>
  isWorkspaceContext: () => boolean;
  // <== GET CURRENT WORKSPACE ID FUNCTION ==>
  getCurrentWorkspaceId: () => string | null;
}

// <== DEFAULT PERSONAL CONTEXT ==>
const DEFAULT_CONTEXT: ActiveContext = {
  type: "personal",
  workspaceId: null,
  workspaceName: null,
};

// <== CONTEXT STORE ==>
export const useContextStore = create<ContextState>()(
  persist(
    (set, get) => ({
      // <== ACTIVE CONTEXT (DEFAULT TO PERSONAL) ==>
      activeContext: DEFAULT_CONTEXT,
      // <== SET PERSONAL CONTEXT ==>
      setPersonalContext: () =>
        set({
          activeContext: {
            type: "personal",
            workspaceId: null,
            workspaceName: null,
          },
        }),
      // <== SET WORKSPACE CONTEXT ==>
      setWorkspaceContext: (workspaceId: string, workspaceName: string) =>
        set({
          activeContext: {
            type: "workspace",
            workspaceId,
            workspaceName,
          },
        }),
      // <== IS PERSONAL CONTEXT ==>
      isPersonalContext: () => get().activeContext.type === "personal",
      // <== IS WORKSPACE CONTEXT ==>
      isWorkspaceContext: () => get().activeContext.type === "workspace",
      // <== GET CURRENT WORKSPACE ID ==>
      getCurrentWorkspaceId: () => get().activeContext.workspaceId,
    }),
    {
      name: "planora-context-storage",
      partialize: (state) => ({ activeContext: state.activeContext }),
    }
  )
);

