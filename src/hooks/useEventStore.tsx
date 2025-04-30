
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { geocodeAddress } from '@/services/geocoding';
import { firebaseFirestore } from '@/services/firebaseFirestore';

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

export function useEventStore() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch events on initialization
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const snapshot = await firebaseFirestore.collection<any>('events').get();
        const eventsData = snapshot.docs.map(doc => 
          firebaseFirestore.convertToEvent(doc.data())
        );
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error("Erro ao carregar eventos");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Fetch event requests (admin only)
  const fetchEventRequests = useCallback(async () => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem acessar solicitações de eventos");
      return;
    }
    
    setIsLoading(true);
    try {
      const snapshot = await firebaseFirestore.collection<any>('eventRequests').get();
      const requestsData = snapshot.docs.map(doc => 
        firebaseFirestore.convertToEventRequest(doc.data())
      );
      setEventRequests(requestsData);
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
      
      const docRef = await firebaseFirestore.collection<any>('events').add({
        ...eventData,
        lat: coordinates.lat,
        lng: coordinates.lng
      });
      
      const newEventSnap = await docRef.get();
      if (newEventSnap.exists) {
        const newEvent = firebaseFirestore.convertToEvent(newEventSnap.data());
        setEvents(prev => [...prev, newEvent]);
        return newEvent;
      }
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error("Erro ao adicionar evento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.isAdmin]);
  
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
      
      // Update the event in Firestore
      await firebaseFirestore.collection<any>('events').doc(eventId).update({
        ...eventData,
        lat: coordinates.lat,
        lng: coordinates.lng
      });
      
      // Get the updated event
      const updatedEventSnap = await firebaseFirestore.collection<any>('events').doc(eventId).get();
      if (updatedEventSnap.exists) {
        const updatedEvent = firebaseFirestore.convertToEvent(updatedEventSnap.data());
        
        // Update local state
        setEvents(prev => prev.map(event => 
          event.id === eventId ? updatedEvent : event
        ));
        
        return updatedEvent;
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error("Erro ao atualizar evento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.isAdmin]);
  
  // Delete an event (admin only)
  const deleteEvent = useCallback(async (eventId: string) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem excluir eventos");
      return;
    }
    
    try {
      await firebaseFirestore.collection<any>('events').doc(eventId).delete();
      setEvents(prev => prev.filter(event => event.id !== eventId));
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("Erro ao excluir evento");
      return false;
    }
  }, [user?.isAdmin]);
  
  // Add event request (any user)
  const addEventRequest = useCallback(async (requestData: Omit<EventRequest, 'id'>) => {
    setIsLoading(true);
    try {
      const docRef = await firebaseFirestore.collection<any>('eventRequests').add(requestData);
      
      const newRequestSnap = await docRef.get();
      if (newRequestSnap.exists) {
        const newRequest = firebaseFirestore.convertToEventRequest(newRequestSnap.data());
        setEventRequests(prev => [...prev, newRequest]);
        return newRequest;
      }
    } catch (error) {
      console.error('Error adding event request:', error);
      toast.error("Erro ao enviar solicitação de evento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Approve event request (admin only)
  const approveEventRequest = useCallback(async (requestId: string) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem aprovar solicitações");
      return;
    }
    
    setIsLoading(true);
    try {
      // Get the request
      const requestSnap = await firebaseFirestore.collection<any>('eventRequests').doc(requestId).get();
      if (!requestSnap.exists) {
        toast.error("Solicitação não encontrada");
        return;
      }
      
      const request = requestSnap.data();
      
      // Geocode the address to get coordinates
      const coordinates = await geocodeAddress(request.address);
      if (!coordinates) {
        toast.error("Não foi possível encontrar as coordenadas do endereço fornecido");
        return;
      }
      
      // Create new event from the request
      const eventDocRef = await firebaseFirestore.collection<any>('events').add({
        title: request.title,
        description: request.description,
        date: request.date,
        time: request.time,
        address: request.address,
        organizer: request.organizer,
        lat: coordinates.lat,
        lng: coordinates.lng,
        createdBy: request.createdBy
      });
      
      // Get the new event
      const newEventSnap = await eventDocRef.get();
      if (newEventSnap.exists) {
        const newEvent = firebaseFirestore.convertToEvent(newEventSnap.data());
        setEvents(prev => [...prev, newEvent]);
        
        // Delete the request
        await firebaseFirestore.collection<any>('eventRequests').doc(requestId).delete();
        setEventRequests(prev => prev.filter(req => req.id !== requestId));
        
        return newEvent;
      }
    } catch (error) {
      console.error('Error approving event request:', error);
      toast.error("Erro ao aprovar solicitação");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.isAdmin]);
  
  // Reject event request (admin only)
  const rejectEventRequest = useCallback(async (requestId: string) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem rejeitar solicitações");
      return;
    }
    
    try {
      await firebaseFirestore.collection<any>('eventRequests').doc(requestId).delete();
      setEventRequests(prev => prev.filter(req => req.id !== requestId));
      return true;
    } catch (error) {
      console.error('Error rejecting event request:', error);
      toast.error("Erro ao rejeitar solicitação");
      return false;
    }
  }, [user?.isAdmin]);
  
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
