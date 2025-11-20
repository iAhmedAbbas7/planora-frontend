// <== IMPORTS ==>
import { create } from "zustand";
import { persist } from "zustand/middleware";

// <== USER TYPE INTERFACE ==>
export type User = {
  // <== USER ID ==>
  id: string;
  // <== USER NAME ==>
  name: string;
  // <== USER EMAIL ==>
  email: string;
};

// <== AUTH STORE INTERFACE ==>
type AuthState = {
  // <== USER STATE ==>
  user: User | null;
  // <== AUTHENTICATED STATE ==>
  isAuthenticated: boolean;
  // <== SESSION EXPIRED STATE ==>
  isSessionExpired: boolean;
  // <== LOGGING OUT FLAG ==>
  isLoggingOut: boolean;
  // <== CHECKING AUTH STATE ==>
  isCheckingAuth: boolean;
  // <== SET USER ACTION ==>
  setUser: (user: User | null) => void;
  // <== LOGIN ACTION ==>
  login: (user: User) => void;
  // <== LOGOUT ACTION ==>
  logout: () => void;
  // <== CLEAR USER ACTION ==>
  clearUser: () => void;
  // <== SET SESSION EXPIRED ACTION ==>
  setSessionExpired: (expired: boolean) => void;
  // <== SET LOGGING OUT FLAG ACTION ==>
  setLoggingOut: (loggingOut: boolean) => void;
  // <== SET CHECKING AUTH FLAG ACTION ==>
  setCheckingAuth: (checking: boolean) => void;
};

// <== AUTH STORE ==>
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // <== INITIAL STATE ==>
      user: null,
      isAuthenticated: false,
      isSessionExpired: false,
      isLoggingOut: false,
      isCheckingAuth: false,
      // <== SET USER ACTION ==>
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoggingOut: false,
        }),
      // <== LOGIN ACTION ==>
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isSessionExpired: false,
          isLoggingOut: false,
        }),
      // <== LOGOUT ACTION ==>
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isSessionExpired: false,
          isLoggingOut: false,
        }),
      // <== CLEAR USER ACTION ==>
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isSessionExpired: false,
        }),
      // <== SET SESSION EXPIRED ACTION ==>
      setSessionExpired: (expired) =>
        set({
          isSessionExpired: expired,
        }),
      // <== SET LOGGING OUT FLAG ACTION ==>
      setLoggingOut: (loggingOut) =>
        set({
          isLoggingOut: loggingOut,
        }),
      // <== SET CHECKING AUTH FLAG ACTION ==>
      setCheckingAuth: (checking) =>
        set({
          isCheckingAuth: checking,
        }),
    }),
    {
      // <== PERSISTENCE CONFIG ==>
      name: "auth-storage",
      // <== PARTIALIZE STATE ==>
      partialize: (state) => ({
        // <== USER STATE ==>
        user: state.user,
        // <== AUTHENTICATED STATE ==>
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
