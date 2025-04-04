
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-eco-green p-8 md:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Nmg2di02aC02em02IDBoNnYtNmgtNnY2em0tMTIgNmg2di02aC02djZ6bTEyIDBoNnYtNmgtNnY2em0tNi0xMmg2di02aC02djZ6bTEyIDBoNnYtNmgtNnY2em0tMjQtMTJoNnYtNmgtNnY2em0xMiAwaDZ2LTZoLTZ2NnptMTIgMGg2di02aC02djZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our Community of Eco Advocates
              </h2>
              <p className="text-white/80 text-lg">
                Become part of our growing network of environmental enthusiasts making a positive impact. Contribute to the map, participate in events, or share resources.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/map"
                className="inline-flex items-center gap-2 bg-white text-eco-green-dark font-medium rounded-md px-6 py-3 shadow-md hover:bg-eco-sand transition-colors"
              >
                <span>Explore the Map</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-transparent border border-white text-white font-medium rounded-md px-6 py-3 hover:bg-white/10 transition-colors"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
