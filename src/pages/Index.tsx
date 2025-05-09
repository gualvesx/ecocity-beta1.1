import React from 'react';
import DestaquesSustentabilidade from '@/components/SustainabilityHighlights';
import ChamadaParaAcao from '@/components/CallToAction';
import EcoCityHelpBox from '@/components/EcoCityHelpBox'; // Removido as chaves {}
import SecaoInterativa from '@/components/SecaoInterativa';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPreview } from '@/components/MapPreview';

const Index = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  <script src="https://kit.fontawesome.com/3a47ab78fd.js" crossorigin="anonymous"></script>
  
  return (
    <div className="min-h-screen flex flex-col">
      <MapPreview />
      <SecaoInterativa />
      <EcoCityHelpBox /> {/* Agora com a importação correta */}
      <ChamadaParaAcao />
    </div>
  );
};

export default Index;
