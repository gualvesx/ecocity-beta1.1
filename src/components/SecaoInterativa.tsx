
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TreeDeciduous, Recycle, Globe, Leaf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const SecaoInterativa = () => {
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'map' | 'events' | 'community'>('map');
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const tabs = [
    { id: 'map', label: 'Mapa Ecológico', description: 'Explore pontos de reciclagem e iniciativas ambientais em sua região' },
    { id: 'events', label: 'Eventos', description: 'Participe de eventos ecológicos e ações comunitárias' },
    { id: 'community', label: 'Comunidade', description: 'Conecte-se com pessoas comprometidas com a sustentabilidade' },
  ];
  
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
      </div>
    </section>
  );
};

export default SecaoInterativa;
