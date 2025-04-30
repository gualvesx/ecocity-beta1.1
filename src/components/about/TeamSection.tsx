
import { User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Gustavo Alves',
    role: 'Diretor',
    description: 'Criador do projeto, desenvolvedor em aprendizagem, 17 anos e entusiasta da Ecologia.',
  },
  {
    name: 'Gabriel Gedolin',
    role: 'Coordenador',
    description: 'Desenvolvedor aprendiz, 17 anos, apoiador do projeto EcoCity e apoiador da Ecologia.',
  }
];

export const TeamSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-eco-green-dark mb-8 text-center">{t('about-team-title')}</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {teamMembers.map((member) => (
          <Card key={member.name} className="overflow-hidden w-full max-w-xs">
            <div className="aspect-square bg-eco-green/10 flex items-center justify-center">
              <User size={80} className="text-eco-green-dark" />
            </div>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t(member.role)}</p>
              <p className="text-sm">{member.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
