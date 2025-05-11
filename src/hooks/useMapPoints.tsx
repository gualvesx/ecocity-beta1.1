
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { MapPoint } from '@/types/map';
import { geocodeAddress } from '@/services/geocoding';
import { getStoredPoints } from '@/services/mapStorage';
import { firebaseFirestore } from '@/services/firebaseFirestore';

export const useMapPoints = () => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchMapPoints = async () => {
    try {
      setIsLoading(true);
      console.log('Using Firebase for map points');
      const points = await getStoredPoints(); // This now uses Firebase
      
      // Ensure all points have lat/lng properties
      const processedPoints = points.map(point => ({
        ...point,
        lat: point.position?.latitude || 0,
        lng: point.position?.longitude || 0
      }));
      
      setMapPoints(processedPoints);
      console.log('Processed map points:', processedPoints);
    } catch (err) {
      console.error('Error fetching points:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching points'));
      
      // Fallback to empty array
      setMapPoints([]);
      toast.warning("Erro ao carregar pontos do mapa.");
    } finally {
      setIsLoading(false);
    }
  };

  const addMapPoint = async (newPoint: Omit<MapPoint, 'id' | 'lat' | 'lng'> & { address: string }): Promise<MapPoint | null> => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar pontos.");
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const geoLocation = await geocodeAddress(newPoint.address);
      
      if (!geoLocation) {
        toast.error("Endereço não encontrado. Por favor, verifique e tente novamente");
        return null;
      }
      
      // Use Firebase to add the point
      const createdPoint = await firebaseFirestore.mapPoints.add({
        name: newPoint.name,
        type: newPoint.type,
        lat: geoLocation.lat,
        lng: geoLocation.lng,
        description: newPoint.description,
        impact: newPoint.impact,
        address: newPoint.address,
        // Also add position for compatibility
        position: {
          latitude: geoLocation.lat,
          longitude: geoLocation.lng
        }
      });
      
      // Ensure the created point has lat/lng properties
      const pointWithLatLng = {
        ...createdPoint,
        lat: createdPoint.position?.latitude || geoLocation.lat,
        lng: createdPoint.position?.longitude || geoLocation.lng
      };
      
      setMapPoints([...mapPoints, pointWithLatLng]);
      toast.success("Ponto ecológico salvo com sucesso!");
      return pointWithLatLng;
    } catch (err) {
      console.error('Error adding point:', err);
      toast.error("Erro ao salvar o ponto no banco de dados.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMapPoint = async (pointId: number): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error("Você precisa ser administrador para remover pontos.");
      return false;
    }

    try {
      setIsLoading(true);
      
      // Use Firebase to delete the point
      await firebaseFirestore.mapPoints.delete(pointId.toString());

      // Update the local state
      const updatedPoints = mapPoints.filter(point => point.id !== pointId);
      setMapPoints(updatedPoints);
      
      toast.success("Ponto removido com sucesso!");
      return true;
    } catch (err) {
      console.error('Error deleting point:', err);
      toast.error("Erro ao remover o ponto");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapPoints();
  }, []);

  return {
    mapPoints,
    addMapPoint,
    deleteMapPoint,
    isLoading,
    error,
    refreshPoints: fetchMapPoints
  };
};
