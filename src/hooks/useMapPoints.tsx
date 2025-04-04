
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MapPoint } from '@/components/EcoMap';
import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase - vamos usar variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lygvpskjhiwgzsmqiojc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Criação do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey || '');

// Hook personalizado para gerenciar pontos do mapa
export const useMapPoints = () => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Função para carregar os pontos do mapa do Supabase
  const fetchMapPoints = async () => {
    try {
      setIsLoading(true);
      
      // Se não temos a chave do Supabase, usamos dados de exemplo
      if (!supabaseKey) {
        console.warn('Chave do Supabase não configurada, usando dados de exemplo');
        
        // Dados de exemplo para caso o Supabase não esteja configurado
        const samplePoints: MapPoint[] = [
          {
            id: 1,
            name: "Ecoponto Vila Furquim",
            type: "recycling",
            lat: -22.119511,
            lng: -51.392290,
            description: "Ponto de coleta de resíduos recicláveis e materiais volumosos.",
            impact: "Coleta aproximadamente 3 toneladas de materiais recicláveis por semana."
          },
          {
            id: 2,
            name: "Parque do Povo",
            type: "tree-planting",
            lat: -22.128580,
            lng: -51.388310,
            description: "Área verde com projetos de plantio de árvores nativas.",
            impact: "Mais de 150 árvores plantadas no último ano, contribuindo para a qualidade do ar."
          },
          {
            id: 3,
            name: "Ecoponto Cambuci",
            type: "recycling",
            lat: -22.134160,
            lng: -51.401930,
            description: "Centro de coleta de materiais recicláveis, entulhos e volumosos.",
            impact: "Processamento de 2 toneladas de materiais por semana."
          },
          {
            id: 4,
            name: "Mutirão Córrego do Veado",
            type: "clean-up",
            lat: -22.121650,
            lng: -51.378750,
            description: "Área de limpeza regular do córrego e suas margens.",
            impact: "Remoção de mais de 300kg de resíduos mensais, protegendo o ecossistema aquático."
          },
          {
            id: 5,
            name: "Ecoponto COHAB",
            type: "recycling",
            lat: -22.111234,
            lng: -51.413456,
            description: "Centro de coleta seletiva e descarte correto de resíduos.",
            impact: "Redução de 15% no lixo enviado ao aterro sanitário da região."
          },
        ];
        
        setMapPoints(samplePoints);
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
        impact: point.impact
      }));
      
      setMapPoints(formattedPoints);
    } catch (err) {
      console.error('Erro ao buscar pontos:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar pontos'));
      
      // Se ocorrer um erro, usamos dados de exemplo
      const samplePoints: MapPoint[] = [
        {
          id: 1,
          name: "Ecoponto Vila Furquim",
          type: "recycling",
          lat: -22.119511,
          lng: -51.392290,
          description: "Ponto de coleta de resíduos recicláveis e materiais volumosos.",
          impact: "Coleta aproximadamente 3 toneladas de materiais recicláveis por semana."
        },
        {
          id: 2,
          name: "Parque do Povo",
          type: "tree-planting",
          lat: -22.128580,
          lng: -51.388310,
          description: "Área verde com projetos de plantio de árvores nativas.",
          impact: "Mais de 150 árvores plantadas no último ano, contribuindo para a qualidade do ar."
        },
        {
          id: 3,
          name: "Ecoponto Cambuci",
          type: "recycling",
          lat: -22.134160,
          lng: -51.401930,
          description: "Centro de coleta de materiais recicláveis, entulhos e volumosos.",
          impact: "Processamento de 2 toneladas de materiais por semana."
        },
        {
          id: 4,
          name: "Mutirão Córrego do Veado",
          type: "clean-up",
          lat: -22.121650,
          lng: -51.378750,
          description: "Área de limpeza regular do córrego e suas margens.",
          impact: "Remoção de mais de 300kg de resíduos mensais, protegendo o ecossistema aquático."
        },
        {
          id: 5,
          name: "Ecoponto COHAB",
          type: "recycling",
          lat: -22.111234,
          lng: -51.413456,
          description: "Centro de coleta seletiva e descarte correto de resíduos.",
          impact: "Redução de 15% no lixo enviado ao aterro sanitário da região."
        },
      ];
      
      setMapPoints(samplePoints);
      toast.error("Erro ao carregar pontos do banco de dados. Usando dados de exemplo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para adicionar um novo ponto ao mapa
  const addMapPoint = async (newPoint: Omit<MapPoint, 'id'>) => {
    try {
      // Se não temos a chave do Supabase, simulamos uma adição
      if (!supabaseKey) {
        console.warn('Chave do Supabase não configurada, simulando adição de ponto');
        // Gerar um ID aleatório
        const newId = Math.max(0, ...mapPoints.map(p => p.id)) + 1;
        const pointWithId: MapPoint = { ...newPoint, id: newId };
        
        // Adicionar à lista local
        setMapPoints([...mapPoints, pointWithId]);
        return pointWithId;
      }
      
      // Inserção no Supabase
      const { data, error } = await supabase
        .from('eco_points')
        .insert([
          {
            name: newPoint.name,
            type: newPoint.type,
            latitude: newPoint.lat,
            longitude: newPoint.lng,
            description: newPoint.description,
            impact: newPoint.impact
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
        impact: data[0].impact
      };
      
      // Adicionar o novo ponto à lista local
      setMapPoints([...mapPoints, createdPoint]);
      
      return createdPoint;
    } catch (err) {
      console.error('Erro ao adicionar ponto:', err);
      // Se for um erro de chave não configurada, não mostramos o toast, pois já tratamos acima
      if (supabaseKey) {
        toast.error("Erro ao salvar o ponto no banco de dados.");
      }
      throw err;
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
