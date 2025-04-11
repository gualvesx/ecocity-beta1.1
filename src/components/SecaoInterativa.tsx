
import { useState } from 'react';
import { ArrowRight, Trees, BadgeAlert, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

const temas = [
  {
    id: 'desmatamento',
    titulo: 'Desmatamento',
    icon: Trees,
    cor: 'bg-red-500',
    descricao: 'O desmatamento é uma das principais ameaças à biodiversidade e contribui significativamente para as mudanças climáticas globais.'
  },
  {
    id: 'poluicao',
    titulo: 'Poluição Urbana',
    icon: BadgeAlert,
    cor: 'bg-amber-500',
    descricao: 'A poluição do ar e da água nas cidades afeta diretamente a saúde da população e a qualidade de vida urbana.'
  },
  {
    id: 'agua',
    titulo: 'Recursos Hídricos',
    icon: Droplets,
    cor: 'bg-blue-500',
    descricao: 'O monitoramento dos recursos hídricos é essencial para garantir o abastecimento sustentável e prevenir crises hídricas.'
  },
  {
    id: 'energia',
    titulo: 'Energia Renovável',
    icon: Wind,
    cor: 'bg-eco-green',
    descricao: 'A transição para fontes de energia renovável é fundamental para reduzir as emissões de gases de efeito estufa.'
  }
];

const SecaoInterativa = () => {
  const [temaAtivo, setTemaAtivo] = useState(temas[0].id);

  const temaSelecionado = temas.find(tema => tema.id === temaAtivo);

  return (
    <section className="py-16 bg-gradient-to-br from-eco-sand/30 to-eco-green-light/20">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">
            Monitoramento Ambiental
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecione um tema para conhecer nossos sistemas de monitoramento e alertas para diferentes desafios ambientais.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {temas.map((tema) => (
            <button
              key={tema.id}
              onClick={() => setTemaAtivo(tema.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-lg transition-all",
                temaAtivo === tema.id 
                  ? `${tema.cor} text-white shadow-lg scale-105` 
                  : "bg-white hover:bg-eco-green-light/10 shadow"
              )}
            >
              <tema.icon size={24} />
              <span className="font-medium text-center">{tema.titulo}</span>
            </button>
          ))}
        </div>

        {temaSelecionado && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", temaSelecionado.cor)}>
                  <temaSelecionado.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-eco-green-dark">{temaSelecionado.titulo}</h3>
              </div>
              
              <p className="text-muted-foreground mb-6 text-lg">
                {temaSelecionado.descricao}
              </p>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 bg-eco-green-light/10 p-5 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Sistema de Monitoramento</h4>
                  <p className="text-sm text-muted-foreground">
                    {temaAtivo === 'desmatamento' && "Utilizamos imagens de satélite e IA para detectar alterações na cobertura florestal, com alertas em tempo real para as autoridades."}
                    {temaAtivo === 'poluicao' && "Rede de sensores IoT instalados pela cidade monitoram qualidade do ar, ruído e poluentes específicos 24 horas por dia."}
                    {temaAtivo === 'agua' && "Sensores instalados em reservatórios, rios e estações de tratamento monitoram quantidade e qualidade da água disponível."}
                    {temaAtivo === 'energia' && "Painéis de controle monitoram a produção de energia renovável e a redução de emissões de carbono em tempo real."}
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 text-eco-green-dark font-medium whitespace-nowrap">
                  Ver dados em tempo real <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SecaoInterativa;
