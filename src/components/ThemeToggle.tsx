import * as React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme } = useTheme();
  
  // Since we're removing dark mode, this component doesn't do anything now
  return null;
};
