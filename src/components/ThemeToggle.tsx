
import * as React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// Changed from React.FC to regular function
export const ThemeToggle = () => {
  const { theme } = useTheme();
  
  // Since we're removing dark mode, this component doesn't do anything now
  return null;
};
