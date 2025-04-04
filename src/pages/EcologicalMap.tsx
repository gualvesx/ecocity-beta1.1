
import { Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import EcoMap from '@/components/EcoMap';

const EcologicalMap = () => {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Interactive Ecological Map</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Discover environmental initiatives and collection points in your community
            </p>
          </div>
          
          <div className="bg-eco-green-light/20 rounded-lg p-4 max-w-md">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-eco-green shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">How to use:</span> Click on markers to view details about environmental initiatives. Use the filter to find specific types of ecological points.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <EcoMap />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green">
            <h3 className="font-semibold text-lg mb-2">Recycling Centers</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Facilities that process recyclable materials including paper, plastic, glass, and electronics.
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-green">
              <div className="w-3 h-3 rounded-full bg-eco-green"></div>
              <span>Green markers on map</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-brown">
            <h3 className="font-semibold text-lg mb-2">Tree Planting Sites</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Locations where community tree planting initiatives take place to increase urban canopy coverage.
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-brown">
              <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
              <span>Brown markers on map</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-blue">
            <h3 className="font-semibold text-lg mb-2">Clean-up Zones</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Areas where regular community clean-up events are organized to remove litter and waste.
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-blue">
              <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
              <span>Blue markers on map</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="p-8 lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-eco-green-dark">
                Want to Add a New Ecological Point?
              </h2>
              <p className="text-muted-foreground mb-6">
                We welcome contributions from community members who know about local environmental initiatives. If you'd like to suggest a new ecological point for our map, please provide details about the location and type of initiative.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
                Contact Us to Submit
              </Link>
            </div>
            <div className="lg:col-span-2 bg-eco-sand p-8 flex items-center justify-center">
              <div className="max-w-xs">
                <div className="text-4xl font-bold text-eco-green-dark mb-2">250+</div>
                <p className="text-lg">Ecological points mapped so far with help from our community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcologicalMap;
