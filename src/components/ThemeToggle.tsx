
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`
        relative p-2 h-10 w-10 rounded-full
        ${theme === 'dark' 
          ? 'bg-gray-800 text-yellow-300 hover:text-yellow-200 hover:bg-gray-700 border-gray-700' 
          : 'bg-white text-amber-500 hover:text-amber-600 border-gray-200'
        }
        transition-colors duration-200
      `}
      aria-label={t(theme === 'dark' ? 'light-mode' : 'dark-mode')}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
