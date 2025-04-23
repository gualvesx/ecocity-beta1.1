
import { GraficoArea } from '@/components/GraficoArea';
import DestaquesSustentabilidade from '@/components/SustainabilityHighlights';
import EstatisticasImpactoAmbiental from '@/components/EnvImpactStats';
import ChamadaParaAcao from '@/components/CallToAction';
import SecaoInterativa from '@/components/SecaoInterativa';
import BannerImagem from '@/components/BannerImagem';
import { InfoCardsCarrossel } from '@/components/InfoCardsCarrossel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPreview } from '@/components/MapPreview';

const Inicio = () => {
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

export default Inicio;
