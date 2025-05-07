
import { X, MapPin, Navigation, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapPoint } from '@/types/map';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface PointDetailsProps {
  selectedPoint: MapPoint;
  setSelectedPoint: (point: MapPoint | null) => void;
  handleDeletePoint: (id: number) => void;
  centerOnPoint: (lat: number, lng: number) => void;
  typeInfo: Record<string, { label: string; color: string; description: string }>;
  getMarkerIcon: (type: string) => any; // Changed from React.ReactElement
}

export const PointDetails = ({
  selectedPoint,
  setSelectedPoint,
  handleDeletePoint,
  centerOnPoint,
  typeInfo,
  getMarkerIcon
}: PointDetailsProps) => {
  const { user } = useAuth();
  
  return (
    <div className="absolute bottom-4 right-4 w-full max-w-md bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-eco-green-light/30 z-20">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", typeInfo[selectedPoint.type].color)}>
            {getMarkerIcon(selectedPoint.type)}
          </div>
          <h3 className="font-medium">{selectedPoint.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {user?.isAdmin && (
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleDeletePoint(selectedPoint.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <button 
            onClick={() => setSelectedPoint(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
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
            onClick={() => centerOnPoint(selectedPoint.lat, selectedPoint.lng)}
          >
            <Navigation className="h-3 w-3 mr-1" />
            Centralizar no mapa
          </Button>
        </div>
      </div>
    </div>
  );
};
