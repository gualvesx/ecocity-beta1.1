
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TreeDeciduous, Recycle, Globe, Leaf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

const SecaoInterativa = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const ecoBoxes = [
    {
      id: 'recycling',
      title: '',
      description: 'Aprenda como separar e reciclar corretamente diferentes materiais',
      icon: <Recycle className="h-10 w-10" />,
      color: 'from-eco-green to-eco-green-light',
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
      color: 'from-eco-green to-eco-green-light',
      details: 'Entenda como suas escolhas diárias afetam o planeta e descubra maneiras de reduzir sua pegada ecológica através de consumo consciente e hábitos sustentáveis.'
    },
    {
      id: 'sustainable',
      title: 'Práticas Sustentáveis',
      description: 'Adote hábitos mais sustentáveis no dia a dia',
      icon: <Leaf className="h-10 w-10" />,
      color: 'from-eco-green to-eco-green-light',
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
      color: "bg-eco-green-light/20"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
      </div>
    </section>
  );
};

export default SecaoInterativa;
