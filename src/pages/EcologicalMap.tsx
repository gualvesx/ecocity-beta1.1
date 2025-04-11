
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, MapPin, Plus } from 'lucide-react';
import MapaEco from '@/components/EcoMap';
import { useLanguage } from '@/contexts/LanguageContext';

const MapaEcologico = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              <span>{t('back-home')}</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Mapa Ecológico de Presidente Prudente</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Descubra iniciativas ambientais e pontos de coleta em sua comunidade
            </p>
          </div>
          
          <div className="bg-eco-green-light/20 rounded-lg p-4 max-w-md">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-eco-green shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Como usar:</span> Clique nos marcadores para ver detalhes sobre iniciativas ambientais. Use o filtro para encontrar tipos específicos de pontos ecológicos. Para adicionar um novo ponto, clique no botão "Adicionar Ponto".
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <MapaEco />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green">
            <h3 className="font-semibold text-lg mb-2">{t('recycling-point')}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('recycling-description')}
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-green">
              <div className="w-3 h-3 rounded-full bg-eco-green"></div>
              <span>Marcadores verdes no mapa</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-blue">
            <h3 className="font-semibold text-lg mb-2">{t('recycling-center')}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('recycling-center-description')}
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-blue">
              <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
              <span>Marcadores azuis no mapa</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-brown">
            <h3 className="font-semibold text-lg mb-2">{t('seedling-distribution')}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('seedling-description')}
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-brown">
              <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
              <span>Marcadores marrons no mapa</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="p-8 lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-eco-green-dark">
                Contribua com o Mapa Ecológico
              </h2>
              <p className="text-muted-foreground mb-6">
                Compartilhe suas descobertas ecológicas! Adicione novos pontos diretamente no mapa clicando no botão <span className="inline-flex items-center gap-1 bg-eco-green text-white rounded px-2 py-0.5 text-xs"><Plus size={12} /> Adicionar Ponto</span> no topo do mapa e preencha as informações solicitadas.
              </p>
              <div className="flex items-center gap-2 text-eco-green font-medium">
                <MapPin className="h-5 w-5" />
                <span>Juntos construímos um mapa mais completo da nossa ecologia local!</span>
              </div>
            </div>
            <div className="lg:col-span-2 bg-eco-sand p-8 flex items-center justify-center">
              <div className="max-w-xs">
                <div className="text-4xl font-bold text-eco-green-dark mb-2">250+</div>
                <p className="text-lg">Pontos ecológicos mapeados até agora com a ajuda de nossa comunidade</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaEcologico;
