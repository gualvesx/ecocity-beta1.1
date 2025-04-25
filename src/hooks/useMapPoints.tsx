import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MapPoint } from '@/components/EcoMap';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

// Supabase client configuration - using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lygvpskjhiwgzsmqiojc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create the client if we have both URL and key
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Sample data for when Supabase is not configured
const samplePoints: MapPoint[] = [
  {
    id: 1,
    name: "Ecoponto Vila Furquim",
    type: "recycling-point",
    lat: -22.119511,
    lng: -51.392290,
    description: "Ponto de coleta de resíduos recicláveis e materiais volumosos.",
    impact: "Coleta aproximadamente 3 toneladas de materiais recicláveis por semana.",
    address: "Rua das Flores, 123 - Vila Furquim, Presidente Prudente - SP"
  },
  {
    id: 2,
    name: "Viveiro Municipal",
    type: "seedling-distribution",
    lat: -22.128580,
    lng: -51.388310,
    description: "Centro de distribuição de mudas nativas para plantio urbano e rural.",
    impact: "Distribui mais de 5.000 mudas por ano para projetos de reflorestamento e arborização urbana.",
    address: "Av. 14 de Setembro - Vila Marcondes, Presidente Prudente - SP"
  },
  {
    id: 3,
    name: "Centro de Reciclagem Cambuci",
    type: "recycling-center",
    lat: -22.134160,
    lng: -51.401930,
    description: "Centro de processamento e reciclagem de materiais diversos.",
    impact: "Processamento de 2 toneladas de materiais por semana.",
    address: "Rua Cambuci, 456 - Jardim Paulista, Presidente Prudente - SP"
  },
  {
    id: 4,
    name: "Ponto de Coleta Córrego do Veado",
    type: "recycling-point",
    lat: -22.121650,
    lng: -51.378750,
    description: "Ponto de coleta para resíduos recicláveis.",
    impact: "Contribui para a preservação do córrego, evitando o descarte incorreto de mais de 300kg de resíduos mensais.",
    address: "Av. Washington Luiz - Parque Residencial Jequitibás, Presidente Prudente - SP"
  },
  {
    id: 5,
    name: "Centro de Reciclagem COHAB",
    type: "recycling-center",
    lat: -22.111234,
    lng: -51.413456,
    description: "Centro de processamento e reciclagem com foco em plásticos e metais.",
    impact: "Redução de 15% no lixo enviado ao aterro sanitário da região.",
    address: "Rua Paraná, 789 - COHAB, Presidente Prudente - SP"
  },
  {
    id: 6,
    name: "Viveiro São Lucas",
    type: "seedling-distribution",
    lat: -22.138765,
    lng: -51.389012,
    description: "Viveiro privado que distribui mudas de espécies nativas.",
    impact: "Contribui para o aumento da cobertura vegetal e da biodiversidade local.",
    address: "Estrada Municipal, km 5 - Zona Rural, Presidente Prudente - SP"
  },
];

export const useMapPoints = () => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchMapPoints = async () => {
    try {
      setIsLoading(true);
      
      const localPoints = localStorage.getItem('mapPoints');
      
      if (!supabase) {
        console.warn('Supabase not configured, using local or example data');
        
        if (localPoints) {
          setMapPoints(JSON.parse(localPoints));
        } else {
          setMapPoints(samplePoints);
          localStorage.setItem('mapPoints', JSON.stringify(samplePoints));
        }
        
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
      
      localStorage.setItem('mapPoints', JSON.stringify(formattedPoints));
    } catch (err) {
      console.error('Error fetching points:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching points'));
      
      const localPoints = localStorage.getItem('mapPoints');
      if (localPoints) {
        setMapPoints(JSON.parse(localPoints));
        toast.warning("Usando dados salvos localmente devido a um erro de conexão.");
      } else {
        setMapPoints(samplePoints);
        localStorage.setItem('mapPoints', JSON.stringify(samplePoints));
        toast.error("Erro ao carregar pontos do banco de dados. Usando dados de exemplo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Presidente Prudente, SP, Brasil')}&format=json&limit=1`
      );
      
      const data = await response.json();
      
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      
      toast.error("Endereço não encontrado");
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error("Erro ao buscar coordenadas do endereço");
      return null;
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
        toast.error("Não foi possível obter as coordenadas para este endereço.");
        return null;
      }
      
      const completePoint: Omit<MapPoint, 'id'> = {
        ...newPoint,
        lat: geoLocation.lat,
        lng: geoLocation.lng
      };
      
      if (!supabase) {
        console.warn('Supabase not configured, simulating point addition');
        const newId = Math.max(0, ...mapPoints.map(p => p.id)) + 1;
        const pointWithId: MapPoint = { ...completePoint, id: newId };
        
        const updatedPoints = [...mapPoints, pointWithId];
        setMapPoints(updatedPoints);
        
        localStorage.setItem('mapPoints', JSON.stringify(updatedPoints));
        
        toast.success("Ponto adicionado localmente!");
        return pointWithId;
      }
      
      const { data, error } = await supabase
        .from('eco_points')
        .insert([
          {
            name: completePoint.name,
            type: completePoint.type,
            latitude: completePoint.lat,
            longitude: completePoint.lng,
            description: completePoint.description,
            impact: completePoint.impact,
            address: completePoint.address
          }
        ])
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
      
      const updatedPoints = [...mapPoints, createdPoint];
      setMapPoints(updatedPoints);
      
      localStorage.setItem('mapPoints', JSON.stringify(updatedPoints));
      
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
        localStorage.setItem('mapPoints', JSON.stringify(updatedPoints));
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
      localStorage.setItem('mapPoints', JSON.stringify(updatedPoints));
      
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
