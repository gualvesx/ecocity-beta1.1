
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
              Interactive Ecological Map Preview
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore environmental initiatives in your community. Click on points to learn more about recycling centers, tree planting projects, and clean-up events.
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
