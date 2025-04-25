import { useEffect, useRef, useState } from 'react';
import { MapPin, Recycle, TreeDeciduous } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useMapPoints } from '@/hooks/useMapPoints';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapControls } from './map/MapControls';
import { MapLegend } from './map/MapLegend';
import { AddPointForm } from './map/AddPointForm';
import { PointDetails } from './map/PointDetails';

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
  
  const { mapPoints, addMapPoint, deleteMapPoint } = useMapPoints();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Initialize map without click event listener
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
  }, [map, filter, searchQuery, mapPoints]);
  
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

  return (
    <div className="relative bg-eco-sand/50 rounded-xl overflow-hidden shadow-md">
      <div ref={mapRef} className="h-[70vh] w-full z-10"></div>
      
      {!hideControls && (
        <>
          <MapControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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
              newPointPosition={null}
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
    </div>
  );
};

export default EcoMap;
