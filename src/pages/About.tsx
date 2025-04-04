
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Globe, Users, Calendar, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        
        {/* Hero section */}
        <div className="bg-eco-green-light/20 rounded-xl p-8 md:p-12 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">
            About Green Earth Connect
          </h1>
          <p className="text-lg md:text-xl max-w-3xl">
            A community-driven platform dedicated to promoting environmental awareness and sustainable practices through interactive mapping and educational resources.
          </p>
        </div>
        
        {/* Mission section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-eco-green-dark mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Green Earth Connect was founded with a clear purpose: to bridge the gap between environmental awareness and community action. We believe that by making ecological information accessible and interactive, we can inspire more people to participate in sustainability efforts.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our interactive ecological map serves as the cornerstone of this mission, providing a visual representation of environmental initiatives in communities around the world. By highlighting recycling centers, tree planting projects, clean-up zones, and other ecological points, we aim to:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>Increase awareness of local environmental initiatives</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>Facilitate community participation in sustainability efforts</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>Track and celebrate the collective environmental impact</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>Connect people with opportunities to make a difference</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] h-64 bg-cover bg-center"></div>
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-3">Vision Statement</h3>
              <p className="text-muted-foreground">
                We envision a world where every community is empowered with the knowledge, tools, and connections needed to create sustainable local environments that contribute to global ecological health.
              </p>
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium mb-2">Core Values</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-eco-green-light/10 rounded p-3">
                    <span className="font-medium">Environmental Stewardship</span>
                  </div>
                  <div className="bg-eco-green-light/10 rounded p-3">
                    <span className="font-medium">Community Collaboration</span>
                  </div>
                  <div className="bg-eco-green-light/10 rounded p-3">
                    <span className="font-medium">Education & Awareness</span>
                  </div>
                  <div className="bg-eco-green-light/10 rounded p-3">
                    <span className="font-medium">Data Transparency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Data section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-eco-green-dark mb-4">How Our Map Data is Collected</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
              <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
                <Globe size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Research & Partnerships</h3>
              <p className="text-muted-foreground">
                We collaborate with environmental organizations, local governments, and research institutions to gather verified data about ecological initiatives worldwide.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
              <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Contributions</h3>
              <p className="text-muted-foreground">
                Our community members submit information about local ecological points, which our team verifies before adding to the map.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
              <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Regular Updates</h3>
              <p className="text-muted-foreground">
                We continuously update our ecological data to ensure accuracy and relevance, including impact statistics and new initiatives.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link to="/map" className="inline-flex items-center gap-2 bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
              <span>Explore the Map</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Timeline section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-eco-green-dark mb-8">Our Journey</h2>
          <div className="relative border-l-2 border-eco-green-dark pl-8 pb-8 ml-4">
            <div className="mb-12 relative">
              <div className="absolute w-6 h-6 bg-eco-green-dark rounded-full -left-11 border-4 border-white"></div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-1">2022 - Project Launch</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Green Earth Connect was established with the vision of creating an interactive ecological map to promote environmental awareness.
                </p>
                <div className="bg-eco-sand/50 rounded p-3 text-sm">
                  <span className="font-medium">Milestone:</span> Initial map development with 50 ecological points
                </div>
              </div>
            </div>
            
            <div className="mb-12 relative">
              <div className="absolute w-6 h-6 bg-eco-green-dark rounded-full -left-11 border-4 border-white"></div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-1">2023 - Community Expansion</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We expanded our platform to include community contributions and launched partnerships with local environmental organizations.
                </p>
                <div className="bg-eco-sand/50 rounded p-3 text-sm">
                  <span className="font-medium">Milestone:</span> Reached 150+ ecological points and 1,000+ community members
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute w-6 h-6 bg-eco-green-dark rounded-full -left-11 border-4 border-white"></div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-1">2024 - Data-Driven Impact</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Implemented impact tracking to measure the collective environmental contribution of mapped initiatives.
                </p>
                <div className="bg-eco-sand/50 rounded p-3 text-sm">
                  <span className="font-medium">Milestone:</span> Advanced filtering and search capabilities added to the ecological map
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-eco-green-dark mb-4">Get Involved</h2>
              <p className="text-muted-foreground mb-6">
                We welcome contributions from individuals and organizations passionate about environmental sustainability. Contact us to:
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <span>Submit new ecological points for the map</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <span>Partner with us on environmental initiatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <span>Provide feedback on the platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                    <Leaf size={14} />
                  </div>
                  <span>Volunteer for community events</span>
                </li>
              </ul>
              <button className="bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
                Contact Us
              </button>
            </div>
            <div className="bg-eco-green p-8 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">How can I add a point to the map?</h4>
                  <p className="text-white/80 text-sm">
                    Contact us with details about the ecological initiative, including location, type, and impact data if available.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Is the data on the map verified?</h4>
                  <p className="text-white/80 text-sm">
                    Yes, our team verifies all ecological points before adding them to ensure accuracy and reliability.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">How often is the map updated?</h4>
                  <p className="text-white/80 text-sm">
                    We update the map regularly with new points and refresh existing data quarterly to maintain accuracy.
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
