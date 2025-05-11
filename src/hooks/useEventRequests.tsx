
import { useState, useEffect, useCallback } from 'react';
import { 
  getAllEventRequests, 
  createEventRequest, 
  deleteEventRequest, 
  getMyEventRequests,
  approveEventRequest,
  rejectEventRequest,
  EventRequest
} from '@/services/firebaseEventRequests';
import { useAuth } from '@/contexts/AuthContext';
import { CreateEventRequestData } from '@/types/events';

export const useEventRequests = () => {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [myEventRequests, setMyEventRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch all event requests (admin only)
  const fetchAllEventRequests = useCallback(async () => {
    if (!user?.isAdmin) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const requests = await getAllEventRequests();
      setEventRequests(requests);
    } catch (err) {
      console.error('Error fetching event requests:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching event requests'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.isAdmin]);

  // Fetch current user's event requests
  const fetchMyEventRequests = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const requests = await getMyEventRequests();
      setMyEventRequests(requests);
    } catch (err) {
      console.error('Error fetching my event requests:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching my event requests'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create new event request
  const addEventRequest = async (newRequest: CreateEventRequestData) => {
    try {
      setIsLoading(true);
      setError(null);
      const createdRequest = await createEventRequest(newRequest);
      
      // Update local state
      setMyEventRequests(prev => [createdRequest, ...prev]);
      
      return createdRequest;
    } catch (err) {
      console.error('Error creating event request:', err);
      setError(err instanceof Error ? err : new Error('Unknown error creating event request'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete event request
  const removeEventRequest = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteEventRequest(id);
      
      // Update local state
      setEventRequests(prev => prev.filter(request => request.id !== id));
      setMyEventRequests(prev => prev.filter(request => request.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting event request:', err);
      setError(err instanceof Error ? err : new Error('Unknown error deleting event request'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Approve event request
  const approveRequest = async (id: string) => {
    if (!user?.isAdmin) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      const result = await approveEventRequest(id);
      
      // Update local state
      if (result) {
        // We don't remove it from the list, just update its status
        setEventRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: 'approved' as const } : req
        ));
      }
      
      return !!result;
    } catch (err) {
      console.error('Error approving event request:', err);
      setError(err instanceof Error ? err : new Error('Unknown error approving event request'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reject event request
  const rejectRequest = async (id: string) => {
    if (!user?.isAdmin) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      await rejectEventRequest(id);
      
      // Update local state
      setEventRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'rejected' as const } : req
      ));
      
      return true;
    } catch (err) {
      console.error('Error rejecting event request:', err);
      setError(err instanceof Error ? err : new Error('Unknown error rejecting event request'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount and when user changes
  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllEventRequests();
    }
    if (user) {
      fetchMyEventRequests();
    }
  }, [user, fetchAllEventRequests, fetchMyEventRequests]);

  return {
    eventRequests,
    myEventRequests,
    isLoading,
    error,
    addEventRequest,
    removeEventRequest,
    approveRequest,
    rejectRequest,
    refreshRequests: fetchAllEventRequests,
    refreshMyRequests: fetchMyEventRequests
  };
};
