
import { useState } from 'react';
import { ArrowRight, Trees, BadgeAlert, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const SecaoInterativa = () => {
  const [temaAtivo, setTemaAtivo] = useState('desmatamento');
  const { theme } = useTheme();
  const { t } = useLanguage();

  const temas = [
    {
      id: 'desmatamento',
      titulo:'Impacto Ambiental',
      icon: Trees,
      cor: 'bg-red-500',
      descricao: 'Quando o lixo é jogado no lugar errado, o solo perde vida e vira um terreno tóxico!'
    },
    {
      id: 'poluicao',
      titulo: 'Riscos às pessoas',
      icon: BadgeAlert,
      cor: 'bg-amber-500',
      descricao: 'Moradores próximos a lixões eletrônicos inalam toxinas e sofrem com doenças graves – descarte incorreto mata!'
    },
    {
      id: 'agua',
      titulo: 'Recursos Hídricos',
      icon: Droplets,
      cor: 'bg-blue-500',
      descricao: 'O descarte incorreto de lixo contamina o lençol freático, envenenando a água que bebemos e destruindo fontes naturais de vida!'
    },
    {
      id: 'energia',
      titulo: 'Danos ao ar',
      icon: Wind,
      cor: 'bg-eco-green',
    descricao: 'Queimar lixo de forma irregular libera gases venenosos e destrói a qualidade do ar que respiramos!'
    }
  ];

  const temaSelecionado = temas.find(tema => tema.id === temaAtivo);
 
return (
  <section className="py-16 bg-gradient-to-br from-eco-sand/30 to-eco-green-light/20">
    <div className="container px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-dark">
          {t('Apoie a Causa!')}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t('EcoCity')}
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
          </div>
        </div>
      )}
    </div>
  </section>
);
 };
export default SecaoInterativa;
