
import { Event, EventRequest } from '@/hooks/useEventStore';
import { MapPoint } from '@/types/map';
import { User } from '@/contexts/AuthContext';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firestore, auth } from './firebaseConfig';
import { firebaseAuth } from './firebaseAuth';

// API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Collection references
const eventsCollection = collection(firestore, 'events');
const eventRequestsCollection = collection(firestore, 'eventRequests');
const locationsCollection = collection(firestore, 'locations');

// Event APIs
export const eventApi = {
  getAllEvents: async (): Promise<ApiResponse<Event[]>> => {
    try {
      const snapshot = await getDocs(eventsCollection);
      
      if (snapshot.empty) {
        return { success: true, data: [] };
      }
      
      const events = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          date: data.date ? new Date(data.date.toDate()) : new Date(),
          location: data.location || "",
          organizer: data.organizer || "",
          category: data.category || "other",
          imageUrl: data.imageUrl || "",
          position: data.position || { latitude: 0, longitude: 0 }
        } as Event;
      });
      
      return { success: true, data: events };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, error: 'Failed to fetch events' };
    }
  },
  
  getEventById: async (id: string): Promise<ApiResponse<Event>> => {
    try {
      const docRef = doc(eventsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Event not found' };
      }
      
      const data = docSnap.data();
      const event = {
        id: docSnap.id,
        title: data.title || "",
        description: data.description || "",
        date: data.date ? new Date(data.date.toDate()) : new Date(),
        location: data.location || "",
        organizer: data.organizer || "",
        category: data.category || "other",
        imageUrl: data.imageUrl || "",
        position: data.position || { latitude: 0, longitude: 0 }
      } as Event;
      
      return { success: true, data: event };
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      return { success: false, error: 'Failed to fetch event' };
    }
  },
  
  addEvent: async (eventData: Omit<Event, 'id'>): Promise<ApiResponse<Event>> => {
    try {
      const docRef = await addDoc(eventsCollection, {
        ...eventData,
        date: new Date(eventData.date)
      });
      
      const newEvent = {
        ...eventData,
        id: docRef.id
      };
      
      return { success: true, data: newEvent };
    } catch (error) {
      console.error('Error adding event:', error);
      return { success: false, error: 'Failed to add event' };
    }
  },
  
  updateEvent: async (id: string, eventData: Partial<Event>): Promise<ApiResponse<void>> => {
    try {
      const docRef = doc(eventsCollection, id);
      
      // If date is included, convert it to Firestore timestamp
      const dataToUpdate = { ...eventData };
      if (eventData.date) {
        dataToUpdate.date = new Date(eventData.date);
      }
      
      await updateDoc(docRef, dataToUpdate);
      return { success: true };
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      return { success: false, error: 'Failed to update event' };
    }
  },
  
  deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await deleteDoc(doc(eventsCollection, id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      return { success: false, error: 'Failed to delete event' };
    }
  },
  
  // Event requests
  getEventRequests: async (): Promise<ApiResponse<EventRequest[]>> => {
    try {
      const snapshot = await getDocs(eventRequestsCollection);
      
      if (snapshot.empty) {
        return { success: true, data: [] };
      }
      
      const requests = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          proposedDate: data.proposedDate ? new Date(data.proposedDate.toDate()) : new Date(),
          location: data.location || "",
          requesterName: data.requesterName || "",
          requesterEmail: data.requesterEmail || "",
          status: data.status || "pending",
          category: data.category || "other",
        } as EventRequest;
      });
      
      return { success: true, data: requests };
    } catch (error) {
      console.error('Error fetching event requests:', error);
      return { success: false, error: 'Failed to fetch event requests' };
    }
  },
  
  addEventRequest: async (requestData: Omit<EventRequest, 'id'>): Promise<ApiResponse<EventRequest>> => {
    try {
      const docRef = await addDoc(eventRequestsCollection, {
        ...requestData,
        proposedDate: new Date(requestData.proposedDate),
        status: "pending" // Always start with pending status
      });
      
      const newRequest = {
        ...requestData,
        id: docRef.id
      };
      
      return { success: true, data: newRequest };
    } catch (error) {
      console.error('Error adding event request:', error);
      return { success: false, error: 'Failed to add event request' };
    }
  },
  
  deleteEventRequest: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await deleteDoc(doc(eventRequestsCollection, id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting event request ${id}:`, error);
      return { success: false, error: 'Failed to delete event request' };
    }
  }
};

// Map point APIs
export const mapApi = {
  getAllPoints: async (): Promise<ApiResponse<MapPoint[]>> => {
    try {
      const snapshot = await getDocs(locationsCollection);
      
      if (snapshot.empty) {
        return { success: true, data: [] };
      }
      
      const points = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          description: data.description || "",
          category: data.category || "other",
          position: {
            latitude: data.position?.latitude || 0,
            longitude: data.position?.longitude || 0
          },
          createdAt: data.createdAt ? new Date(data.createdAt.toDate()) : new Date(),
          addedBy: data.addedBy || ""
        } as MapPoint;
      });
      
      return { success: true, data: points };
    } catch (error) {
      console.error('Error fetching map points:', error);
      return { success: false, error: 'Failed to fetch map points' };
    }
  },
  
  addPoint: async (pointData: Omit<MapPoint, 'id'>): Promise<ApiResponse<MapPoint>> => {
    try {
      const docRef = await addDoc(locationsCollection, {
        name: pointData.name,
        description: pointData.description,
        category: pointData.category,
        position: {
          latitude: pointData.position.latitude,
          longitude: pointData.position.longitude
        },
        addedBy: pointData.addedBy || "",
        createdAt: new Date()
      });
      
      const newPoint = {
        ...pointData,
        id: docRef.id
      };
      
      return { success: true, data: newPoint };
    } catch (error) {
      console.error('Error adding map point:', error);
      return { success: false, error: 'Failed to add map point' };
    }
  },
  
  deletePoint: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await deleteDoc(doc(locationsCollection, id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting map point ${id}:`, error);
      return { success: false, error: 'Failed to delete map point' };
    }
  }
};

// User APIs
export const userApi = {
  register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      const { user } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
      const contextUser = await firebaseAuth.convertToContextUser(user);
      return { success: true, data: contextUser! };
    } catch (error: any) {
      console.error('Error registering user:', error);
      return { success: false, error: error.message || 'Failed to register user' };
    }
  },
  
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      const { user } = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const contextUser = await firebaseAuth.convertToContextUser(user);
      return { success: true, data: contextUser! };
    } catch (error: any) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message || 'Failed to login' };
    }
  },
  
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      await firebaseAuth.signOut();
      return { success: true };
    } catch (error: any) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message || 'Failed to logout' };
    }
  },
  
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const users = await firebaseAuth.getAllUsers();
      return { success: true, data: users };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return { success: false, error: error.message || 'Failed to fetch users' };
    }
  },
  
  updateUserAdmin: async (userId: string, isAdmin: boolean): Promise<ApiResponse<void>> => {
    try {
      await firebaseAuth.updateUserAdmin(userId, isAdmin);
      return { success: true };
    } catch (error: any) {
      console.error(`Error updating user ${userId} admin status:`, error);
      return { success: false, error: error.message || 'Failed to update user admin status' };
    }
  }
};

// Create a service for map storage
export const mapStorage = {
  getStoredPoints: async (): Promise<MapPoint[]> => {
    const response = await mapApi.getAllPoints();
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  },
  
  savePoint: async (pointData: Omit<MapPoint, 'id'>): Promise<MapPoint> => {
    const response = await mapApi.addPoint(pointData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to save map point');
  },
  
  deletePoint: async (pointId: string): Promise<void> => {
    const response = await mapApi.deletePoint(pointId);
    if (!response.success) {
      throw new Error('Failed to delete map point');
    }
  }
};
