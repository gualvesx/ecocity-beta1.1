
import { doc, collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { firestore } from './firebaseConfig';
import { Event, EventRequest } from '@/hooks/useEventStore';
import { MapPoint } from '@/types/map';

// Converter MapPoint do Firestore para o tipo MapPoint da aplicação
const convertToMapPoint = (doc: any): MapPoint => {
  const data = doc.data();
  return {
    id: parseInt(doc.id),  // Converte para número para compatibilidade
    name: data.name,
    type: data.type,
    lat: data.lat,
    lng: data.lng,
    description: data.description,
    impact: data.impact,
    address: data.address
  };
};

// Converter Event do Firestore para o tipo Event da aplicação
const convertToEvent = (doc: any): Event => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    address: data.address,
    organizer: data.organizer,
    lat: data.lat,
    lng: data.lng,
    createdBy: data.createdBy,
    createdAt: data.createdAt || new Date().toISOString()
  };
};

// Converter EventRequest do Firestore para o tipo EventRequest da aplicação
const convertToEventRequest = (doc: any): EventRequest => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    address: data.address,
    organizer: data.organizer,
    createdBy: data.createdBy,
    createdAt: data.createdAt || new Date().toISOString()
  };
};

// Serviço para interagir com o Firestore
export const firebaseFirestore = {
  // Métodos para eventos
  events: {
    // Obter todos os eventos
    getAll: async (): Promise<Event[]> => {
      try {
        const eventsRef = collection(firestore, "events");
        const snapshot = await getDocs(eventsRef);
        return snapshot.docs.map(doc => convertToEvent({ id: doc.id, ...doc }));
      } catch (error) {
        console.error("Error getting events:", error);
        throw error;
      }
    },
    
    // Obter um evento específico por ID
    getById: async (id: string): Promise<Event | null> => {
      try {
        const eventRef = doc(firestore, "events", id);
        const eventDoc = await getDoc(eventRef);
        
        if (!eventDoc.exists()) {
          return null;
        }
        
        return convertToEvent({ id: eventDoc.id, data: () => eventDoc.data() });
      } catch (error) {
        console.error(`Error getting event ${id}:`, error);
        throw error;
      }
    },
    
    // Adicionar um novo evento
    add: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
      try {
        const eventsRef = collection(firestore, "events");
        const docRef = await addDoc(eventsRef, {
          ...eventData,
          createdAt: new Date().toISOString()
        });
        
        const eventDoc = await getDoc(docRef);
        return convertToEvent({ id: eventDoc.id, data: () => eventDoc.data() });
      } catch (error) {
        console.error("Error adding event:", error);
        throw error;
      }
    },
    
    // Atualizar um evento existente
    update: async (id: string, eventData: Partial<Event>): Promise<void> => {
      try {
        const eventRef = doc(firestore, "events", id);
        await updateDoc(eventRef, {
          ...eventData,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error updating event ${id}:`, error);
        throw error;
      }
    },
    
    // Excluir um evento
    delete: async (id: string): Promise<void> => {
      try {
        const eventRef = doc(firestore, "events", id);
        await deleteDoc(eventRef);
      } catch (error) {
        console.error(`Error deleting event ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Métodos para solicitações de eventos
  eventRequests: {
    // Obter todas as solicitações de eventos
    getAll: async (): Promise<EventRequest[]> => {
      try {
        const requestsRef = collection(firestore, "eventRequests");
        const snapshot = await getDocs(requestsRef);
        return snapshot.docs.map(doc => convertToEventRequest({ id: doc.id, ...doc }));
      } catch (error) {
        console.error("Error getting event requests:", error);
        throw error;
      }
    },
    
    // Adicionar uma nova solicitação de evento
    add: async (requestData: Omit<EventRequest, 'id'>): Promise<EventRequest> => {
      try {
        const requestsRef = collection(firestore, "eventRequests");
        const docRef = await addDoc(requestsRef, {
          ...requestData,
          createdAt: new Date().toISOString()
        });
        
        const requestDoc = await getDoc(docRef);
        return convertToEventRequest({ id: requestDoc.id, data: () => requestDoc.data() });
      } catch (error) {
        console.error("Error adding event request:", error);
        throw error;
      }
    },
    
    // Excluir uma solicitação de evento
    delete: async (id: string): Promise<void> => {
      try {
        const requestRef = doc(firestore, "eventRequests", id);
        await deleteDoc(requestRef);
      } catch (error) {
        console.error(`Error deleting event request ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Utilitários
  convertToEvent,
  convertToEventRequest,
  convertToMapPoint
};
