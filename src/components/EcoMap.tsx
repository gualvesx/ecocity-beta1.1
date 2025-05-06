import { useEffect, useRef, useState } from 'react';
import { MapPin, Recycle, TreeDeciduous, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useMapPoints } from '@/hooks/useMapPoints';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPoint } from '@/types/map';
import { MapControls } from './map/MapControls';
import { MapLegend } from './map/MapLegend';
import { AddPointForm } from './map/AddPointForm';
import { PointDetails } from './map/PointDetails';
import { useEventStore, Event } from '@/hooks/useEventStore';

interface EcoMapProps {
  hideControls?: boolean;
  eventMode?: boolean;
  searchQuery?: string;
}

const EcoMap = ({ hideControls = false, eventMode = false, searchQuery = '' }: EcoMapProps) => {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
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
  
  const { mapPoints, addMapPoint, deleteMapPoint } = useMapPoints();
  const { events } = useEventStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use the search query from props if provided (for event mode)
  const effectiveSearchQuery = searchQuery || localSearchQuery;
  
  useEffect(() => {
    if (!mapRef.current || isMapInitialized) return;
    
    const initializeMap = () => {
      if (typeof window !== 'undefined' && window.L) {
        if (mapRef.current && mapRef.current.clientHeight === 0) {
          mapRef.current.style.height = '500px';
        }
        
        try {
          const L = window.L;
          if (!mapRef.current.id) {
            mapRef.current.id = `map-${Math.random().toString(36).substring(2, 9)}`;
          }
          const newMap = L.map(mapRef.current.id).setView([-22.125092, -51.389639], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(newMap);
          
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
  }, [mapRef, isMapInitialized]);

  // Filter map points based on type and search query
  const getFilteredPoints = () => {
    if (eventMode) {
      return [];  // Don't show eco points in event mode
    }
    
    return mapPoints.filter(point => {
      const matchesFilter = filter === 'all' || point.type === filter;
      const matchesSearch = 
        point.name.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
        point.description.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
        (point.address && point.address.toLowerCase().includes(effectiveSearchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  };
  
  // Filter events based on search query
  const getFilteredEvents = () => {
    if (!eventMode) {
      return [];  // Don't show events in eco point mode
    }
    
    return events.filter(event => 
      event.title.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      event.address.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(effectiveSearchQuery.toLowerCase())
    );
  };
  
  // Add markers to map
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer._icon && layer._icon.className.includes('leaflet-marker-icon')) {
        map.removeLayer(layer);
      }
    });
    
    const L = window.L;
    
    // Add filtered points
    const filteredPoints = getFilteredPoints();
    filteredPoints.forEach(point => {
      const iconHtml = getMarkerIconHtml(point.type);
      
      const icon = L.divIcon({
        html: iconHtml,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      const marker = L.marker([point.lat, point.lng], { icon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedPoint(point);
        setSelectedEvent(null);
      });
    });
    
    // Add event markers if in event mode
    const filteredEvents = getFilteredEvents();
    filteredEvents.forEach(event => {
      const iconHtml = getEventMarkerIconHtml();
      
      const icon = L.divIcon({
        html: iconHtml,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      const marker = L.marker([event.lat, event.lng], { icon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedEvent(event);
        setSelectedPoint(null);
      });
    });
    
  }, [map, filter, effectiveSearchQuery, mapPoints, events, eventMode]);
  
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return <MapPin className="h-4 w-4" />;
      case 'recycling-center':
        return <Recycle className="h-4 w-4" />;
      case 'seedling-distribution':
        return <TreeDeciduous className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
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
  
  const getEventMarkerIconHtml = () => {
    return `<div class="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full shadow-lg border-2 border-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </div>`;
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
      toast.info("Preencha o endereço para adicionar um novo ponto ecológico");
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
    
    if (!newPointForm.address) {
      toast.error("Preencha o endereço!");
      return;
    }
    
    try {
      const newPoint = {
        name: newPointForm.name,
        type: newPointForm.type,
        description: newPointForm.description,
        impact: newPointForm.impact || "Impacto ambiental não especificado.",
        address: newPointForm.address
      };
      
      await addMapPoint(newPoint);
      
      setNewPointForm({
        name: '',
        type: 'recycling-point',
        description: '',
        impact: '',
        address: ''
      });
      setIsAddingPoint(false);
    } catch (err) {
      toast.error("Erro ao adicionar ponto: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeletePoint = async (pointId: number) => {
    if (window.confirm('Tem certeza que deseja remover este ponto do mapa?')) {
      const success = await deleteMapPoint(pointId);
      if (success) {
        setSelectedPoint(null);
      }
    }
  };
  
  // Render event details when an event is selected
  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    const eventDate = new Date(selectedEvent.date);
    
    return (
      <div className="absolute bottom-4 right-4 w-full max-w-md bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-purple-300 z-20">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-purple-500">
              <Calendar className="text-white h-4 w-4" />
            </div>
            <h3 className="font-medium">{selectedEvent.title}</h3>
          </div>
          <button 
            onClick={() => setSelectedEvent(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mt-0.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>{format(eventDate, 'dd/MM/yyyy')} às {selectedEvent.time}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
            <span>{selectedEvent.address}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mt-0.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>{selectedEvent.organizer}</span>
          </div>
          
          <p className="text-sm mt-2">{selectedEvent.description}</p>
          
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => map?.setView([selectedEvent.lat, selectedEvent.lng], 15)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              Centralizar no mapa
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-eco-sand/50 rounded-xl overflow-hidden shadow-lg">
      {/* Map wrapper with shadow effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-eco-green/5 to-eco-blue/5 z-0 opacity-70"></div>
        <div ref={mapRef} className="h-[70vh] w-full z-10 relative"></div>
        
        {/* Inner shadow effect */}
        <div className="absolute inset-0 shadow-inner pointer-events-none rounded-xl"></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-eco-sand/10 opacity-40 pointer-events-none rounded-xl"></div>
      </div>
      
      {!hideControls && !eventMode && (
        <>
          <MapControls
            searchQuery={localSearchQuery}
            setSearchQuery={setLocalSearchQuery}
            filter={filter}
            setFilter={setFilter}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            isAddingPoint={isAddingPoint}
            toggleAddingPoint={toggleAddingPoint}
          />
          
          <MapLegend />
          
          {isAddingPoint && (
            <AddPointForm
              newPointForm={newPointForm}
              setNewPointForm={setNewPointForm}
              newPointPosition={newPointPosition}
              setNewPointPosition={setNewPointPosition}
              setIsAddingPoint={setIsAddingPoint}
              handleAddNewPoint={handleAddNewPoint}
            />
          )}
          
          {selectedPoint && !isAddingPoint && (
            <PointDetails
              selectedPoint={selectedPoint}
              setSelectedPoint={setSelectedPoint}
              handleDeletePoint={handleDeletePoint}
              centerOnPoint={(lat, lng) => map?.setView([lat, lng], 15)}
              typeInfo={typeInfo}
              getMarkerIcon={getMarkerIcon}
            />
          )}
        </>
      )}
      
      {eventMode && selectedEvent && renderEventDetails()}
      
      {eventMode && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-sm border border-gray-200 z-20">
          <h4 className="text-sm font-medium mb-2">Legenda</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm">Evento Ecológico</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoMap;
