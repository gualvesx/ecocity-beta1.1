
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
          
          <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white min-h-[400px]">
            <EcoMap hideControls={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
