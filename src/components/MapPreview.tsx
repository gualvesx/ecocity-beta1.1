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
          
            <div className="relative min-h-[550px] -mx-4 md:mx-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-green/50 via-eco-blue/40 to-eco-green-light/50 rounded-xl"></div>
            
            <div className="absolute inset-0 shadow-[0_15px_70px_-15px_rgba(0,0,0,0.35)]  pointer-events-none z-20"></div>
            
            <div className="absolute inset-[1px] bg-white rounded-xl overflow-hidden z-10">
              <div className="relative h-full">
                <EcoMap hideControls={true} />
              </div>
            </div>
            
            <div className="absolute inset-[1px] z-30 pointer-events-none overflow-hidden rounded-xl">
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/80 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/80 to-transparent"></div>
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/80 to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/80 to-transparent"></div>
              <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-white/80 to-transparent rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-white/80 to-transparent rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-white/80 to-transparent rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-white/80 to-transparent rounded-br-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
