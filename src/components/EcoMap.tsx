
import { useEffect, useRef, useState } from 'react';
import { MapPin, Recycle, TreeDeciduous, Search, Filter, X, Plus, Save, MapPinned, Navigation, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useMapPoints } from '@/hooks/useMapPoints';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export interface MapPoint {
  id: number;
  name: string;
  type: 'recycling-point' | 'recycling-center' | 'seedling-distribution';
  lat: number;
  lng: number;
  description: string;
  impact: string;
  address?: string;
}

interface EcoMapProps {
  hideControls?: boolean;
}

const EcoMap = ({ hideControls = false }: EcoMapProps) => {
  const { t } = useLanguage();
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
    type: 'recycling-point' as const,
    description: '',
    impact: '',
    address: ''
  });
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  const { mapPoints, addMapPoint, isLoading, error } = useMapPoints();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!mapRef.current || isMapInitialized) return;
    
    const initializeMap = () => {
      if (typeof window !== 'undefined' && window.L) {
        if (mapRef.current && mapRef.current.clientHeight === 0) {
          mapRef.current.style.height = '500px';
        }
        
        try {
          const L = window.L;
          // Fix here - pass the element ID or create one if it doesn't exist
          if (!mapRef.current.id) {
            mapRef.current.id = `map-${Math.random().toString(36).substring(2, 9)}`;
          }
          const newMap = L.map(mapRef.current.id).setView([-22.125092, -51.389639], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(newMap);
          
          newMap.on('click', function(e: any) {
            if (isAddingPoint) {
              setNewPointPosition({
                lat: e.latlng.lat,
                lng: e.latlng.lng
              });
            }
          });
          
          setMap(newMap);
          setIsMapInitialized(true);
        } catch (err) {
          console.error("Error initializing map:", err);
        }
      } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };
    
    initializeMap();
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapRef, isAddingPoint, isMapInitialized]);

  const getFilteredPoints = () => {
    return mapPoints.filter(point => {
      const matchesFilter = filter === 'all' || point.type === filter;
      const matchesSearch = 
        point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (point.address && point.address.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  };
  
  useEffect(() => {
    if (!map) return;
    
    map.eachLayer((layer: any) => {
      if (layer._icon && layer._icon.className.includes('leaflet-marker-icon')) {
        map.removeLayer(layer);
      }
    });
    
    if (isAddingPoint && newPointPosition) {
      const ecoIcon = window.L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-eco-green-dark text-white rounded-full shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      window.L.marker([newPointPosition.lat, newPointPosition.lng], { icon: ecoIcon }).addTo(map);
    }
    
    const filteredPoints = getFilteredPoints();
    filteredPoints.forEach(point => {
      const iconHtml = getMarkerIconHtml(point.type);
      
      const icon = window.L.divIcon({
        html: iconHtml,
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
  
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return <MapPin className="h-4 w-4" />;
      case 'recycling-center':
        return <Recycle className="h-4 w-4" />;
      case 'seedling-distribution':
        return <TreeDeciduous className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getMarkerIconHtml = (type: string) => {
    let bgColor, iconSvg;
    
    switch (type) {
      case 'recycling-point':
        bgColor = 'bg-eco-green';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        break;
      case 'recycling-center':
        bgColor = 'bg-eco-blue';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 22 1-5"></path><path d="m12 22 2-9"></path><path d="m16 22 3-13"></path><path d="M3.52 9.5a2 2 0 0 1 .28-2.29L7.5 3.5"></path><path d="M14 2.5a8.1 8.1 0 0 1 4.5 1.5"></path><path d="M19 5.48a2 2 0 0 1 .28 2.28L16.5 11"></path><path d="M8.52 2.2A2 2 0 0 1 10.8 3l2.76 4.83"></path><path d="M12.82 13.5a2 2 0 0 1-2.28.28L7.5 11"></path><path d="M14.5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path><path d="M5 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path><path d="M10 15a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path></svg>`;
        break;
      case 'seedling-distribution':
        bgColor = 'bg-eco-brown';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9c1.2-1.7 3-3 5-3 3.3 0 6 2.7 6 6s-2.7 6-6 6h-5"/><path d="M13 22v-2.5"/><path d="M10 22v-4c0-1.7 1.3-3 3-3v0"/><path d="M9 6h.01"/><path d="M6 6h.01"/><path d="M12 3h.01"/><path d="M7 3h.01"/><path d="M4 10h.01"/><path d="M4 15h.01"/><path d="M7 16h.01"/></svg>`;
        break;
      default:
        bgColor = 'bg-eco-green';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    }
    
    return `<div class="flex items-center justify-center w-8 h-8 ${bgColor} text-white rounded-full shadow-lg border-2 border-white">${iconSvg}</div>`;
  };
  
  const typeInfo = {
    'recycling-point': { label: t('recycling-point'), color: 'bg-eco-green', description: t('recycling-description') },
    'recycling-center': { label: t('recycling-center'), color: 'bg-eco-blue', description: t('recycling-center-description') },
    'seedling-distribution': { label: t('seedling-distribution'), color: 'bg-eco-brown', description: t('seedling-description') }
  };
  
  const toggleAddingPoint = () => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar pontos.");
      navigate("/login");
      return;
    }
    
    setIsAddingPoint(!isAddingPoint);
    if (!isAddingPoint) {
      toast.info("Clique no mapa para selecionar a localização do novo ponto ecológico ou preencha o endereço");
    } else {
      setNewPointPosition(null);
    }
  };
  
  const handleAddNewPoint = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar pontos.");
      navigate("/login");
      return;
    }
    
    if (!newPointForm.name || !newPointForm.description) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    
    if (!newPointPosition && !newPointForm.address) {
      toast.error("Selecione um local no mapa ou preencha o endereço!");
      return;
    }
    
    try {
      let address = newPointForm.address;
      if (newPointPosition && !address) {
        address = `Localização em Presidente Prudente - Lat: ${newPointPosition.lat.toFixed(6)}, Lng: ${newPointPosition.lng.toFixed(6)}`;
      }
      
      const newPoint = {
        name: newPointForm.name,
        type: newPointForm.type,
        description: newPointForm.description,
        impact: newPointForm.impact || "Impacto ambiental não especificado.",
        address: address
      };
      
      await addMapPoint(newPoint);
      
      setNewPointForm({
        name: '',
        type: 'recycling-point',
        description: '',
        impact: '',
        address: ''
      });
      setNewPointPosition(null);
      setIsAddingPoint(false);
    } catch (err) {
      toast.error("Erro ao adicionar ponto: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="relative bg-eco-sand/50 rounded-xl overflow-hidden shadow-md">
      <div ref={mapRef} className="h-[70vh] w-full z-10"></div>
      
      {!hideControls && (
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
                    onClick={() => { setFilter('recycling-point'); setIsFilterOpen(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                      filter === 'recycling-point' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                    )}
                  >
                    <div className="w-3 h-3 rounded-full bg-eco-green"></div>
                    {t('recycling-point')}
                  </button>
                  
                  <button
                    onClick={() => { setFilter('recycling-center'); setIsFilterOpen(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                      filter === 'recycling-center' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                    )}
                  >
                    <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
                    {t('recycling-center')}
                  </button>
                  
                  <button
                    onClick={() => { setFilter('seedling-distribution'); setIsFilterOpen(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                      filter === 'seedling-distribution' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
                    )}
                  >
                    <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
                    {t('seedling-distribution')}
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
          
          {user?.isAdmin && (
            <Button 
              onClick={() => navigate('/admin')}
              className="gap-1 py-2 bg-eco-brown hover:bg-eco-brown/80"
            >
              <Shield size={16} />
              <span>Painel Admin</span>
            </Button>
          )}
        </div>
      )}
      
      {!hideControls && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-sm border border-gray-200 z-20">
          <h4 className="text-sm font-medium mb-2">Legenda</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-green"></div>
              <span>{t('recycling-point')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
              <span>{t('recycling-center')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
              <span>{t('seedling-distribution')}</span>
            </div>
          </div>
        </div>
      )}
      
      {isAddingPoint && !hideControls && (
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
                <option value="recycling-point">{t('recycling-point')}</option>
                <option value="recycling-center">{t('recycling-center')}</option>
                <option value="seedling-distribution">{t('seedling-distribution')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <div className="relative">
                <MapPinned className="absolute left-2 top-2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={newPointForm.address}
                  onChange={(e) => setNewPointForm({...newPointForm, address: e.target.value})}
                  className="w-full p-2 pl-8 border border-gray-300 rounded"
                  placeholder="Ex: Rua das Flores, 123 - Vila Nova"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {newPointPosition ? 
                  "Você selecionou um ponto no mapa. O endereço é opcional." : 
                  "Digite o endereço ou clique no mapa para selecionar um ponto."
                }
              </p>
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
            
            {newPointPosition && (
              <div className="text-xs text-muted-foreground mb-3">
                Coordenadas: Lat {newPointPosition.lat.toFixed(6)}, Lng {newPointPosition.lng.toFixed(6)}
              </div>
            )}
            
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
            
            {selectedPoint.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-eco-green-dark mt-0.5 shrink-0" />
                <span>{selectedPoint.address}</span>
              </div>
            )}
            
            <p className="text-sm">{selectedPoint.description}</p>
            
            <div className="bg-eco-green-light/10 p-2 rounded text-sm">
              <span className="font-medium">Impacto Ambiental:</span> {selectedPoint.impact}
            </div>
            
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => {
                  if (map && selectedPoint) {
                    map.setView([selectedPoint.lat, selectedPoint.lng], 15);
                  }
                }}
              >
                <Navigation className="h-3 w-3 mr-1" />
                Centralizar no mapa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoMap;
