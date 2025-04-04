
import { Leaf, Recycle, Trees, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HighlightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

const HighlightCard = ({ icon, title, description, className, style }: HighlightCardProps) => (
  <div 
    className={cn(
      "bg-white rounded-xl shadow-md p-6 border border-eco-green-light/20 hover:shadow-lg transition-shadow",
      className
    )}
    style={style}
  >
    <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const SustainabilityHighlights = () => {
  return (
    <section className="py-16 md:py-24 bg-eco-sand/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-dark">
            Sustainability Highlights
          </h2>
          <p className="text-lg text-muted-foreground">
            Learn about the importance of environmental protection and how local initiatives can make a global impact.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <HighlightCard
            icon={<Recycle size={24} />}
            title="Recycling Matters"
            description="On average, recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 463 gallons of oil."
            className="animate-fade-in-up" 
            style={{ animationDelay: "0.1s" }}
          />
          
          <HighlightCard
            icon={<Trees size={24} />}
            title="Tree Planting Impact"
            description="A single mature tree can absorb 48 pounds of carbon dioxide per year and produce enough oxygen for two people."
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          />
          
          <HighlightCard
            icon={<Globe size={24} />}
            title="Community Clean-ups"
            description="Community clean-ups not only remove litter but also prevent pollution of waterways and protect wildlife habitats."
            className="animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-4 text-eco-green-dark">Featured Project: Urban Reforestation</h3>
              <p className="text-muted-foreground mb-4">
                Our urban reforestation initiative aims to increase tree canopy coverage in metropolitan areas by 30% over the next decade, improving air quality and reducing urban heat islands.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">3,500+ trees planted</span> in urban environments last year
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">15% temperature reduction</span> in areas with increased tree canopy
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">500+ volunteers</span> engaged in planting and maintenance activities
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-eco-green h-full flex items-center justify-center p-8 lg:p-0">
              <div className="bg-[url('https://images.unsplash.com/photo-1494972308805-463bc619d34e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center w-full h-64 lg:h-full rounded-lg lg:rounded-none shadow-md lg:shadow-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilityHighlights;
