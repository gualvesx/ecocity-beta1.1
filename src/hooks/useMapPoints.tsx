
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { MapPoint } from '@/types/map';
import { geocodeAddress } from '@/services/geocoding';
import { getStoredPoints, storePoints } from '@/services/mapStorage';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const useMapPoints = () => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchMapPoints = async () => {
    try {
      setIsLoading(true);
      
      if (!supabase) {
        console.warn('Supabase not configured, using local storage');
        const points = getStoredPoints();
        setMapPoints(points);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('eco_points')
        .select('*');
      
      if (error) throw error;
      
      const formattedPoints: MapPoint[] = data.map((point: any) => ({
        id: point.id,
        name: point.name,
        type: point.type,
        lat: point.latitude,
        lng: point.longitude,
        description: point.description,
        impact: point.impact,
        address: point.address || ''
      }));
      
      setMapPoints(formattedPoints);
      storePoints(formattedPoints);
    } catch (err) {
      console.error('Error fetching points:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching points'));
      
      const points = getStoredPoints();
      setMapPoints(points);
      toast.warning("Usando dados salvos localmente devido a um erro de conexão.");
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
      
      if (!supabase) {
        const points = getStoredPoints();
        const newId = Math.max(0, ...points.map(p => p.id)) + 1;
        const pointWithLocation: MapPoint = {
          ...newPoint,
          id: newId,
          lat: geoLocation.lat,
          lng: geoLocation.lng
        };
        
        const updatedPoints = [...points, pointWithLocation];
        setMapPoints(updatedPoints);
        storePoints(updatedPoints);
        
        toast.success("Ponto adicionado localmente!");
        return pointWithLocation;
      }
      
      const { data, error } = await supabase
        .from('eco_points')
        .insert([{
          name: newPoint.name,
          type: newPoint.type,
          latitude: geoLocation.lat,
          longitude: geoLocation.lng,
          description: newPoint.description,
          impact: newPoint.impact,
          address: newPoint.address
        }])
        .select();
      
      if (error) throw error;
      
      const createdPoint: MapPoint = {
        id: data[0].id,
        name: data[0].name,
        type: data[0].type,
        lat: data[0].latitude,
        lng: data[0].longitude,
        description: data[0].description,
        impact: data[0].impact,
        address: data[0].address
      };
      
      setMapPoints([...mapPoints, createdPoint]);
      storePoints([...mapPoints, createdPoint]);
      
      toast.success("Ponto ecológico salvo com sucesso!");
      return createdPoint;
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
      
      if (!supabase) {
        const updatedPoints = mapPoints.filter(point => point.id !== pointId);
        setMapPoints(updatedPoints);
        storePoints(updatedPoints);
        toast.success("Ponto removido com sucesso!");
        return true;
      }

      const { error } = await supabase
        .from('eco_points')
        .delete()
        .eq('id', pointId);

      if (error) throw error;

      const updatedPoints = mapPoints.filter(point => point.id !== pointId);
      setMapPoints(updatedPoints);
      storePoints(updatedPoints);
      
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
