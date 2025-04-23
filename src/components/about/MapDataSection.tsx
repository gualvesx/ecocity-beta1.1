
import { Globe, Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const MapDataSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-eco-green-dark mb-4">{t('how-data-collected')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Globe, title: 'research-partnerships', desc: 'partnerships-description' },
          { icon: Users, title: 'community-contributions', desc: 'contributions-description' },
          { icon: Calendar, title: 'regular-updates', desc: 'updates-description' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
            <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
              <Icon size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t(title)}</h3>
            <p className="text-muted-foreground">{t(desc)}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Link to="/map" className="inline-flex items-center gap-2 bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
          <span>{t('explore-map')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
