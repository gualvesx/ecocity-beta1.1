
// Type declarations for modules without types
declare module 'react/jsx-runtime';

// Add React namespace for components that need it
namespace React {
  interface ReactNode {}
}

// Fix "key" property in DataCardProps error in MapDataSection
interface DataCardProps {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  className?: string;
  style?: React.CSSProperties;
}
