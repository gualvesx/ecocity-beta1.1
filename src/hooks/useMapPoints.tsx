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
    type: "recycling",
    lat: -22.119511,
    lng: -51.392290,
    description: "Ponto de coleta de resíduos recicláveis e materiais volumosos.",
    impact: "Coleta aproximadamente 3 toneladas de materiais recicláveis por semana.",
    address: "Rua das Flores, 123 - Vila Furquim, Presidente Prudente - SP"
  },
  {
    id: 2,
    name: "Parque do Povo",
    type: "tree-planting",
    lat: -22.128580,
    lng: -51.388310,
    description: "Área verde com projetos de plantio de árvores nativas.",
    impact: "Mais de 150 árvores plantadas no último ano, contribuindo para a qualidade do ar.",
    address: "Av. 14 de Setembro - Vila Marcondes, Presidente Prudente - SP"
  },
  {
    id: 3,
    name: "Ecoponto Cambuci",
    type: "recycling",
    lat: -22.134160,
    lng: -51.401930,
    description: "Centro de coleta de materiais recicláveis, entulhos e volumosos.",
    impact: "Processamento de 2 toneladas de materiais por semana.",
    address: "Rua Cambuci, 456 - Jardim Paulista, Presidente Prudente - SP"
  },
  {
    id: 4,
    name: "Mutirão Córrego do Veado",
    type: "clean-up",
    lat: -22.121650,
    lng: -51.378750,
    description: "Área de limpeza regular do córrego e suas margens.",
    impact: "Remoção de mais de 300kg de resíduos mensais, protegendo o ecossistema aquático.",
    address: "Av. Washington Luiz - Parque Residencial Jequitibás, Presidente Prudente - SP"
  },
  {
    id: 5,
    name: "Ecoponto COHAB",
    type: "recycling",
    lat: -22.111234,
    lng: -51.413456,
    description: "Centro de coleta seletiva e descarte correto de resíduos.",
    impact: "Redução de 15% no lixo enviado ao aterro sanitário da região.",
    address: "Rua Paraná, 789 - COHAB, Presidente Prudente - SP"
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
        toast.warning("Using locally saved data due to a connection error.");
      } else {
        // If an error occurs, use example data
        setMapPoints(samplePoints);
        localStorage.setItem('mapPoints', JSON.stringify(samplePoints));
        toast.error("Error loading points from database. Using example data.");
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
      toast.error("You need to be logged in to add points.");
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Geocode address to get lat/lng
      const geoLocation = await geocodeAddress(newPoint.address);
      
      if (!geoLocation) {
        toast.error("Could not get coordinates for this address.");
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
        
        toast.success("Point added locally!");
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
      
      toast.success("Ecological point saved successfully!");
      
      return createdPoint;
    } catch (err) {
      console.error('Error adding point:', err);
      toast.error("Error saving the point to the database.");
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
