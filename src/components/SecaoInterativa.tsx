
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
                  <h4 className="font-semibold mb-2 text-foreground">{t('monitoring-system')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {temaAtivo === 'desmatamento' && t('deforestation-monitoring')}
                    {temaAtivo === 'poluicao' && t('pollution-monitoring')}
                    {temaAtivo === 'agua' && t('water-monitoring')}
                    {temaAtivo === 'energia' && t('energy-monitoring')}
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 text-eco-green-dark hover:text-eco-green-light font-medium whitespace-nowrap px-4 py-2 rounded-md transition-colors">
                  {t('view-realtime-data')} <ArrowRight className="h-4 w-4" />
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
