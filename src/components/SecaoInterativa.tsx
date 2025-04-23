
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


export default SecaoInterativa;
