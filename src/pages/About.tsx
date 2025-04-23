
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Globe, Users, Calendar, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span>{t('back-home')}</span>
        </Link>
        
        {/* Hero section */}
        <div className="bg-eco-green-light/20 rounded-xl p-8 md:p-12 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">
            {t('about-title')}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl">
            {t('about-subtitle')}
          </p>
        </div>
        
        {/* Mission section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-eco-green-dark mb-4">{t('our-mission')}</h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t('mission-description')}
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              {t('map-purpose')}
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>{t('map-goal-1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>{t('map-goal-2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>{t('map-goal-3')}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>{t('map-goal-4')}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] h-64 bg-cover bg-center"></div>
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-3">{t('vision-statement')}</h3>
              <p className="text-muted-foreground">
                {t('vision-description')}
              </p>
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium mb-2">{t('core-values')}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-eco-green-light/10 rounded p-3">
                    <span className="font-medium">{t('environmental-stewardship')}</span>
                  </div>
                  <div className="bg-eco-green-light/10 rounded p-3">
                    <span className="font-medium">{t('community-collaboration')}</span>
                  </div>
                  <div className="bg-eco-green-light/10 rounded p-3">
                    <span className="font-medium">{t('education-awareness')}</span>
                  </div>
                  <div className="bg-eco-green-light/10 rounded p-3">
                    <span className="font-medium">{t('data-transparency')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-eco-green-dark mb-8">{t('about-team-title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Team Member 1 */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-eco-green/10 flex items-center justify-center">
                <User size={80} className="text-eco-green-dark" />
              </div>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-1">Carlos Silva</h3>
                <p className="text-sm text-muted-foreground mb-3">{t('team-director')}</p>
                <p className="text-sm">
                  Especialista em sustentabilidade e gestão ambiental com mais de 15 anos de experiência.
                </p>
              </CardContent>
            </Card>
            
            {/* Team Member 2 */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-eco-green/10 flex items-center justify-center">
                <User size={80} className="text-eco-green-dark" />
              </div>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-1">Ana Oliveira</h3>
                <p className="text-sm text-muted-foreground mb-3">{t('team-coord')}</p>
                <p className="text-sm">
                  Mestre em Desenvolvimento Sustentável, coordena projetos de preservação ambiental.
                </p>
              </CardContent>
            </Card>
            
            {/* Team Member 3 */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-eco-green/10 flex items-center justify-center">
                <User size={80} className="text-eco-green-dark" />
              </div>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-1">Lucas Santos</h3>
                <p className="text-sm text-muted-foreground mb-3">{t('team-tech')}</p>
                <p className="text-sm">
                  Engenheiro ambiental e desenvolvedor de tecnologias para monitoramento ecológico.
                </p>
              </CardContent>
            </Card>
            
            {/* Team Member 4 */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-eco-green/10 flex items-center justify-center">
                <User size={80} className="text-eco-green-dark" />
              </div>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-1">Mariana Costa</h3>
                <p className="text-sm text-muted-foreground mb-3">{t('team-edu')}</p>
                <p className="text-sm">
                  Educadora ambiental com foco em iniciativas comunitárias e educação sustentável.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Map Data section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-eco-green-dark mb-4">{t('how-data-collected')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
              <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
                <Globe size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('research-partnerships')}</h3>
              <p className="text-muted-foreground">
                {t('partnerships-description')}
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
              <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('community-contributions')}</h3>
              <p className="text-muted-foreground">
                {t('contributions-description')}
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
              <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('regular-updates')}</h3>
              <p className="text-muted-foreground">
                {t('updates-description')}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link to="/map" className="inline-flex items-center gap-2 bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
              <span>{t('explore-map')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Timeline section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-eco-green-dark mb-8">{t('our-journey')}</h2>
          <div className="relative border-l-2 border-eco-green-dark pl-8 pb-8 ml-4">
            <div className="mb-12 relative">
              <div className="absolute w-6 h-6 bg-eco-green-dark rounded-full -left-11 border-4 border-white"></div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-1">{t('project-launch')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('launch-description')}
                </p>
                <div className="bg-eco-sand/50 rounded p-3 text-sm">
                  <span className="font-medium">Milestone:</span> {t('launch-milestone')}
                </div>
              </div>
            </div>
            
            <div className="mb-12 relative">
              <div className="absolute w-6 h-6 bg-eco-green-dark rounded-full -left-11 border-4 border-white"></div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-1">{t('community-expansion')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('expansion-description')}
                </p>
                <div className="bg-eco-sand/50 rounded p-3 text-sm">
                  <span className="font-medium">Milestone:</span> {t('expansion-milestone')}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute w-6 h-6 bg-eco-green-dark rounded-full -left-11 border-4 border-white"></div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-1">{t('data-driven')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('data-description')}
                </p>
                <div className="bg-eco-sand/50 rounded p-3 text-sm">
                  <span className="font-medium">Milestone:</span> {t('data-milestone')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-eco-green-dark mb-4">{t('get-involved')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('involvement-description')}
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <span>{t('submit-points')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <span>{t('partner-initiatives')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <span>{t('provide-feedback')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <span>{t('volunteer-events')}</span>
                </li>
              </ul>
              <button className="bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
                {t('contact-us')}
              </button>
            </div>
            <div className="bg-eco-green p-8 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-white mb-6">{t('faq')}</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{t('faq-add-point')}</h4>
                  <p className="text-white/80 text-sm">
                    {t('faq-add-answer')}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{t('faq-verified')}</h4>
                  <p className="text-white/80 text-sm">
                    {t('faq-verified-answer')}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{t('faq-updates')}</h4>
                  <p className="text-white/80 text-sm">
                    {t('faq-updates-answer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
