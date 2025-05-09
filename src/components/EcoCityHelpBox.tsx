import { Button } from '@/components/ui/button';
import { TreeDeciduous, Recycle, Leaf } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const EcoCityHelpBox = () => {
  return (
    <div className="w-full py-16 bg-eco-green-light/20"> {/* Fundo verde claro */}
      <div className="container mx-auto px-4"> {/* Container para centralizar */}
        <div className="overflow-hidden bg-eco-sand/10 rounded-xl shadow-lg"> {/* Box principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-eco-green/20 text-eco-green-dark mb-4">
                Iniciativa EcoCity
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">
                Ajude Sua Cidade a se Tornar mais Verde
              </h3>
              <p className="text-gray-600 mb-6">
                Junte-se ao movimento EcoCity e faça parte da transformação ambiental da sua comunidade. 
                Cada ação conta - da reciclagem ao plantio urbano, você pode fazer a diferença!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-eco-green hover:bg-eco-green-dark text-white">
                  <Leaf className="mr-2 h-5 w-5" />
                  Participar Agora
                </Button>
                <Button variant="outline" className="border-eco-green text-eco-green-dark hover:bg-eco-green/10">
                  Saiba Mais
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-eco-green-light/30 flex items-center justify-center text-eco-green-dark mr-3">
                    <TreeDeciduous className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">247</div>
                    <div className="text-sm text-gray-500">Árvores Plantadas</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-eco-blue-light/30 flex items-center justify-center text-eco-blue-dark mr-3">
                    <Recycle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">743kg</div>
                    <div className="text-sm text-gray-500">Resíduos Reciclados</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <AspectRatio ratio={4/3} className="md:h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-eco-green-light/30 to-eco-blue-light/30 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <img 
                    src="https://s2-redeglobo.glbimg.com/VFnfZlNqO1w9SVS0XJ1BJTZOcos=/0x0:5448x3632/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2022/X/n/0ntL3DR4uswEWAyYLQjw/parque-do-povo-3.jpg" 
                    alt="Cidade sustentável com áreas verdes" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoCityHelpBox;
