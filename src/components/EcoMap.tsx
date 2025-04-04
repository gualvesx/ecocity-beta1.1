
import { useEffect, useRef, useState } from 'react';
import { MapPin, Trash2, Trees, Search, Filter, X, Leaf, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useMapPoints } from '@/hooks/useMapPoints';
import { Button } from '@/components/ui/button';

// Type definitions for the map points
export interface MapPoint {
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
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [newPointPosition, setNewPointPosition] = useState<{lat: number, lng: number} | null>(null);
  const [newPointForm, setNewPointForm] = useState({
    name: '',
    type: 'recycling' as const,
    description: '',
    impact: ''
  });
  
  const { mapPoints, addMapPoint, isLoading, error } = useMapPoints();
  
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
      
      // Add event listener for adding new points
      newMap.on('click', function(e: any) {
        if (isAddingPoint) {
          setNewPointPosition({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          });
        }
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
  }, [mapRef, map, isAddingPoint]);

  // Function to filter map points based on type and search query
  const getFilteredPoints = () => {
    return mapPoints.filter(point => {
      const matchesFilter = filter === 'all' || point.type === filter;
      const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           point.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };
  
  // Update markers when filter changes or points are loaded
  useEffect(() => {
    if (!map) return;
    
    // Clear all markers
    map.eachLayer((layer: any) => {
      if (layer._icon && layer._icon.className.includes('leaflet-marker-icon')) {
        map.removeLayer(layer);
      }
    });
    
    // Add temporary marker for new point
    if (isAddingPoint && newPointPosition) {
      const ecoIcon = window.L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-eco-green-dark text-white rounded-full shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 2 1 3 2 4l3 3a7 7 0 0 0 7-7 7 7 0 0 0-7-7Z"/><path d="M13 7a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2Z"/></svg></div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      window.L.marker([newPointPosition.lat, newPointPosition.lng], { icon: ecoIcon }).addTo(map);
    }
    
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
  }, [map, filter, searchQuery, mapPoints, isAddingPoint, newPointPosition]);
  
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
  
  // Type icon and color mapping
  const typeInfo = {
    'recycling': { label: 'Reciclagem', color: 'bg-eco-green' },
    'tree-planting': { label: 'Plantio de Árvores', color: 'bg-eco-brown' },
    'clean-up': { label: 'Área de Limpeza', color: 'bg-eco-blue' }
  };
  
  // Handle form submission for new point
  const handleAddNewPoint = async () => {
    if (!newPointPosition) {
      toast.error("Selecione um local no mapa primeiro!");
      return;
    }
    
    if (!newPointForm.name || !newPointForm.description) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    
    const newPoint: Omit<MapPoint, 'id'> = {
      name: newPointForm.name,
      type: newPointForm.type,
      lat: newPointPosition.lat,
      lng: newPointPosition.lng,
      description: newPointForm.description,
      impact: newPointForm.impact || "Impacto ambiental não especificado."
    };
    
    try {
      await addMapPoint(newPoint);
      toast.success("Ponto ecológico adicionado com sucesso!");
      // Reset form
      setNewPointForm({
        name: '',
        type: 'recycling',
        description: '',
        impact: ''
      });
      setNewPointPosition(null);
      setIsAddingPoint(false);
    } catch (err) {
      toast.error("Erro ao adicionar ponto: " + (err instanceof Error ? err.message : String(err)));
    }
  };
  
  // Toggle point adding mode
  const toggleAddingPoint = () => {
    setIsAddingPoint(!isAddingPoint);
    if (!isAddingPoint) {
      toast.info("Clique no mapa para selecionar a localização do novo ponto ecológico");
    } else {
      setNewPointPosition(null);
    }
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
        
        <Button 
          onClick={toggleAddingPoint}
          className={cn(
            "gap-1 py-2",
            isAddingPoint ? "bg-red-500 hover:bg-red-600" : "bg-eco-green hover:bg-eco-green-dark"
          )}
        >
          {isAddingPoint ? (
            <>
              <X size={16} />
              <span>Cancelar</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Adicionar Ponto</span>
            </>
          )}
        </Button>
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
      
      {/* Add New Point Form */}
      {isAddingPoint && newPointPosition && (
        <div className="absolute bottom-4 right-4 w-full max-w-md bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-eco-green-light/30 z-20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium">Adicionar Novo Ponto Ecológico</h3>
            <button 
              onClick={() => {
                setNewPointPosition(null);
                setIsAddingPoint(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Local</label>
              <input
                type="text"
                value={newPointForm.name}
                onChange={(e) => setNewPointForm({...newPointForm, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ex: Ecoponto Vila Nova"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={newPointForm.type}
                onChange={(e) => setNewPointForm({...newPointForm, type: e.target.value as any})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="recycling">Reciclagem</option>
                <option value="tree-planting">Plantio de Árvores</option>
                <option value="clean-up">Área de Limpeza</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                value={newPointForm.description}
                onChange={(e) => setNewPointForm({...newPointForm, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                rows={2}
                placeholder="Descreva este ponto ecológico"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Impacto Ambiental</label>
              <textarea
                value={newPointForm.impact}
                onChange={(e) => setNewPointForm({...newPointForm, impact: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                rows={2}
                placeholder="Qual o impacto positivo deste ponto?"
              ></textarea>
            </div>
            
            <div className="text-xs text-muted-foreground mb-3">
              Coordenadas: Lat {newPointPosition.lat.toFixed(6)}, Lng {newPointPosition.lng.toFixed(6)}
            </div>
            
            <Button 
              onClick={handleAddNewPoint}
              className="w-full bg-eco-green hover:bg-eco-green-dark gap-1"
            >
              <Save size={16} />
              <span>Salvar Ponto Ecológico</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Selected Point Information */}
      {selectedPoint && !isAddingPoint && (
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
