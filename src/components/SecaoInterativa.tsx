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
      title: 'Reciclagem Consciente',
      description: 'Aprenda como separar e reciclar corretamente diferentes materiais',
      icon: <Recycle className="h-10 w-10" aria-hidden="true" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'Descubra os impactos positivos da reciclagem no meio ambiente e como pequenas ações diárias podem contribuir significativamente para a redução de resíduos.'
    },
    // ... outros itens
  ];
  
  const ecoActions: EcoAction[] = [
    {
      title: "Calcule sua Pegada de Carbono",
      description: "Descubra quanto CO2 você emite diariamente e aprenda maneiras de reduzir seu impacto",
      action: "Calcular Agora",
      color: "bg-eco-green-light/20"
    },
    // ... outros itens
  ];
  
  const handleBoxClick = (id: string) => {
    setSelectedBox(prev => prev === id ? null : id);
  };
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900" aria-labelledby="section-title">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 id="section-title" className="text-3xl font-bold text-eco-green-dark dark:text-eco-green-light mb-4">
            {t('Apoie a Causa!') || 'Explore Práticas Ecológicas'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('EcoCity') || 'Descubra formas de contribuir para um futuro mais sustentável com nossas ferramentas interativas'}
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
              {/* ... conteúdo do card ... */}
            </Card>
          ))}
        </div>

        {/* ... resto do código ... */}
      </div>
    </section>
  );
};

export default SecaoInterativa;
