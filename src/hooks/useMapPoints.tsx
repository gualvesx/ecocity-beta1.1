
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MapPoint } from '@/components/EcoMap';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

// Configuração do cliente Supabase - vamos usar variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lygvpskjhiwgzsmqiojc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

// Criação do cliente Supabase (conditional)
const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Hook personalizado para gerenciar pontos do mapa
export const useMapPoints = () => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Função para carregar os pontos do mapa do Supabase ou localStorage
  const fetchMapPoints = async () => {
    try {
      setIsLoading(true);
      
      // Verificar se existem pontos salvos localmente
      const localPoints = localStorage.getItem('mapPoints');
      
      // Se não temos a conexão do Supabase, usamos dados locais ou de exemplo
      if (!supabase) {
        console.warn('Supabase não configurado, usando dados locais ou de exemplo');
        
        if (localPoints) {
          setMapPoints(JSON.parse(localPoints));
        } else {
          setMapPoints(samplePoints);
          localStorage.setItem('mapPoints', JSON.stringify(samplePoints));
        }
        
        setIsLoading(false);
        return;
      }
      
      // Consulta ao Supabase
      const { data, error } = await supabase
        .from('eco_points')
        .select('*');
      
      if (error) throw error;
      
      // Transformar os dados para corresponder ao nosso formato MapPoint
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
      
      // Salvar no localStorage como backup
      localStorage.setItem('mapPoints', JSON.stringify(formattedPoints));
    } catch (err) {
      console.error('Erro ao buscar pontos:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar pontos'));
      
      // Verificar se existem pontos salvos localmente
      const localPoints = localStorage.getItem('mapPoints');
      if (localPoints) {
        setMapPoints(JSON.parse(localPoints));
        toast.warning("Usando dados salvos localmente devido a um erro de conexão.");
      } else {
        // Se ocorrer um erro, usamos dados de exemplo
        setMapPoints(samplePoints);
        localStorage.setItem('mapPoints', JSON.stringify(samplePoints));
        toast.error("Erro ao carregar pontos do banco de dados. Usando dados de exemplo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para geocodificar um endereço (simulada)
  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    // Em uma implementação real, isso usaria uma API como Google Maps ou Mapbox
    // Por enquanto, retornamos uma localização aleatória próxima ao centro de Presidente Prudente
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular latência
    
    const baseLocation = {
      lat: -22.12,
      lng: -51.39
    };
    
    // Adicionar uma variação aleatória
    return {
      lat: baseLocation.lat + (Math.random() - 0.5) * 0.02,
      lng: baseLocation.lng + (Math.random() - 0.5) * 0.02
    };
  };

  // Função para adicionar um novo ponto ao mapa
  const addMapPoint = async (newPoint: Omit<MapPoint, 'id' | 'lat' | 'lng'> & { address: string }): Promise<MapPoint | null> => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar pontos.");
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Geocodificar o endereço para obter lat/lng
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
      
      // Se não temos a conexão do Supabase, simulamos uma adição local
      if (!supabase) {
        console.warn('Supabase não configurado, simulando adição de ponto');
        // Gerar um ID aleatório
        const newId = Math.max(0, ...mapPoints.map(p => p.id)) + 1;
        const pointWithId: MapPoint = { ...completePoint, id: newId };
        
        // Adicionar à lista local
        const updatedPoints = [...mapPoints, pointWithId];
        setMapPoints(updatedPoints);
        
        // Salvar no localStorage
        localStorage.setItem('mapPoints', JSON.stringify(updatedPoints));
        
        toast.success("Ponto adicionado localmente!");
        return pointWithId;
      }
      
      // Inserção no Supabase
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
      
      // Transformar o ponto retornado para corresponder ao nosso formato MapPoint
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
      
      // Adicionar o novo ponto à lista local
      const updatedPoints = [...mapPoints, createdPoint];
      setMapPoints(updatedPoints);
      
      // Salvar no localStorage como backup
      localStorage.setItem('mapPoints', JSON.stringify(updatedPoints));
      
      toast.success("Ponto ecológico salvo com sucesso!");
      
      return createdPoint;
    } catch (err) {
      console.error('Erro ao adicionar ponto:', err);
      toast.error("Erro ao salvar o ponto no banco de dados.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar pontos ao inicializar o hook
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
