
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

// Custom hook to manage map points
export const useMapPoints = () => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Function to load map points from Supabase or localStorage
  const fetchMapPoints = async () => {
    try {
      setIsLoading(true);
      
      // Check if there are locally saved points
      const localPoints = localStorage.getItem('mapPoints');
      
      // If we don't have Supabase connection, use local or example data
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
      
      // Supabase query
      const { data, error } = await supabase
        .from('eco_points')
        .select('*');
      
      if (error) throw error;
      
      // Transform data to match our MapPoint format
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
      
      // Save to localStorage as backup
      localStorage.setItem('mapPoints', JSON.stringify(formattedPoints));
    } catch (err) {
      console.error('Error fetching points:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching points'));
      
      // Check if there are locally saved points
      const localPoints = localStorage.getItem('mapPoints');
      if (localPoints) {
        setMapPoints(JSON.parse(localPoints));
        toast.warning("Usando dados salvos localmente devido a um erro de conexão.");
      } else {
        // If an error occurs, use example data
        setMapPoints(samplePoints);
        localStorage.setItem('mapPoints', JSON.stringify(samplePoints));
        toast.error("Erro ao carregar pontos do banco de dados. Usando dados de exemplo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to geocode an address (simulated)
  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    // In a real implementation, this would use an API like Google Maps or Mapbox
    // For now, return a random location near Presidente Prudente
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
    
    const baseLocation = {
      lat: -22.12,
      lng: -51.39
    };
    
    // Add a random variation
    return {
      lat: baseLocation.lat + (Math.random() - 0.5) * 0.02,
      lng: baseLocation.lng + (Math.random() - 0.5) * 0.02
    };
  };

  // Function to add a new map point
  const addMapPoint = async (newPoint: Omit<MapPoint, 'id' | 'lat' | 'lng'> & { address: string }): Promise<MapPoint | null> => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar pontos.");
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Geocode address to get lat/lng
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
      
      // If we don't have Supabase connection, simulate local addition
      if (!supabase) {
        console.warn('Supabase not configured, simulating point addition');
        // Generate a random ID
        const newId = Math.max(0, ...mapPoints.map(p => p.id)) + 1;
        const pointWithId: MapPoint = { ...completePoint, id: newId };
        
        // Add to local list
        const updatedPoints = [...mapPoints, pointWithId];
        setMapPoints(updatedPoints);
        
        // Save to localStorage
        localStorage.setItem('mapPoints', JSON.stringify(updatedPoints));
        
        toast.success("Ponto adicionado localmente!");
        return pointWithId;
      }
      
      // Insertion in Supabase
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
      
      // Transform the returned point to match our MapPoint format
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
      
      // Add the new point to the local list
      const updatedPoints = [...mapPoints, createdPoint];
      setMapPoints(updatedPoints);
      
      // Save to localStorage as backup
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

  // Load points when initializing the hook
  useEffect(() => {
    fetchMapPoints();
  }, []);

  return {
    mapPoints,
    addMapPoint,
    isLoading,
    error,
    refreshPoints: fetchMapPoints
  };
};
