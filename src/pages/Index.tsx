
import React from 'react';
import DestaquesSustentabilidade from '@/components/SustainabilityHighlights';
import ChamadaParaAcao from '@/components/CallToAction';
import SecaoInterativa from '@/components/SecaoInterativa';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPreview } from '@/components/MapPreview';

const Index = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      <MapPreview />
      <SecaoInterativa />
      <DestaquesSustentabilidade />
      <ChamadaParaAcao />
    </div>
  );
};

export default Index;
