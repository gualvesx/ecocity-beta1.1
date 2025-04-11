
import { Leaf, Recycle, Trees, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HighlightCardProps {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  className?: string;
  style?: React.CSSProperties;
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
            Monitoramento Ambiental
          </h2>
          <p className="text-lg text-muted-foreground">
            Acompanhe em tempo real os indicadores ambientais críticos e como estamos trabalhando para combater problemas ecológicos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <HighlightCard
            icon={<Trees size={24} />}
            titulo="Combate ao Desmatamento"
            descricao="Nossos sensores monitoram em tempo real áreas de risco de desmatamento, alertando autoridades sobre atividades ilegais."
            className="animate-fade-in-up" 
            style={{ animationDelay: "0.1s" }}
          />
          
          <HighlightCard
            icon={<Globe size={24} />}
            titulo="Qualidade do Ar Urbano"
            descricao="Estações de monitoramento em toda a cidade fornecem dados em tempo real sobre poluentes e qualidade do ar."
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          />
          
          <HighlightCard
            icon={<Recycle size={24} />}
            titulo="Gestão de Resíduos Urbanos"
            descricao="Sensores instalados em contêineres de lixo otimizam rotas de coleta e incentivam a reciclagem apropriada."
            className="animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-4 text-eco-green-dark">Projeto de Alerta de Desmatamento</h3>
              <p className="text-muted-foreground mb-4">
                Nossa rede de monitoramento de desmatamento utiliza imagens de satélite e sensores IoT para detectar atividades de desmatamento ilegal em tempo real, permitindo uma resposta rápida.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">25% de redução</span> em atividades de desmatamento ilegal nas áreas monitoradas
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">150+ alertas</span> enviados às autoridades nos últimos 30 dias
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">12.000 hectares</span> de floresta sob monitoramento constante
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-eco-green h-full flex items-center justify-center p-8 lg:p-0">
              <div className="bg-[url('https://images.unsplash.com/photo-1494972308805-463bc619d34e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center w-full h-64 lg:h-full rounded-lg lg:rounded-none shadow-md lg:shadow-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestaquesSustentabilidade;
