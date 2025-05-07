
// Declarações de tipo para módulos que não têm tipos
declare module 'react/jsx-runtime';

// Adiciona namespace React para componentes que precisam dele
namespace React {
  interface ReactNode {}
}

// Corrige o erro de "key" property no DataCardProps em MapDataSection
interface DataCardProps {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  className?: string;
  style?: React.CSSProperties;
}

// Tipos para módulos
declare module 'react';
declare module 'react-dom';
declare module 'react-router-dom';
declare module 'sonner';
declare module '@tanstack/react-query';
declare module 'lucide-react';
declare module 'date-fns';
declare module 'date-fns/locale';
declare module '@radix-ui/react-accordion';
declare module '@radix-ui/react-alert-dialog';
declare module 'class-variance-authority';
declare module '@radix-ui/react-aspect-ratio';
declare module '@radix-ui/react-avatar';
declare module 'react-hook-form';

// Tipo para componentes Shadcn
interface BadgeProps {
  variant?: string;
  className?: string;
}
