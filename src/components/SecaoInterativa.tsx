
import { useState } from 'react';
import { ArrowRight, Trees, BadgeAlert, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const SecaoInterativa = () => {
  const [temaAtivo, setTemaAtivo] = useState('desmatamento');
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  const temas = [
    {
      id: 'desmatamento',
      titulo: t('deforestation'),
      icon: Trees,
      cor: 'bg-red-500',
      descricao: t('deforestation-description')
    },
    {
      id: 'poluicao',
      titulo: t('urban-pollution'),
      icon: BadgeAlert,
      cor: 'bg-amber-500',
      descricao: t('pollution-description')
    },
    {
      id: 'agua',
      titulo: t('water-resources'),
      icon: Droplets,
      cor: 'bg-blue-500',
      descricao: t('water-description')
    },
    {
      id: 'energia',
      titulo: t('renewable-energy'),
      icon: Wind,
      cor: 'bg-eco-green',
      descricao: t('energy-description')
    }
  ];

  const temaSelecionado = temas.find(tema => tema.id === temaAtivo);

  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/70' : 'bg-gradient-to-br from-eco-sand/30 to-eco-green-light/20'}`}>
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-eco-green-light' : 'text-eco-green-dark'}`}>
            {t('monitoring-systems')}
          </h2>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
            {t('monitoring-subtitle')}
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
                  : theme === 'dark'
                    ? "bg-gray-800 hover:bg-gray-700 shadow text-gray-100" 
                    : "bg-white hover:bg-eco-green-light/10 shadow"
              )}
            >
              <tema.icon size={24} />
              <span className="font-medium text-center">{tema.titulo}</span>
            </button>
          ))}
        </div>

        {temaSelecionado && (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden animate-fade-in`}>
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", temaSelecionado.cor)}>
                  <temaSelecionado.icon size={24} />
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-eco-green-light' : 'text-eco-green-dark'}`}>{temaSelecionado.titulo}</h3>
              </div>
              
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} mb-6 text-lg`}>
                {temaSelecionado.descricao}
              </p>
              
              <div className={`flex flex-col md:flex-row md:items-center gap-4 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-eco-green-light/10'} p-5 rounded-lg`}>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('monitoring-system')}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    {temaAtivo === 'desmatamento' && t('deforestation-monitoring')}
                    {temaAtivo === 'poluicao' && t('pollution-monitoring')}
                    {temaAtivo === 'agua' && t('water-monitoring')}
                    {temaAtivo === 'energia' && t('energy-monitoring')}
                  </p>
                </div>
                <button className={`inline-flex items-center gap-1 ${theme === 'dark' ? 'text-eco-green-light hover:text-eco-green hover:bg-gray-700/50' : 'text-eco-green-dark hover:text-eco-green-light'} font-medium whitespace-nowrap px-4 py-2 rounded-md transition-colors`}>
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
