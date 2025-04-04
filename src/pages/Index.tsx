
import Hero from '@/components/Hero';
import DestaquesSustentabilidade from '@/components/SustainabilityHighlights';
import EstatisticasImpactoAmbiental from '@/components/EnvImpactStats';
import ChamadaParaAcao from '@/components/CallToAction';
import MapaEco from '@/components/EcoMap';

const Inicio = () => {
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
          <MapaEco />
        </div>
      </div>
      <DestaquesSustentabilidade />
      <EstatisticasImpactoAmbiental />
      <ChamadaParaAcao />
    </div>
  );
};

export default Inicio;
