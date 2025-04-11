
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for system preference first
    if (typeof window !== 'undefined') {
      // Check saved preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme as Theme;
      
      // Fall back to system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      // Define CSS variables for dark mode with improved green contrast
      document.documentElement.style.setProperty('--eco-green-dark', '#4ade80');
      document.documentElement.style.setProperty('--eco-green', '#22c55e');
      document.documentElement.style.setProperty('--eco-green-light', '#bbf7d0');
    } else {
      document.documentElement.classList.remove('dark');
      // Reset CSS variables for light mode
      document.documentElement.style.setProperty('--eco-green-dark', '');
      document.documentElement.style.setProperty('--eco-green', '');
      document.documentElement.style.setProperty('--eco-green-light', '');
    }
    
    // Update theme color meta tag for mobile
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1c1c1c' : '#ffffff');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = theme === 'dark' ? '#1c1c1c' : '#ffffff';
      document.head.appendChild(meta);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
