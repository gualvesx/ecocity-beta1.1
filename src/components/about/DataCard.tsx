
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DataCardProps {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

export const DataCard = ({ icon: Icon, titleKey, descKey }: DataCardProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
      <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
        <Icon size={24} />
      </div>
      <h3 className="font-semibold text-lg mb-2">{t(titleKey)}</h3>
      <p className="text-muted-foreground">{t(descKey)}</p>
    </div>
  );
};
