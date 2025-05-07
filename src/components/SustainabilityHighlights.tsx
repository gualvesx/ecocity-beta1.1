
import { Leaf, Recycle, Trees, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HighlightCardProps {
  icon: any; // Changed from React.ReactNode
  titulo: string;
  descricao: string;
  className?: string;
  style?: any; // Changed from React.CSSProperties
}

const HighlightCard = ({ icon, titulo, descricao, className, style }: HighlightCardProps) => (
  <div 
    className={cn(
      "bg-white rounded-xl shadow-md p-6 border border-eco-green-light/20 hover:shadow-lg transition-shadow",
      className
    )}
    style={style}
  >
    <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{titulo}</h3>
    <p className="text-muted-foreground">{descricao}</p>
  </div>
);

const DestaquesSustentabilidade = () => {
  return (
    <section className="py-16 md:py-24 bg-eco-sand/30">
        <div className="container px-4 md:px-6">
         <div className="text-center max-w-3xl mx-auto mb-12">
           <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-dark">
             Preserve sua Cidade!
           </h2>
           <p className="text-lg text-muted-foreground">
             Seu apoio hoje é o oxigênio do futuro. Faça parte desta mudança!
           </p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         </div>
         
        <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-4 text-eco-green-dark">Projeto de Preservação Ambiental</h3>
              <p className="text-muted-foreground mb-4">
                Um ecomapa que mostra pontos de coleta pode ajudar a preservar o meio ambiente ao facilitar o descarte correto de resíduos. Ao indicar locais acessíveis para coleta seletiva, reciclagem e descarte de materiais específicos (como eletrônicos, óleo e pilhas), o mapa conscientiza a população, reduz o lixo em locais inadequados e promove a economia circular. Com mais pessoas participando, menos recursos naturais são extraídos, menos poluição é gerada e os ecossistemas são protegidos. É tecnologia a serviço da sustentabilidade! ♻️🌱
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Localiza</span> pontos de coleta facilmente
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Combate </span>a poluição por descarte irregular
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Educa</span> para práticas ecoeficientes no dia a dia
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-eco-green h-full flex items-center justify-center p-8 lg:p-0">
                <img 
                    src="https://b105adb4b5.clvaw-cdnwnd.com/b6fdcda8679ba81cd86c929d8204cf9b/200004824-5b5fa5c58e/Presidente%20Prudente.JPG" 
                   alt="Presidente Prudente" 
                  className="w-full h-full object-cover"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestaquesSustentabilidade;
