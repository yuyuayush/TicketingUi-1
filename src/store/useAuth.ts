import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "@/lib/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      isInitialized: false,

      setUser: (user: User | null) =>
        set({
          currentUser: user,
          isAuthenticated: !!user,
        }),

      setInitialized: (value: boolean) =>
        set({
          isInitialized: value,
        }),

      resetAuth: () =>
        set({
          currentUser: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Set initialized to true after rehydration
        if (state) {
          state.setInitialized(true);
        }
      },
    }
  )
);
