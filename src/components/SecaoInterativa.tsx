import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TreeDeciduous, Recycle, Globe, Leaf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const SecaoInterativa = () => {
  const { t } = useLanguage();
  
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const ecoBoxes = [
    {
      id: 'recycling',
      title: 'Reciclagem Consciente',
      description: 'Aprenda como separar e reciclar corretamente diferentes materiais',
      icon: <Recycle className="h-10 w-10" />,
      color: 'from-eco-blue to-eco-blue-light',
      details: 'Descubra os impactos positivos da reciclagem no meio ambiente e como pequenas ações diárias podem contribuir significativamente para a redução de resíduos.'
    },
    {
      id: 'planting',
      title: 'Plantio Urbano',
      description: 'Dicas para cultivar plantas em ambientes urbanos',
      icon: <TreeDeciduous className="h-10 w-10" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'Conheça técnicas de jardinagem urbana, cultivo em pequenos espaços e a importância das áreas verdes para o equilíbrio ambiental nas cidades.'
    },
    {
      id: 'footprint',
      title: 'Pegada Ecológica',
      description: 'Calcule e reduza seu impacto no meio ambiente',
      icon: <Globe className="h-10 w-10" />,
      color: 'from-eco-brown to-eco-brown-light',
      details: 'Entenda como suas escolhas diárias afetam o planeta e descubra maneiras de reduzir sua pegada ecológica através de consumo consciente e hábitos sustentáveis.'
    },
    {
      id: 'sustainable',
      title: 'Práticas Sustentáveis',
      description: 'Adote hábitos mais sustentáveis no dia a dia',
      icon: <Leaf className="h-10 w-10" />,
      color: 'from-green-500 to-emerald-300',
      details: 'Explore alternativas sustentáveis para produtos de uso diário, aprenda sobre consumo consciente e descubra como pequenas mudanças podem ter grandes impactos positivos.'
    }
  ];
  
  const handleBoxClick = (id: string) => {
    if (selectedBox === id) {
      setSelectedBox(null);
    } else {
      setSelectedBox(id);
    }
  };
  
  const ecoActions = [
    {
      title: "Calcule sua Pegada de Carbono",
      description: "Descubra quanto CO2 você emite diariamente e aprenda maneiras de reduzir seu impacto",
      action: "Calcular Agora",
      color: "bg-eco-green-light/20"
    },
    {
      title: "Mapa de Reciclagem Local",
      description: "Encontre pontos de coleta e reciclagem próximos à sua localização",
      action: "Ver no Mapa",
      color: "bg-eco-blue-light/20"
    },
    {
      title: "Desafio Ecológico Semanal",
      description: "Participe de desafios semanais para adotar hábitos mais sustentáveis",
      action: "Participar",
      color: "bg-eco-brown-light/20"
    }
  ];
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-green-dark dark:text-eco-green-light mb-4">
            {t('Apoie a Causa!') || 'Explore Práticas Ecológicas'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('EcoCity') || 'Descubra formas de contribuir para um futuro mais sustentável com nossas ferramentas interativas'}
          </p>
        </div>
        

        
        {/* Interactive Eco Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {ecoBoxes.map((box) => (
            <Card 
              key={box.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-t-4 border-eco-green overflow-hidden ${selectedBox === box.id ? 'ring-2 ring-eco-green' : ''}`}
              onClick={() => handleBoxClick(box.id)}
            >
              <div className={`bg-gradient-to-br ${box.color} h-2 w-full`} />
              <CardHeader className="pb-2">
                <div className="w-16 h-16 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-2 mx-auto">
                  {box.icon}
                </div>
                <CardTitle className="text-center text-xl">{box.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {box.description}
                </CardDescription>
              </CardContent>
              
              {selectedBox === box.id && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{box.details}</p>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      className="bg-eco-green hover:bg-eco-green-dark text-white"
                      size="sm"
                    >
                      Saiba mais
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
        
        {/* New Eco Action Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-eco-green-dark dark:text-eco-green-light mb-6 text-center">
            Ações Ecológicas Interativas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecoActions.map((action, index) => (
              <div key={index} className={`${action.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
                <h4 className="text-lg font-semibold text-eco-green-dark mb-2">{action.title}</h4>
                <p className="text-muted-foreground mb-4">{action.description}</p>
                <Button className="bg-eco-green hover:bg-eco-green-dark text-white w-full">
                  {action.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Eco Community Feature */}
        <div className="bg-eco-sand/30 rounded-xl p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-eco-green-dark mb-4">Comunidade EcoCity</h3>
              <p className="text-muted-foreground mb-4">
                Conecte-se com pessoas comprometidas com a sustentabilidade, compartilhe experiências 
                e participe de projetos colaborativos para um planeta mais saudável.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-eco-green">2.5K+</div>
                  <div className="text-sm text-muted-foreground">Membros Ativos</div>
                </div>
                <div className="bg-white rounded p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-eco-green">186</div>
                  <div className="text-sm text-muted-foreground">Projetos Locais</div>
                </div>
              </div>
              <Button className="bg-eco-green hover:bg-eco-green-dark text-white">
                Junte-se à Comunidade
              </Button>
            </div>
            <div className="md:w-1/2 flex flex-wrap gap-2 justify-center">
              <div className="bg-eco-green-light/30 rounded-lg p-4 text-center flex flex-col items-center w-32">
                <Leaf className="h-6 w-6 text-eco-green mb-1" />
                <span className="text-sm font-medium">Compartilhe Ideias</span>
              </div>
              <div className="bg-eco-blue-light/30 rounded-lg p-4 text-center flex flex-col items-center w-32">
                <Globe className="h-6 w-6 text-eco-blue mb-1" />
                <span className="text-sm font-medium">Projetos Globais</span>
              </div>
              <div className="bg-eco-brown-light/30 rounded-lg p-4 text-center flex flex-col items-center w-32">
                <Recycle className="h-6 w-6 text-eco-brown mb-1" />
                <span className="text-sm font-medium">Dicas Práticas</span>
              </div>
              <div className="bg-green-100 rounded-lg p-4 text-center flex flex-col items-center w-32">
                <TreeDeciduous className="h-6 w-6 text-green-600 mb-1" />
                <span className="text-sm font-medium">Eventos Locais</span>
              </div>
            </div>
          </div>
        </div>

                {/* New EcoCity Help Box */}
        <div className="mb-16 overflow-hidden bg-eco-sand/30 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-eco-green/20 text-eco-green-dark mb-4">
                Iniciativa EcoCity
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">Ajude Sua Cidade a se Tornar mais Verde</h3>
              <p className="text-gray-600 mb-6">
                Junte-se ao movimento EcoCity e faça parte da transformação ambiental da sua comunidade. 
                Cada ação conta - da reciclagem ao plantio urbano, você pode fazer a diferença!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-eco-green hover:bg-eco-green-dark text-white">
                  <Leaf className="mr-2 h-5 w-5" />
                  Participar Agora
                </Button>
                <Button variant="outline" className="border-eco-green text-eco-green-dark hover:bg-eco-green/10">
                  Saiba Mais
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-eco-green-light/30 flex items-center justify-center text-eco-green-dark mr-3">
                    <TreeDeciduous className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">247</div>
                    <div className="text-sm text-gray-500">Árvores Plantadas</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-eco-blue-light/30 flex items-center justify-center text-eco-blue-dark mr-3">
                    <Recycle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">743kg</div>
                    <div className="text-sm text-gray-500">Resíduos Reciclados</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <AspectRatio ratio={4/3} className="md:h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-eco-green-light/30 to-eco-blue-light/30 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <img 
                    src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843" 
                    alt="Cidade sustentável com áreas verdes" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
        
        {/* Firebase Integration Note - Hidden in production */}
        {/* 
        // Antiga versão com tabs:
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/3">
            <h3 className="text-2xl font-semibold text-eco-green-dark dark:text-eco-green-light mb-4">
              Ferramentas interativas
            </h3>
            <p className="text-muted-foreground mb-6">
              Acesse recursos que ajudam a entender e praticar a sustentabilidade em seu dia a dia
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
        */}
      </div>
    </section>
  );
};

export default SecaoInterativa;
