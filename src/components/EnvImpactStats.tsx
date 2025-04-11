
import { useEffect, useRef, useState } from 'react';

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
      <div className="text-4xl md:text-5xl font-bold text-eco-green-dark flex items-end leading-none">
        {valorExibido.toLocaleString()}{sufixo}
      </div>
      <p className="mt-2 text-lg text-muted-foreground text-center">{rotulo}</p>
    </div>
  );
};

const EstatisticasImpactoAmbiental = () => {
  return (
    <section className="py-16 bg-eco-green/5">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-dark">
            Estado Atual do Ambiente
          </h2>
          <p className="text-lg text-muted-foreground">
            Dados coletados em tempo real de nossas estações de monitoramento ambiental.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-xl shadow-md overflow-hidden">
          <StatItem valor={15840} rotulo="Hectares Monitorados" atraso={0} />
          <StatItem valor={73} rotulo="Áreas de Risco Identificadas" atraso={200} />
          <StatItem valor={428} rotulo="Alertas de Desmatamento este Mês" atraso={400} />
          <StatItem valor={45} rotulo="Índice de Qualidade do Ar" sufixo="%" atraso={600} />
        </div>
      </div>
    </section>
  );
};

export default EstatisticasImpactoAmbiental;
