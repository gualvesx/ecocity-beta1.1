
import Hero from '@/components/Hero';
import SustainabilityHighlights from '@/components/SustainabilityHighlights';
import EnvImpactStats from '@/components/EnvImpactStats';
import CallToAction from '@/components/CallToAction';
import EcoMap from '@/components/EcoMap';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <div className="container px-4 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-eco-green-dark mb-4">
              Prévia do Mapa Ecológico de Presidente Prudente
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore iniciativas ambientais em sua comunidade. Clique nos pontos para saber mais sobre centros de reciclagem, projetos de plantio de árvores e eventos de limpeza.
            </p>
          </div>
          <EcoMap />
        </div>
      </div>
      <SustainabilityHighlights />
      <EnvImpactStats />
      <CallToAction />
    </div>
  );
};

export default Index;
