
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        <span>{t('back-home')}</span>
      </Link>
      
      <div className="bg-eco-green-light/20 rounded-xl p-8 md:p-12 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">
          {t('about-title')}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl">
          {t('about-subtitle')}
        </p>
      </div>
    </>
  );
};
