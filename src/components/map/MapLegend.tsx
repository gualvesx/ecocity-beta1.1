
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

export const MapLegend = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "absolute z-20 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-md border border-eco-green-light/30",
      isMobile 
        ? "bottom-4 left-4 max-w-[calc(100%-2rem)] max-h-[30vh] overflow-y-auto"
        : "bottom-4 left-4"
    )}>
      <h4 className="text-sm font-medium mb-2">Legenda</h4>
      <div className="space-y-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-eco-green shadow-sm flex-shrink-0"></div>
          <span className="line-clamp-2">{t('Ponto Reciclagem')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-eco-blue shadow-sm flex-shrink-0"></div>
          <span className="line-clamp-2">{t('Ponto Lixo Eletrônico')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-eco-brown shadow-sm flex-shrink-0"></div>
          <span className="line-clamp-2">{t('Ponto Distribuição de Mudas')}</span>
        </div>
      </div>
    </div>
  );
};
