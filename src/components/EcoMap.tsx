
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
  
  // Sample data for map points in Presidente Prudente, Brazil
  const mapPoints: MapPoint[] = [
    {
      id: 1,
      name: "Ecoponto Vila Furquim",
      type: "recycling",
      lat: -22.119511,
      lng: -51.392290,
      description: "Ponto de coleta de resíduos recicláveis e materiais volumosos.",
      impact: "Coleta aproximadamente 3 toneladas de materiais recicláveis por semana."
    },
    {
      id: 2,
      name: "Parque do Povo",
      type: "tree-planting",
      lat: -22.128580,
      lng: -51.388310,
      description: "Área verde com projetos de plantio de árvores nativas.",
      impact: "Mais de 150 árvores plantadas no último ano, contribuindo para a qualidade do ar."
    },
    {
      id: 3,
      name: "Ecoponto Cambuci",
      type: "recycling",
      lat: -22.134160,
      lng: -51.401930,
      description: "Centro de coleta de materiais recicláveis, entulhos e volumosos.",
      impact: "Processamento de 2 toneladas de materiais por semana."
    },
    {
      id: 4,
      name: "Mutirão Córrego do Veado",
      type: "clean-up",
      lat: -22.121650,
      lng: -51.378750,
      description: "Área de limpeza regular do córrego e suas margens.",
      impact: "Remoção de mais de 300kg de resíduos mensais, protegendo o ecossistema aquático."
    },
    {
      id: 5,
      name: "Ecoponto COHAB",
      type: "recycling",
      lat: -22.111234,
      lng: -51.413456,
      description: "Centro de coleta seletiva e descarte correto de resíduos.",
      impact: "Redução de 15% no lixo enviado ao aterro sanitário da região."
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
      // Set the map view to Presidente Prudente, Brazil
      const newMap = L.map(mapRef.current).setView([-22.125092, -51.389639], 13);
      
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
    'recycling': { label: 'Reciclagem', color: 'bg-eco-green' },
    'tree-planting': { label: 'Plantio de Árvores', color: 'bg-eco-brown' },
    'clean-up': { label: 'Área de Limpeza', color: 'bg-eco-blue' }
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
            placeholder="Buscar pontos ecológicos..."
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
            <span>Filtrar</span>
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
                  Todos os Pontos
                </button>
                
                <button
                  onClick={() => { setFilter('recycling'); setIsFilterOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                    filter === 'recycling' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                  )}
                >
                  <div className="w-3 h-3 rounded-full bg-eco-green"></div>
                  Reciclagem
                </button>
                
                <button
                  onClick={() => { setFilter('tree-planting'); setIsFilterOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                    filter === 'tree-planting' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                  )}
                >
                  <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
                  Plantio de Árvores
                </button>
                
                <button
                  onClick={() => { setFilter('clean-up'); setIsFilterOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                    filter === 'clean-up' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                  )}
                >
                  <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
                  Áreas de Limpeza
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-sm border border-gray-200 z-20">
        <h4 className="text-sm font-medium mb-2">Legenda</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-eco-green"></div>
            <span>Pontos de Reciclagem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
            <span>Plantio de Árvores</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
            <span>Áreas de Limpeza</span>
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
              <span>Tipo: {typeInfo[selectedPoint.type].label}</span>
            </div>
            <p className="text-sm">{selectedPoint.description}</p>
            <div className="bg-eco-green-light/10 p-2 rounded text-sm">
              <span className="font-medium">Impacto Ambiental:</span> {selectedPoint.impact}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoMap;
