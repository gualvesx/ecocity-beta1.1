
import React from 'react';
import EcoMap from '@/components/EcoMap';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Map } from 'lucide-react';

export const MapPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full pt-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-green-dark">
              Cidades Sustentáveis para um <span className="text-eco-green">Futuro Verde</span>
            </h1>
            <p className="text-lg text-black">Juntos, somos a força que protege o amanhã! 🌿 </p>
            <p className="text-lg text-black">Cada ação conta na preservação do nosso planeta.</p>
            <Button 
              onClick={() => navigate('/map')} 
              size="lg"
              className="bg-eco-green hover:bg-eco-green-dark"
            >
              <Map className="mr-2 h-5 w-5" />
              Ver Mapa Completo
            </Button>
          </div>
          
          <div className="relative min-h-[400px] rounded-xl overflow-hidden">
            {/* Melhorias nos efeitos de sombra e gradiente */}
            <div className="absolute -inset-1 bg-gradient-to-br from-eco-green/30 via-eco-blue/20 to-eco-green-light/30 blur-md opacity-70 rounded-xl"></div>
            
            {/* Camada de sombra principal */}
            <div className="absolute inset-0 shadow-[0_10px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl pointer-events-none z-20"></div>
            
            {/* Efeito de profundidade com camadas de sombra */}
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] rounded-xl pointer-events-none z-30"></div>
            
            {/* Sobreposição de cor para integração temática */}
            <div className="absolute inset-0 bg-gradient-to-br from-eco-green/15 to-eco-blue/10 opacity-70 z-10 pointer-events-none"></div>
            
            {/* Contêiner do mapa com efeitos de mesclagem aprimorados */}
            <div className="relative h-full z-0 rounded-xl overflow-hidden">
              {/* Gradientes sobrepostos para melhor mesclagem com a página */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30 opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40 opacity-60"></div>
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/70 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/70 to-transparent"></div>
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/70 to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/70 to-transparent"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_5px_rgba(255,255,255,0.3)]"></div>
              </div>
              
              {/* O componente de mapa em si */}
              <div className="relative h-full">
                <EcoMap hideControls={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
