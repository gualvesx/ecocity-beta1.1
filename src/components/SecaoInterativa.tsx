import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const SecaoInterativa = () => {
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'map' | 'events' | 'community'>('map');
  
  const tabs = [
    { id: 'map', label: 'Mapa Ecológico', description: 'Explore pontos de reciclagem e iniciativas ambientais em sua região' },
    { id: 'events', label: 'Eventos', description: 'Participe de eventos ecológicos e ações comunitárias' },
    { id: 'community', label: 'Comunidade', description: 'Conecte-se com pessoas comprometidas com a sustentabilidade' },
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-bold text-eco-green-dark mb-4">
              {t('interactive-section-title')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('interactive-section-description')}
            </p>
            
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'map' | 'events' | 'community')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-eco-green text-white' 
                      : 'bg-eco-sand hover:bg-eco-green-light/20'
                  }`}
                >
                  <div className="font-medium">{tab.label}</div>
                  <div className={`text-sm ${activeTab === tab.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {tab.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:w-2/3 bg-eco-sand/50 rounded-xl p-6 shadow-md">
            {activeTab === 'map' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-eco-green-dark">Mapa Ecológico Interativo</h3>
                <p>Nosso mapa interativo mostra pontos de reciclagem, distribuição de mudas e iniciativas ambientais em toda a cidade.</p>
                <div className="aspect-video bg-eco-green-light/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-eco-green-dark mb-2">Visualize o mapa completo</div>
                    <Button className="bg-eco-green hover:bg-eco-green-dark">
                      Explorar Mapa
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'events' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-eco-green-dark">Eventos Ecológicos</h3>
                <p>Participe de eventos de limpeza, plantio de árvores, workshops de reciclagem e muito mais.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm text-eco-green font-medium mb-1">12 de Junho, 2023</div>
                      <h4 className="font-medium mb-2">Plantio Comunitário</h4>
                      <p className="text-sm text-muted-foreground">Junte-se a nós para plantar 100 árvores no Parque Municipal.</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'community' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-eco-green-dark">Comunidade Sustentável</h3>
                <p>Conecte-se com pessoas e organizações comprometidas com práticas sustentáveis em sua região.</p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-muted-foreground mb-4">
                    Faça parte da nossa comunidade e compartilhe suas iniciativas ecológicas.
                  </p>
                  <Button className="bg-eco-green hover:bg-eco-green-dark">
                    Participar da Comunidade
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecaoInterativa;
