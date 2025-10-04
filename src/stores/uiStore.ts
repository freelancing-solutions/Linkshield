import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface UiStore {
  // State
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  language: string;

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setLanguage: (language: string) => void;
}

export const useUiStore = create<UiStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        theme: 'light',
        sidebarCollapsed: false,
        language: 'en',

        // Actions
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setLanguage: (language) => set({ language }),
      }),
      {
        name: 'linkshield-ui-preferences',
      }
    ),
    {
      name: 'UiStore',
    }
  )
);
