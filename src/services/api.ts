
import { firebaseFirestore } from './firebaseFirestore';
import { firebaseAuth } from './firebaseAuth';
import { Event, EventRequest } from '@/hooks/useEventStore';
import { MapPoint } from '@/types/map';
import { User } from '@/contexts/AuthContext';

// API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Event APIs
export const eventApi = {
  getAllEvents: async (): Promise<ApiResponse<Event[]>> => {
    try {
      const events = await firebaseFirestore.events.getAll();
      return { success: true, data: events };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, error: 'Failed to fetch events' };
    }
  },
  
  getEventById: async (id: string): Promise<ApiResponse<Event>> => {
    try {
      const event = await firebaseFirestore.events.getById(id);
      if (!event) {
        return { success: false, error: 'Event not found' };
      }
      return { success: true, data: event };
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      return { success: false, error: 'Failed to fetch event' };
    }
  },
  
  addEvent: async (eventData: Omit<Event, 'id'>): Promise<ApiResponse<Event>> => {
    try {
      const event = await firebaseFirestore.events.add(eventData);
      return { success: true, data: event };
    } catch (error) {
      console.error('Error adding event:', error);
      return { success: false, error: 'Failed to add event' };
    }
  },
  
  updateEvent: async (id: string, eventData: Partial<Event>): Promise<ApiResponse<void>> => {
    try {
      await firebaseFirestore.events.update(id, eventData);
      return { success: true };
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      return { success: false, error: 'Failed to update event' };
    }
  },
  
  deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await firebaseFirestore.events.delete(id);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      return { success: false, error: 'Failed to delete event' };
    }
  },
  
  // Event requests
  getEventRequests: async (): Promise<ApiResponse<EventRequest[]>> => {
    try {
      const requests = await firebaseFirestore.eventRequests.getAll();
      return { success: true, data: requests };
    } catch (error) {
      console.error('Error fetching event requests:', error);
      return { success: false, error: 'Failed to fetch event requests' };
    }
  },
  
  addEventRequest: async (requestData: Omit<EventRequest, 'id'>): Promise<ApiResponse<EventRequest>> => {
    try {
      const request = await firebaseFirestore.eventRequests.add(requestData);
      return { success: true, data: request };
    } catch (error) {
      console.error('Error adding event request:', error);
      return { success: false, error: 'Failed to add event request' };
    }
  },
  
  deleteEventRequest: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await firebaseFirestore.eventRequests.delete(id);
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
      const points = await firebaseFirestore.mapPoints.getAll();
      return { success: true, data: points };
    } catch (error) {
      console.error('Error fetching map points:', error);
      return { success: false, error: 'Failed to fetch map points' };
    }
  },
  
  addPoint: async (pointData: Omit<MapPoint, 'id'>): Promise<ApiResponse<MapPoint>> => {
    try {
      const point = await firebaseFirestore.mapPoints.add(pointData);
      return { success: true, data: point };
    } catch (error) {
      console.error('Error adding map point:', error);
      return { success: false, error: 'Failed to add map point' };
    }
  },
  
  deletePoint: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await firebaseFirestore.mapPoints.delete(id);
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
    return await firebaseFirestore.mapPoints.getAll();
  },
  
  savePoint: async (pointData: Omit<MapPoint, 'id'>): Promise<MapPoint> => {
    return await firebaseFirestore.mapPoints.add(pointData);
  },
  
  deletePoint: async (pointId: string): Promise<void> => {
    return await firebaseFirestore.mapPoints.delete(pointId);
  }
};
