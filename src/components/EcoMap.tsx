
import { useEffect, useRef, useState } from 'react';
import { MapPin, Trash2, Trees, Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Type definitions for the map points
interface MapPoint {
  id: number;
  name: string;
  type: 'recycling' | 'tree-planting' | 'clean-up';
  lat: number;
  lng: number;
  description: string;
  impact: string;
}

const EcoMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for map points
  const mapPoints: MapPoint[] = [
    {
      id: 1,
      name: "City Park Recycling Center",
      type: "recycling",
      lat: 51.505,
      lng: -0.09,
      description: "Main recycling center accepting paper, plastic, glass, and electronics.",
      impact: "Processes 5 tons of recyclable materials weekly."
    },
    {
      id: 2,
      name: "Riverside Tree Planting Project",
      type: "tree-planting",
      lat: 51.51,
      lng: -0.1,
      description: "Community tree planting initiative along the river bank.",
      impact: "250 native trees planted in the last year."
    },
    {
      id: 3,
      name: "Beach Clean-up Zone",
      type: "clean-up",
      lat: 51.5,
      lng: -0.08,
      description: "Monthly volunteer beach clean-up activity.",
      impact: "Removed over 500 lbs of plastic waste from shorelines."
    },
    {
      id: 4,
      name: "Community Garden Composting",
      type: "recycling",
      lat: 51.515,
      lng: -0.12,
      description: "Organic waste composting facility for local residents.",
      impact: "Diverts 2 tons of food waste from landfills monthly."
    },
    {
      id: 5,
      name: "Urban Forest Initiative",
      type: "tree-planting",
      lat: 51.498,
      lng: -0.13,
      description: "Creating urban micro-forests in vacant lots.",
      impact: "Established 3 micro-forests with 100+ trees each."
    },
  ];
  
  // Icon mapping for the different types of ecological points
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'recycling':
        return <Trash2 size={16} />;
      case 'tree-planting':
        return <Trees size={16} />;
      case 'clean-up':
        return <MapPin size={16} />;
      default:
        return <MapPin size={16} />;
    }
  };
  
  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || map) return;
    
    // Check if Leaflet is available
    if (typeof window !== 'undefined' && window.L) {
      // Make sure the container has a size
      if (mapRef.current.clientHeight === 0) {
        mapRef.current.style.height = '500px';
      }
      
      const L = window.L;
      const newMap = L.map(mapRef.current).setView([51.505, -0.09], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(newMap);
      
      // Add markers for each point
      mapPoints.forEach(point => {
        const markerElement = document.createElement('div');
        markerElement.className = `map-marker-${point.type}`;
        markerElement.innerHTML = getMarkerIcon(point.type).props.children;
        
        const icon = L.divIcon({
          html: markerElement,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        const marker = L.marker([point.lat, point.lng], { icon }).addTo(newMap);
        
        marker.on('click', () => {
          setSelectedPoint(point);
        });
      });
      
      setMap(newMap);
    } else {
      // Fallback to load Leaflet if not available
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      document.head.appendChild(script);
      
      script.onload = () => {
        // Reinitialize the component to try again
        setMap(null);
      };
    }
    
    return () => {
      if (map) map.remove();
    };
  }, [mapRef, map]);
  
  // Function to filter map points based on type and search query
  const getFilteredPoints = () => {
    return mapPoints.filter(point => {
      const matchesFilter = filter === 'all' || point.type === filter;
      const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           point.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };
  
  // Update markers when filter changes
  useEffect(() => {
    if (!map) return;
    
    // Clear all markers
    map.eachLayer((layer: any) => {
      if (layer._icon && layer._icon.className.includes('leaflet-marker-icon')) {
        map.removeLayer(layer);
      }
    });
    
    // Add filtered markers
    const filteredPoints = getFilteredPoints();
    filteredPoints.forEach(point => {
      const markerElement = document.createElement('div');
      markerElement.className = `map-marker-${point.type}`;
      markerElement.innerHTML = getMarkerIcon(point.type).props.children;
      
      const icon = window.L.divIcon({
        html: markerElement,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      const marker = window.L.marker([point.lat, point.lng], { icon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedPoint(point);
      });
    });
  }, [map, filter, searchQuery]);
  
  // Type icon and color mapping
  const typeInfo = {
    'recycling': { label: 'Recycling', color: 'bg-eco-green' },
    'tree-planting': { label: 'Tree Planting', color: 'bg-eco-brown' },
    'clean-up': { label: 'Clean-up', color: 'bg-eco-blue' }
  };

  return (
    <div className="relative bg-eco-sand/50 rounded-xl overflow-hidden shadow-md">
      {/* Map Container */}
      <div ref={mapRef} className="h-[70vh] w-full z-10"></div>
      
      {/* Search and Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search ecological points..."
            className="w-full pl-10 py-2 pr-4 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-green/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 py-2 px-4 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-200 hover:bg-eco-green-light/10"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-30">
              <div className="p-2">
                <button
                  onClick={() => { setFilter('all'); setIsFilterOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md",
                    filter === 'all' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                  )}
                >
                  All Points
                </button>
                
                <button
                  onClick={() => { setFilter('recycling'); setIsFilterOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                    filter === 'recycling' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                  )}
                >
                  <div className="w-3 h-3 rounded-full bg-eco-green"></div>
                  Recycling
                </button>
                
                <button
                  onClick={() => { setFilter('tree-planting'); setIsFilterOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                    filter === 'tree-planting' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                  )}
                >
                  <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
                  Tree Planting
                </button>
                
                <button
                  onClick={() => { setFilter('clean-up'); setIsFilterOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                    filter === 'clean-up' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                  )}
                >
                  <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
                  Clean-up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-sm border border-gray-200 z-20">
        <h4 className="text-sm font-medium mb-2">Map Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-eco-green"></div>
            <span>Recycling Points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
            <span>Tree Planting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
            <span>Clean-up Zones</span>
          </div>
        </div>
      </div>
      
      {/* Selected Point Information */}
      {selectedPoint && (
        <div className="absolute bottom-4 right-4 w-full max-w-md bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-eco-green-light/30 z-20">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", typeInfo[selectedPoint.type].color)}>
                {getMarkerIcon(selectedPoint.type)}
              </div>
              <h3 className="font-medium">{selectedPoint.name}</h3>
            </div>
            <button 
              onClick={() => setSelectedPoint(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Type: {typeInfo[selectedPoint.type].label}</span>
            </div>
            <p className="text-sm">{selectedPoint.description}</p>
            <div className="bg-eco-green-light/10 p-2 rounded text-sm">
              <span className="font-medium">Environmental Impact:</span> {selectedPoint.impact}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoMap;
