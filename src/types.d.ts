
// Type declarations for modules without types
declare module 'react/jsx-runtime';

// Add React namespace for components that need it
declare namespace React {
  interface ReactNode {}
  interface CSSProperties {}
  interface ElementRef<T> {}
  interface ComponentPropsWithoutRef<T> {}
  interface HTMLAttributes<T> {
    className?: string;
  }
  interface ButtonHTMLAttributes<T> {
    className?: string;
  }
  interface FC<P = {}> {
    (props: P): React.ReactElement | null;
  }
  interface ReactElement {}
  interface ComponentProps<T> {}
}

// Fix the DataCardProps type
interface DataCardProps {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  className?: string;
  style?: React.CSSProperties;
}

// Types for modules
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
declare module '@radix-ui/react-slot';
declare module 'react-day-picker';
declare module '@radix-ui/react-checkbox';

// For Dispatch and SetStateAction
declare type Dispatch<A> = (value: A) => void;
declare type SetStateAction<S> = S | ((prevState: S) => S);

// Type for VariantProps
declare type VariantProps<T> = any;

// Badge component type
interface BadgeProps {
  variant?: string;
  className?: string;
}
