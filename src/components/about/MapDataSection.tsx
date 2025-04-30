
import { Globe, Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataCard } from './DataCard';

export const MapDataSection = () => {
  const { t } = useLanguage();
  
  const dataCards = [
    { icon: Globe, title: 'Redução da Contaminação do Meio Ambiente', desc: 'Lixo eletrônico (pilhas, celulares, baterias) e lâmpadas fluorescentes contêm metais pesados (chumbo, mercúrio, cádmio) que, se descartados incorretamente, poluem o solo e a água, intoxicando ecossistemas e prejudicando a saúde humana. Um EcoMapa ajuda a direcionar esses resíduos para pontos de coleta especializados, evitando danos ambientais' },
    { icon: Users, title: 'community-contributions', desc: 'contributions-description' },
    { icon: Calendar, title: 'regular-updates', desc: 'updates-description' },
  ];
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-eco-green-dark mb-4">{t('Causa')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dataCards.map(({ icon, title, desc }) => (
          <DataCard key={title} icon={icon} titleKey={title} descKey={desc} />
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Link to="/map" className="inline-flex items-center gap-2 bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
          <span>{t('explore-map')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
