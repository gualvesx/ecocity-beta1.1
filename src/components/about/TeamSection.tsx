
import { User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Carlos Silva',
    role: 'team-director',
    description: 'Especialista em sustentabilidade e gestão ambiental com mais de 15 anos de experiência.',
  },
  {
    name: 'Ana Oliveira',
    role: 'team-coord',
    description: 'Mestre em Desenvolvimento Sustentável, coordena projetos de preservação ambiental.',
  },
  {
    name: 'Lucas Santos',
    role: 'team-tech',
    description: 'Engenheiro ambiental e desenvolvedor de tecnologias para monitoramento ecológico.',
  },
  {
    name: 'Mariana Costa',
    role: 'team-edu',
    description: 'Educadora ambiental com foco em iniciativas comunitárias e educação sustentável.',
  },
];

export const TeamSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-eco-green-dark mb-8">{t('about-team-title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.name} className="overflow-hidden">
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
