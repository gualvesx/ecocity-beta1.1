
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Leaf, Globe, Recycle, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const cards = [
  {
    id: 1,
    titulo: 'Redução de Carbono',
    descricao: 'Nossas iniciativas já reduziram mais de 500 toneladas de emissões de CO₂ no último ano.',
    icone: Globe,
    cor: 'bg-eco-green',
    porcentagem: 72
  },
  {
    id: 2,
    titulo: 'Reciclagem',
    descricao: 'Mais de 30 toneladas de materiais reciclados, reduzindo significativamente o impacto em aterros sanitários.',
    icone: Recycle,
    cor: 'bg-eco-brown',
    porcentagem: 85
  },
  {
    id: 3,
    titulo: 'Economia de Água',
    descricao: 'Iniciativas de conservação economizaram mais de 1 milhão de litros de água potável na região.',
    icone: Droplets,
    cor: 'bg-eco-blue',
    porcentagem: 65
  },
  {
    id: 4,
    titulo: 'Biodiversidade',
    descricao: 'Recuperação de habitats que agora abrigam mais de 200 espécies nativas de plantas e animais.',
    icone: Leaf,
    cor: 'bg-eco-green-dark',
    porcentagem: 58
  }
];

export function InfoCardsCarrossel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollContainerRef.current) {
        setMaxScroll(
          scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
        );
      }
    };

    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const clientWidth = scrollContainerRef.current.clientWidth;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - clientWidth / 2)
        : Math.min(maxScroll, scrollPosition + clientWidth / 2);
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  return (
    <section className="py-12 bg-eco-blue-light/30">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-eco-green-dark">
              Nosso Impacto Ambiental
            </h2>
            <p className="text-muted-foreground mt-2">
              Veja os resultados que estamos alcançando juntos
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              disabled={scrollPosition <= 0}
              className={cn(
                "p-2 rounded-full border",
                scrollPosition <= 0 
                  ? "border-muted text-muted cursor-not-allowed"
                  : "border-eco-green text-eco-green hover:bg-eco-green hover:text-white transition-colors"
              )}
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={scrollPosition >= maxScroll}
              className={cn(
                "p-2 rounded-full border",
                scrollPosition >= maxScroll
                  ? "border-muted text-muted cursor-not-allowed"
                  : "border-eco-green text-eco-green hover:bg-eco-green hover:text-white transition-colors"
              )}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-none"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {cards.map((card) => (
            <Card 
              key={card.id} 
              className="min-w-[300px] max-w-[350px] border-none shadow-md hover:shadow-lg transition-shadow"
              style={{ scrollSnapAlign: 'start' }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", card.cor)}>
                    <card.icone size={24} />
                  </div>
                  <span className="text-2xl font-bold text-eco-green-dark">{card.porcentagem}%</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{card.titulo}</h3>
                <p className="text-muted-foreground">{card.descricao}</p>
                
                <div className="mt-6 w-full bg-muted rounded-full h-2.5">
                  <div 
                    className={cn("h-2.5 rounded-full", card.cor)}
                    style={{ width: `${card.porcentagem}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
