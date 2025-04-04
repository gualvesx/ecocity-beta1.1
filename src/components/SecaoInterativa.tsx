
import { useState } from 'react';
import { ArrowRight, Leaf, Recycle, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

const temas = [
  {
    id: 'reciclagem',
    titulo: 'Reciclagem',
    icon: Recycle,
    cor: 'bg-eco-green',
    descricao: 'A reciclagem reduz a poluição, economiza energia, conserva recursos naturais e diminui a quantidade de resíduos em aterros sanitários.'
  },
  {
    id: 'reflorestamento',
    titulo: 'Reflorestamento',
    icon: Leaf,
    cor: 'bg-eco-brown',
    descricao: 'O reflorestamento recupera áreas degradadas, combate a erosão, protege mananciais e contribui para a mitigação das mudanças climáticas.'
  },
  {
    id: 'agua',
    titulo: 'Conservação da Água',
    icon: Droplets,
    cor: 'bg-eco-blue',
    descricao: 'A economia de água é essencial para garantir este recurso vital para as gerações atuais e futuras, preservando ecossistemas aquáticos.'
  },
  {
    id: 'energia',
    titulo: 'Energia Renovável',
    icon: Wind,
    cor: 'bg-eco-blue-light',
    descricao: 'Energias renováveis como solar e eólica reduzem as emissões de gases de efeito estufa e diminuem nossa dependência de combustíveis fósseis.'
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
            Explore Temas Ecológicos
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecione um tema para aprender mais sobre diferentes aspectos da sustentabilidade e como você pode contribuir.
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
                  <h4 className="font-semibold mb-2">Dica sustentável</h4>
                  <p className="text-sm text-muted-foreground">
                    {temaAtivo === 'reciclagem' && "Separe seu lixo em categorias: plástico, papel, vidro e metal. Use sacolas reutilizáveis para suas compras."}
                    {temaAtivo === 'reflorestamento' && "Plante árvores nativas em seu bairro e participe de mutirões de reflorestamento em sua comunidade."}
                    {temaAtivo === 'agua' && "Tome banhos mais curtos, conserte vazamentos e reutilize a água da máquina de lavar para limpar calçadas."}
                    {temaAtivo === 'energia' && "Utilize lâmpadas LED, aproveite a luz natural e desligue aparelhos eletrônicos quando não estiverem em uso."}
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 text-eco-green-dark font-medium whitespace-nowrap">
                  Saiba mais <ArrowRight className="h-4 w-4" />
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
