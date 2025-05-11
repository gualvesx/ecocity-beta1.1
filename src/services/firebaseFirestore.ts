
import { 
  doc, collection, getDoc, getDocs, 
  addDoc, updateDoc, deleteDoc, 
  query, where, 
  CollectionReference, DocumentData,
  GeoPoint, Timestamp
} from "firebase/firestore";
import { firestore, USE_FIREBASE } from './firebaseConfig';
import { Event, EventRequest } from '@/hooks/useEventStore';
import { MapPoint } from '@/types/map';

// Local storage implementations for offline development
const localStorageDB = {
  collections: {
    mapPoints: JSON.parse(localStorage.getItem('localMapPoints') || '[]'),
    events: JSON.parse(localStorage.getItem('localEvents') || '[]'),
    eventRequests: JSON.parse(localStorage.getItem('localEventRequests') || '[]'),
  },
  
  saveCollection(name: string) {
    localStorage.setItem(`local${name.charAt(0).toUpperCase() + name.slice(1)}`, 
                        JSON.stringify(this.collections[name as keyof typeof this.collections]));
  },
  
  getNextId(collectionName: string): number {
    const collection = this.collections[collectionName as keyof typeof this.collections];
    return collection.length > 0 
      ? Math.max(...collection.map((item: any) => parseInt(item.id))) + 1 
      : 1;
  },
  
  addDoc(collectionName: string, data: any) {
    const id = this.getNextId(collectionName).toString();
    const newDoc = { ...data, id };
    this.collections[collectionName as keyof typeof this.collections].push(newDoc);
    this.saveCollection(collectionName);
    return newDoc;
  },
  
  updateDoc(collectionName: string, id: string, data: any) {
    const collection = this.collections[collectionName as keyof typeof this.collections];
    const index = collection.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      collection[index] = { ...collection[index], ...data };
      this.saveCollection(collectionName);
    }
  },
  
  deleteDoc(collectionName: string, id: string) {
    const collection = this.collections[collectionName as keyof typeof this.collections];
    const index = collection.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      collection.splice(index, 1);
      this.saveCollection(collectionName);
    }
  },
  
  getAll(collectionName: string) {
    return this.collections[collectionName as keyof typeof this.collections];
  },
  
  getById(collectionName: string, id: string) {
    const collection = this.collections[collectionName as keyof typeof this.collections];
    return collection.find((item: any) => item.id === id);
  }
};

// Convert MapPoint from Firestore to application MapPoint
const convertToMapPoint = (doc: any): MapPoint => {
  const data = doc.data ? doc.data() : doc;
  
  // Handle GeoPoint if using Firebase
  let lat = data.lat;
  let lng = data.lng;
  
  if (USE_FIREBASE && data.position instanceof GeoPoint) {
    lat = data.position.latitude;
    lng = data.position.longitude;
  }
  
  return {
    id: parseInt(doc.id || "0"),
    name: data.name,
    type: data.category || data.type,
    lat: lat,
    lng: lng,
    description: data.description,
    impact: data.impact || "",
    address: data.address || ''
  };
};

// Convert Event from Firestore to application Event
const convertToEvent = (doc: any): Event => {
  const data = doc.data ? doc.data() : doc;
  
  // Handle Timestamp if using Firebase
  let createdAt = data.createdAt;
  if (USE_FIREBASE && data.createdAt instanceof Timestamp) {
    createdAt = data.createdAt.toDate().toISOString();
  }
  
  // Handle GeoPoint if using Firebase
  let lat = data.lat;
  let lng = data.lng;
  
  if (USE_FIREBASE && data.position instanceof GeoPoint) {
    lat = data.position.latitude;
    lng = data.position.longitude;
  }
  
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    address: data.address,
    organizer: data.organizer,
    lat: lat,
    lng: lng,
    createdBy: data.createdBy || data.addedBy,
    createdAt: createdAt || new Date().toISOString()
  };
};

// Convert EventRequest from Firestore to application EventRequest
const convertToEventRequest = (doc: any): EventRequest => {
  const data = doc.data ? doc.data() : doc;
  
  // Handle Timestamp if using Firebase
  let createdAt = data.createdAt;
  if (USE_FIREBASE && data.createdAt instanceof Timestamp) {
    createdAt = data.createdAt.toDate().toISOString();
  }
  
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    address: data.address,
    organizer: data.organizer,
    createdBy: data.createdBy || data.addedBy,
    createdAt: createdAt || new Date().toISOString()
  };
};

// Service for interacting with Firestore
export const firebaseFirestore = {
  // Method for getting collection reference
  collection: <T = DocumentData>(collectionPath: string): CollectionReference<T, T> => {
    return collection(firestore, collectionPath) as CollectionReference<T, T>;
  },
  
  // Methods for events
  events: {
    // Get all events
    getAll: async (): Promise<Event[]> => {
      if (!USE_FIREBASE) {
        // Local implementation
        return localStorageDB.getAll('events').map(convertToEvent);
      }
      
      try {
        const eventsRef = collection(firestore, "events");
        const snapshot = await getDocs(eventsRef);
        return snapshot.docs.map(doc => convertToEvent({ id: doc.id, data: () => doc.data() }));
      } catch (error) {
        console.error("Error getting events:", error);
        throw error;
      }
    },
    
    // Get specific event by ID
    getById: async (id: string): Promise<Event | null> => {
      if (!USE_FIREBASE) {
        // Local implementation
        const event = localStorageDB.getById('events', id);
        return event ? convertToEvent(event) : null;
      }
      
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
    
    // Add new event
    add: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
      if (!USE_FIREBASE) {
        // Local implementation
        const newEvent = localStorageDB.addDoc('events', {
          ...eventData,
          createdAt: new Date().toISOString()
        });
        return convertToEvent(newEvent);
      }
      
      try {
        const eventsRef = collection(firestore, "events");
        
        // Convert to Firebase format
        const firestoreData = {
          ...eventData,
          position: new GeoPoint(eventData.lat, eventData.lng),
          createdAt: new Date()
        };
        
        const docRef = await addDoc(eventsRef, firestoreData);
        const eventDoc = await getDoc(docRef);
        return convertToEvent({ id: eventDoc.id, data: () => eventDoc.data() });
      } catch (error) {
        console.error("Error adding event:", error);
        throw error;
      }
    },
    
    // Update existing event
    update: async (id: string, eventData: Partial<Event>): Promise<void> => {
      if (!USE_FIREBASE) {
        // Local implementation
        localStorageDB.updateDoc('events', id, {
          ...eventData,
          updatedAt: new Date().toISOString()
        });
        return;
      }
      
      try {
        const eventRef = doc(firestore, "events", id);
        
        // Convert to Firebase format if lat/lng are present
        const firestoreData: any = { ...eventData };
        if (eventData.lat && eventData.lng) {
          firestoreData.position = new GeoPoint(eventData.lat, eventData.lng);
          delete firestoreData.lat;
          delete firestoreData.lng;
        }
        
        firestoreData.updatedAt = new Date();
        
        await updateDoc(eventRef, firestoreData);
      } catch (error) {
        console.error(`Error updating event ${id}:`, error);
        throw error;
      }
    },
    
    // Delete event
    delete: async (id: string): Promise<void> => {
      if (!USE_FIREBASE) {
        // Local implementation
        localStorageDB.deleteDoc('events', id);
        return;
      }
      
      try {
        const eventRef = doc(firestore, "events", id);
        await deleteDoc(eventRef);
      } catch (error) {
        console.error(`Error deleting event ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Methods for event requests
  eventRequests: {
    // Get all event requests
    getAll: async (): Promise<EventRequest[]> => {
      if (!USE_FIREBASE) {
        // Local implementation
        return localStorageDB.getAll('eventRequests').map(convertToEventRequest);
      }
      
      try {
        const requestsRef = collection(firestore, "eventRequests");
        const snapshot = await getDocs(requestsRef);
        return snapshot.docs.map(doc => convertToEventRequest({ id: doc.id, data: () => doc.data() }));
      } catch (error) {
        console.error("Error getting event requests:", error);
        throw error;
      }
    },
    
    // Add new event request
    add: async (requestData: Omit<EventRequest, 'id'>): Promise<EventRequest> => {
      if (!USE_FIREBASE) {
        // Local implementation
        const newRequest = localStorageDB.addDoc('eventRequests', {
          ...requestData,
          createdAt: new Date().toISOString()
        });
        return convertToEventRequest(newRequest);
      }
      
      try {
        const requestsRef = collection(firestore, "eventRequests");
        const docRef = await addDoc(requestsRef, {
          ...requestData,
          createdAt: new Date()
        });
        
        const requestDoc = await getDoc(docRef);
        return convertToEventRequest({ id: requestDoc.id, data: () => requestDoc.data() });
      } catch (error) {
        console.error("Error adding event request:", error);
        throw error;
      }
    },
    
    // Delete event request
    delete: async (id: string): Promise<void> => {
      if (!USE_FIREBASE) {
        // Local implementation
        localStorageDB.deleteDoc('eventRequests', id);
        return;
      }
      
      try {
        const requestRef = doc(firestore, "eventRequests", id);
        await deleteDoc(requestRef);
      } catch (error) {
        console.error(`Error deleting event request ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Methods for mapPoints
  mapPoints: {
    // Get all map points
    getAll: async (): Promise<MapPoint[]> => {
      if (!USE_FIREBASE) {
        // Local implementation
        return localStorageDB.getAll('mapPoints').map(convertToMapPoint);
      }
      
      try {
        const pointsRef = collection(firestore, "locations"); // Use locations collection as specified
        const snapshot = await getDocs(pointsRef);
        return snapshot.docs.map(doc => convertToMapPoint({ id: doc.id, data: () => doc.data() }));
      } catch (error) {
        console.error("Error getting map points:", error);
        throw error;
      }
    },
    
    // Add new map point
    add: async (pointData: Omit<MapPoint, 'id'>): Promise<MapPoint> => {
      if (!USE_FIREBASE) {
        // Local implementation
        const newPoint = localStorageDB.addDoc('mapPoints', {
          ...pointData,
          createdAt: new Date().toISOString()
        });
        return convertToMapPoint(newPoint);
      }
      
      try {
        const pointsRef = collection(firestore, "locations"); // Use locations collection as specified
        
        // Convert to Firebase format
        const firestoreData = {
          name: pointData.name,
          description: pointData.description,
          category: pointData.type,
          position: new GeoPoint(pointData.lat, pointData.lng),
          address: pointData.address || "",
          impact: pointData.impact || "",
          createdAt: new Date()
        };
        
        const docRef = await addDoc(pointsRef, firestoreData);
        return convertToMapPoint({ 
          id: docRef.id, 
          data: () => ({
            ...firestoreData,
            // Convert GeoPoint back for the return value
            lat: firestoreData.position.latitude,
            lng: firestoreData.position.longitude
          }) 
        });
      } catch (error) {
        console.error("Error adding map point:", error);
        throw error;
      }
    },
    
    // Delete map point
    delete: async (id: string): Promise<void> => {
      if (!USE_FIREBASE) {
        // Local implementation
        localStorageDB.deleteDoc('mapPoints', id);
        return;
      }
      
      try {
        const pointRef = doc(firestore, "locations", id.toString()); // Use locations collection as specified
        await deleteDoc(pointRef);
      } catch (error) {
        console.error(`Error deleting map point ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Utilities
  convertToEvent,
  convertToEventRequest,
  convertToMapPoint
};
