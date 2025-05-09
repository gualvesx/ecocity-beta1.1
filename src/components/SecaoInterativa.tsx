import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { TreeDeciduous, Recycle, Globe, Leaf } from 'lucide-react';

interface EcoBox {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  details: string;
}

interface EcoAction {
  title: string;
  description: string;
  action: string;
  color: string;
}

const SecaoInterativa = () => {
  const { t } = useLanguage();
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const ecoBoxes: EcoBox[] = [
    {
      id: 'recycling',
      title: 'Poluição dos Solos',
      description: 'Metais pesados que envenenam a terra por décadas',
      icon: <Recycle className="h-10 w-10" aria-hidden="true" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'Resíduos eletrônicos descartados incorretamente liberam chumbo, mercúrio e cádmio que se infiltram no solo. Uma bateria de celular abandonada pode contaminar até 60 mil litros de água com seus componentes tóxicos.'
    },
    {
      id: 'water',
      title: 'Contaminação da Água',
      description: 'Produtos químicos que atingem reservas subterrâneas',
      icon: <TreeDeciduous className="h-10 w-10" aria-hidden="true" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'Quando chove sobre lixões eletrônicos, a água arrasta substâncias perigosas que penetram no subsolo, poluindo aquíferos que abastecem a cidade. Estudos mostram que 40% dos poços próximos a depósitos irregulares apresentam níveis perigosos de cromo hexavalente.'
    },
    {
      id: 'climate',
      title: 'Impacto Climático',
      description: 'Emissões que intensificam o aquecimento',
      icon: <Globe className="h-10 w-10" aria-hidden="true" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'A decomposição irregular de componentes eletrônicos libera gases do efeito estufa como metano e hexafluoreto de enxofre (23.000 vezes mais potente que CO₂). Em bairros com depósitos clandestinos, a temperatura média pode ser 3°C mais alta.'
    },
    {
      id: 'urban',
      title: 'Degradação Urbana',
      description: 'Paisagens que desvalorizam a cidade',
      icon: <Leaf className="h-10 w-10" aria-hidden="true" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'Pilhas de eletrônicos abandonados criam paisagens degradantes em áreas públicas, reduzem o valor imobiliário do entorno e afastam o turismo. Uma rua com pontos de descarte irregular sofre desvalorização de até 25% no preço dos imóveis.'
    }
  ];

  const ecoActions: EcoAction[] = [
    {
      title: "Calcule sua Pegada de Carbono",
      description: "Descubra quanto CO2 você emite diariamente",
      action: "Calcular Agora",
      color: "bg-eco-green-light/20"
    },
    {
      title: "Mapa de Reciclagem Local",
      description: "Encontre pontos de coleta próximos à você",
      action: "Ver no Mapa",
      color: "bg-eco-blue-light/20"
    },
    {
      title: "Desafio Ecológico Semanal",
      description: "Adote hábitos mais sustentáveis",
      action: "Participar",
      color: "bg-eco-green-light/20"
    }
  ];
  
  const handleBoxClick = (id: string) => {
    setSelectedBox(prev => prev === id ? null : id);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900" aria-labelledby="section-title">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 id="section-title" className="text-3xl font-bold text-eco-green-dark dark:text-eco-green-light mb-4">
            {t('Apoie a Causa!') || 'Impactos do Lixo Eletrônico'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('EcoCity') || 'Conheça os danos ambientais e como combatê-los'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {ecoBoxes.map((box) => (
            <Card 
              key={box.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-t-4 border-eco-green overflow-hidden ${
                selectedBox === box.id ? 'ring-2 ring-eco-green' : ''
              }`}
              onClick={() => handleBoxClick(box.id)}
              aria-expanded={selectedBox === box.id}
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
                      aria-label={`Saiba mais sobre ${box.title}`}
                    >
                      Saiba mais
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold text-eco-green-dark dark:text-eco-green-light mb-6 text-center">
            Ações de Combate
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecoActions.map((action, index) => (
              <div key={index} className={`${action.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
                <h4 className="text-lg font-semibold text-eco-green-dark mb-2">{action.title}</h4>
                <p className="text-muted-foreground mb-4">{action.description}</p>
                <Button 
                  className="bg-eco-green hover:bg-eco-green-dark text-white w-full"
                  aria-label={action.action}
                >
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
