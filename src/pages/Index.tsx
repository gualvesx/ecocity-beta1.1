
import { GraficoArea } from '@/components/GraficoArea';
import Hero from '@/components/Hero';
import DestaquesSustentabilidade from '@/components/SustainabilityHighlights';
import EstatisticasImpactoAmbiental from '@/components/EnvImpactStats';
import ChamadaParaAcao from '@/components/CallToAction';
import SecaoInterativa from '@/components/SecaoInterativa';
import BannerImagem from '@/components/BannerImagem';
import { InfoCardsCarrossel } from '@/components/InfoCardsCarrossel';
import { useLanguage } from '@/contexts/LanguageContext';

const Inicio = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <BannerImagem />
      <SecaoInterativa />
      <div className="container px-4 py-12 md:py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-eco-green-dark dark:text-eco-green-light mb-4">
              {t('monitoring-title')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('monitoring-subtitle')}
            </p>
          </div>
          <GraficoArea />
        </div>
      </div>
      <InfoCardsCarrossel />
      <DestaquesSustentabilidade />
      <EstatisticasImpactoAmbiental />
      <ChamadaParaAcao />
    </div>
  );
};

export default Inicio;
