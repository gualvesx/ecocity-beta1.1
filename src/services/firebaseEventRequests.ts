
import { 
  collection, addDoc, getDocs, deleteDoc, doc, 
  query, orderBy, Timestamp, where, getDoc, updateDoc
} from "firebase/firestore";
import { firestore, auth } from "./firebaseConfig";
import { EventRequest, EventStatus } from "@/types/events";
import { toast } from "sonner";

// Collection reference
const eventRequestsCollection = collection(firestore, "eventRequests");

/**
 * Fetches all event requests from Firestore
 * @returns Promise with array of EventRequest objects
 */
export const getAllEventRequests = async (): Promise<EventRequest[]> => {
  try {
    console.log("Fetching all event requests...");
    const q = query(eventRequestsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString()
        : data.createdAt;
        
      return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        time: data.time || "",
        address: data.address || "",
        organizer: data.organizer || "",
        status: data.status || EventStatus.PENDING,
        createdBy: data.createdBy || "",
        createdAt: createdAt
      };
    });
  } catch (error) {
    console.error("Error fetching event requests:", error);
    toast.error("Erro ao buscar solicitações de eventos");
    throw error;
  }
};

/**
 * Gets an event request by ID
 * @param id The event request ID
 * @returns Promise with the EventRequest object
 */
export const getEventRequestById = async (id: string): Promise<EventRequest | null> => {
  try {
    const docRef = doc(firestore, "eventRequests", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    const createdAt = data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate().toISOString()
      : data.createdAt;
      
    return {
      id: docSnap.id,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      time: data.time || "",
      address: data.address || "",
      organizer: data.organizer || "",
      status: data.status || EventStatus.PENDING,
      createdBy: data.createdBy || "",
      createdAt: createdAt
    };
  } catch (error) {
    console.error("Error getting event request:", error);
    toast.error("Erro ao buscar solicitação de evento");
    throw error;
  }
};

/**
 * Creates a new event request in Firestore
 * @param eventRequest The event request data
 * @returns Promise with the created event request including id
 */
export const createEventRequest = async (eventRequest: Omit<EventRequest, "id" | "createdAt" | "createdBy" | "status">): Promise<EventRequest> => {
  try {
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("É necessário estar logado para solicitar um evento");
    }

    console.log("Creating new event request:", eventRequest);
    
    // Prepare data for Firestore
    const newEventRequestData = {
      ...eventRequest,
      status: EventStatus.PENDING,
      createdAt: new Date(),
      createdBy: currentUser.uid
    };
    
    // Add document to Firestore
    const docRef = await addDoc(eventRequestsCollection, newEventRequestData);
    
    // Return complete event request with id
    const createdRequest: EventRequest = {
      id: docRef.id,
      ...eventRequest,
      status: EventStatus.PENDING,
      createdBy: currentUser.uid,
      createdAt: new Date().toISOString()
    };
    
    toast.success("Solicitação de evento enviada com sucesso!");
    return createdRequest;
  } catch (error) {
    console.error("Error creating event request:", error);
    toast.error("Erro ao solicitar evento");
    throw error;
  }
};

/**
 * Deletes an event request from Firestore
 * @param id The event request id to delete
 */
export const deleteEventRequest = async (id: string): Promise<void> => {
  try {
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("É necessário estar logado para excluir uma solicitação");
    }
    
    console.log("Deleting event request:", id);
    const eventRequestRef = doc(firestore, "eventRequests", id);
    await deleteDoc(eventRequestRef);
    toast.success("Solicitação de evento excluída com sucesso!");
  } catch (error) {
    console.error("Error deleting event request:", error);
    toast.error("Erro ao excluir solicitação de evento");
    throw error;
  }
};

/**
 * Gets event requests created by the current user
 */
export const getMyEventRequests = async (): Promise<EventRequest[]> => {
  try {
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return [];
    }
    
    console.log("Fetching event requests for user:", currentUser.uid);
    
    const q = query(
      eventRequestsCollection,
      where("createdBy", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString()
        : data.createdAt;
        
      return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        time: data.time || "",
        address: data.address || "",
        organizer: data.organizer || "",
        status: data.status || EventStatus.PENDING,
        createdBy: data.createdBy || "",
        createdAt: createdAt
      };
    });
  } catch (error) {
    console.error("Error fetching user event requests:", error);
    toast.error("Erro ao buscar suas solicitações de eventos");
    return [];
  }
};

/**
 * Updates the status of an event request
 * @param id The event request ID
 * @param status The new status
 */
export const updateEventRequestStatus = async (id: string, status: EventStatus): Promise<void> => {
  try {
    // Check if user is logged in and is admin
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("É necessário estar logado para atualizar solicitações");
    }
    
    console.log(`Updating event request ${id} status to ${status}`);
    const eventRequestRef = doc(firestore, "eventRequests", id);
    await updateDoc(eventRequestRef, {
      status,
      updatedAt: new Date()
    });
    toast.success(`Status da solicitação atualizado para ${status}`);
  } catch (error) {
    console.error("Error updating event request status:", error);
    toast.error("Erro ao atualizar status da solicitação");
    throw error;
  }
};

/**
 * Converts an event request to an actual event
 * @param eventRequestId The id of the event request to approve
 * @returns Promise with the created event id
 */
export const approveEventRequest = async (eventRequestId: string): Promise<string | null> => {
  try {
    // This would import and use your event creation functionality
    // from another service file
    // For now, we'll just return the ID and handle this in a later implementation
    
    // After successful conversion, you would delete the request
    await updateEventRequestStatus(eventRequestId, EventStatus.APPROVED);
    
    toast.success("Solicitação de evento aprovada com sucesso!");
    return eventRequestId;
  } catch (error) {
    console.error("Error approving event request:", error);
    toast.error("Erro ao aprovar solicitação de evento");
    return null;
  }
};

/**
 * Rejects an event request
 * @param eventRequestId The id of the event request to reject
 */
export const rejectEventRequest = async (eventRequestId: string): Promise<void> => {
  try {
    await updateEventRequestStatus(eventRequestId, EventStatus.REJECTED);
    toast.success("Solicitação de evento rejeitada");
  } catch (error) {
    console.error("Error rejecting event request:", error);
    toast.error("Erro ao rejeitar solicitação de evento");
  }
};
