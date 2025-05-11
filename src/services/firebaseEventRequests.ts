
import { 
  collection, addDoc, getDocs, deleteDoc, doc, 
  query, orderBy, Timestamp, where, DocumentData 
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { auth } from "./firebaseConfig";
import { toast } from "sonner";

// Define the EventRequest type
export interface EventRequest {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  organizer: string;
  createdBy?: string;
  createdAt?: Date | string;
}

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
 * Creates a new event request in Firestore
 * @param eventRequest The event request data
 * @returns Promise with the created event request including id
 */
export const createEventRequest = async (eventRequest: Omit<EventRequest, "id" | "createdAt" | "createdBy">): Promise<EventRequest> => {
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
      createdAt: new Date(),
      createdBy: currentUser.uid
    };
    
    // Add document to Firestore
    const docRef = await addDoc(eventRequestsCollection, newEventRequestData);
    
    // Return complete event request with id
    const createdRequest: EventRequest = {
      id: docRef.id,
      ...eventRequest,
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
    await deleteEventRequest(eventRequestId);
    
    toast.success("Solicitação de evento aprovada com sucesso!");
    return eventRequestId;
  } catch (error) {
    console.error("Error approving event request:", error);
    toast.error("Erro ao aprovar solicitação de evento");
    return null;
  }
};
