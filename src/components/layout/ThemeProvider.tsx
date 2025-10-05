'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/stores/uiStore';

/**
 * ThemeProvider Component
 * 
 * A client-side theme provider that synchronizes the uiStore theme state
 * with the HTML element's 'dark' class to enable Tailwind CSS dark mode.
 * 
 * This component:
 * - Reads the current theme from uiStore on mount
 * - Applies the 'dark' class to the HTML element when theme is 'dark'
 * - Removes the 'dark' class when theme is 'light'
 * - Listens for theme changes and updates the DOM accordingly
 * - Handles initial theme application from persisted localStorage state
 * 
 * @param children - React children to render
 * @returns JSX element wrapping children with theme management
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    // Get the HTML element
    const htmlElement = document.documentElement;
    
    // Apply or remove the dark class based on theme state
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);

  // This component doesn't render any UI, just manages the theme class
  return <>{children}</>;
}