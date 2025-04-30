
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { geocodeAddress } from '@/services/geocoding';

// Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  organizer: string;
  lat: number;
  lng: number;
  createdBy: string;
  createdAt: string;
}

export interface EventRequest {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  organizer: string;
  createdBy: string;
  createdAt: string;
}

// Sample data for events
const sampleEvents = [
  {
    id: '1',
    title: 'Plantio de Árvores no Parque Ecológico',
    description: 'Venha participar do nosso evento de plantio de árvores no Parque Ecológico da cidade. Traga sua família e amigos para esta importante ação ambiental.',
    date: '2025-05-15',
    time: '09:00',
    address: 'Parque Ecológico, Avenida Brasil, 1000',
    organizer: 'Associação Ambiental Verde Vivo',
    lat: -22.125092,
    lng: -51.379639,
    createdBy: 'admin',
    createdAt: '2025-04-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Palestra sobre Sustentabilidade',
    description: 'Palestra com especialistas sobre práticas sustentáveis que podemos implementar em nosso dia a dia.',
    date: '2025-05-20',
    time: '19:00',
    address: 'Auditório da Universidade FCT Unesp',
    organizer: 'Grupo Acadêmico de Ecologia',
    lat: -22.120092,
    lng: -51.409639,
    createdBy: 'admin',
    createdAt: '2025-04-05T14:30:00Z'
  }
];

export function useEventStore() {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Fetch events from localStorage on initialization
  useCallback(() => {
    const storedEvents = localStorage.getItem('ecoEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    
    const storedRequests = localStorage.getItem('ecoEventRequests');
    if (storedRequests) {
      setEventRequests(JSON.parse(storedRequests));
    }
  }, []);
  
  // Fetch event requests (admin only)
  const fetchEventRequests = useCallback(async () => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem acessar solicitações de eventos");
      return;
    }
    
    setIsLoading(true);
    try {
      const storedRequests = localStorage.getItem('ecoEventRequests');
      if (storedRequests) {
        setEventRequests(JSON.parse(storedRequests));
      }
    } catch (error) {
      console.error('Error fetching event requests:', error);
      toast.error("Erro ao carregar solicitações de eventos");
    } finally {
      setIsLoading(false);
    }
  }, [user?.isAdmin]);
  
  // Add a new event (admin only)
  const addEvent = useCallback(async (eventData: Omit<Event, 'id' | 'lat' | 'lng'>) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem adicionar eventos");
      return;
    }
    
    setIsLoading(true);
    try {
      // Geocode the address to get coordinates
      const coordinates = await geocodeAddress(eventData.address);
      if (!coordinates) {
        toast.error("Não foi possível encontrar as coordenadas do endereço fornecido");
        return;
      }
      
      const newEvent: Event = {
        ...eventData,
        id: `event_${Date.now()}`,
        lat: coordinates.lat,
        lng: coordinates.lng,
      };
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('ecoEvents', JSON.stringify(updatedEvents));
      
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error("Erro ao adicionar evento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [events, user?.isAdmin]);
  
  // Update an existing event (admin only)
  const updateEvent = useCallback(async (eventId: string, eventData: Omit<Event, 'id' | 'lat' | 'lng'>) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem atualizar eventos");
      return;
    }
    
    setIsLoading(true);
    try {
      // Geocode the address to get coordinates
      const coordinates = await geocodeAddress(eventData.address);
      if (!coordinates) {
        toast.error("Não foi possível encontrar as coordenadas do endereço fornecido");
        return;
      }
      
      const updatedEvents = events.map(event => 
        event.id === eventId 
          ? { ...event, ...eventData, lat: coordinates.lat, lng: coordinates.lng }
          : event
      );
      
      setEvents(updatedEvents);
      localStorage.setItem('ecoEvents', JSON.stringify(updatedEvents));
      
      return updatedEvents.find(e => e.id === eventId);
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error("Erro ao atualizar evento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [events, user?.isAdmin]);
  
  // Delete an event (admin only)
  const deleteEvent = useCallback(async (eventId: string) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem excluir eventos");
      return;
    }
    
    try {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem('ecoEvents', JSON.stringify(updatedEvents));
      
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("Erro ao excluir evento");
      return false;
    }
  }, [events, user?.isAdmin]);
  
  // Add event request (any user)
  const addEventRequest = useCallback(async (requestData: Omit<EventRequest, 'id'>) => {
    setIsLoading(true);
    try {
      const newRequest: EventRequest = {
        ...requestData,
        id: `request_${Date.now()}`
      };
      
      const updatedRequests = [...eventRequests, newRequest];
      setEventRequests(updatedRequests);
      localStorage.setItem('ecoEventRequests', JSON.stringify(updatedRequests));
      
      return newRequest;
    } catch (error) {
      console.error('Error adding event request:', error);
      toast.error("Erro ao enviar solicitação de evento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [eventRequests]);
  
  // Approve event request (admin only)
  const approveEventRequest = useCallback(async (requestId: string) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem aprovar solicitações");
      return;
    }
    
    setIsLoading(true);
    try {
      const request = eventRequests.find(req => req.id === requestId);
      if (!request) {
        toast.error("Solicitação não encontrada");
        return;
      }
      
      // Geocode the address to get coordinates
      const coordinates = await geocodeAddress(request.address);
      if (!coordinates) {
        toast.error("Não foi possível encontrar as coordenadas do endereço fornecido");
        return;
      }
      
      // Create new event from the request
      const newEvent: Event = {
        ...request,
        id: `event_${Date.now()}`,
        lat: coordinates.lat,
        lng: coordinates.lng,
      };
      
      // Add the new event
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('ecoEvents', JSON.stringify(updatedEvents));
      
      // Remove the request
      const updatedRequests = eventRequests.filter(req => req.id !== requestId);
      setEventRequests(updatedRequests);
      localStorage.setItem('ecoEventRequests', JSON.stringify(updatedRequests));
      
      return newEvent;
    } catch (error) {
      console.error('Error approving event request:', error);
      toast.error("Erro ao aprovar solicitação");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [events, eventRequests, user?.isAdmin]);
  
  // Reject event request (admin only)
  const rejectEventRequest = useCallback(async (requestId: string) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem rejeitar solicitações");
      return;
    }
    
    try {
      const updatedRequests = eventRequests.filter(req => req.id !== requestId);
      setEventRequests(updatedRequests);
      localStorage.setItem('ecoEventRequests', JSON.stringify(updatedRequests));
      
      return true;
    } catch (error) {
      console.error('Error rejecting event request:', error);
      toast.error("Erro ao rejeitar solicitação");
      return false;
    }
  }, [eventRequests, user?.isAdmin]);
  
  return {
    events,
    eventRequests,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    addEventRequest,
    fetchEventRequests,
    approveEventRequest,
    rejectEventRequest
  };
}
