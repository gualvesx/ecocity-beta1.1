
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatItemProps {
  valor: number;
  rotulo: string;
  sufixo?: string;
  atraso?: number;
}

const StatItem = ({ valor, rotulo, sufixo = "", atraso = 0 }: StatItemProps) => {
  const [valorExibido, setValorExibido] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animacaoRealizada = useRef(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animacaoRealizada.current) {
          animacaoRealizada.current = true;
          
          // Delay the start of the animation based on the prop
          const timeoutId = setTimeout(() => {
            // Animate the number counting up
            let valorInicial = 0;
            const duracaoAnimacao = 2000; // 2 seconds
            const incremento = valor / (duracaoAnimacao / 16); // 60fps
            
            const interval = setInterval(() => {
              valorInicial += incremento;
              if (valorInicial >= valor) {
                setValorExibido(valor);
                clearInterval(interval);
              } else {
                setValorExibido(Math.floor(valorInicial));
              }
            }, 16);
          }, atraso);
          
          return () => clearTimeout(timeoutId);
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [valor, atraso]);
  
  return (
    <div ref={elementRef} className="flex flex-col items-center p-6">
      <div className="text-4xl md:text-5xl font-bold text-eco-green-dark dark:text-eco-green-light flex items-end leading-none">
        {valorExibido.toLocaleString()}{sufixo}
      </div>
      <p className="mt-2 text-lg text-muted-foreground text-center">{rotulo}</p>
    </div>
  );
};

const EstatisticasImpactoAmbiental = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-eco-green/5 dark:bg-eco-green-dark/5">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-dark dark:text-eco-green-light">
            {t('stats-title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('stats-subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <StatItem valor={5822} rotulo={t('hectares-monitored')} atraso={0} />
          <StatItem valor={42} rotulo={t('risk-areas')} atraso={200} />
          <StatItem valor={127} rotulo={t('deforestation-alerts')} atraso={400} />
          <StatItem valor={61} rotulo={t('air-quality')} sufixo="%" atraso={600} />
        </div>
      </div>
    </section>
  );
};

export default EstatisticasImpactoAmbiental;
