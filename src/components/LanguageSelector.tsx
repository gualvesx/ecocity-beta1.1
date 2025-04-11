
import { useLanguage, Language } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();

  const languages = [
    { code: 'pt', label: 'Português', nativeName: 'Português' },
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'zh', label: '中文', nativeName: '中文' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`
            flex gap-1.5 items-center
            ${theme === 'dark' 
              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-700' 
              : 'bg-white hover:bg-gray-50 border-gray-200'
            }
          `}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{languages.find(l => l.code === language)?.nativeName || t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white'}
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={`
              flex items-center gap-2 text-base py-2
              ${language === lang.code 
                ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') 
                : 'hover:bg-opacity-10'
              }
            `}
          >
            {language === lang.code && <Check className="h-4 w-4" />}
            <span className={language !== lang.code ? 'pl-6' : ''}>
              {lang.nativeName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
