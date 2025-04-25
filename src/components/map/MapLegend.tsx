
import { useLanguage } from '@/contexts/LanguageContext';

export const MapLegend = () => {
  const { t } = useLanguage();

  return (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-sm border border-gray-200 z-20">
      <h4 className="text-sm font-medium mb-2">Legenda</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-eco-green"></div>
          <span>{t('Ponto Reciclagem')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
          <span>{t('Ponto Lixo Eletrônico')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
          <span>{t('Ponto Distribuição de Mudas')}</span>
        </div>
      </div>
    </div>
  );
};
