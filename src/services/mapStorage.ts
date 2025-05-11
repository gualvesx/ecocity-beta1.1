
import { MapPoint } from '@/types/map';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

// Collection reference for map points
const mapPointsCollection = collection(firestore, 'locations');

// Get stored map points directly from Firestore
export const getStoredPoints = async (): Promise<MapPoint[]> => {
  try {
    console.log("Fetching map points from Firestore");
    const snapshot = await getDocs(mapPointsCollection);
    
    if (snapshot.empty) {
      console.log("No map points found in Firestore");
      return [];
    }
    
    console.log(`Found ${snapshot.size} map points in Firestore`);
    
    const points = snapshot.docs.map(doc => {
      const data = doc.data();
      const point: MapPoint = {
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
      };
      return point;
    });
    
    return points;
  } catch (error) {
    console.error('Error getting stored points:', error);
    throw error;
  }
};

// Save a new point to Firestore
export const savePoint = async (point: Omit<MapPoint, 'id'>): Promise<MapPoint> => {
  try {
    console.log("Saving map point to Firestore:", point);
    
    // Convert to Firestore format
    const pointData = {
      name: point.name,
      description: point.description,
      category: point.category,
      position: {
        latitude: point.position.latitude,
        longitude: point.position.longitude
      },
      addedBy: point.addedBy || "",
      createdAt: new Date()
    };
    
    const docRef = await addDoc(mapPointsCollection, pointData);
    console.log("Map point added with ID:", docRef.id);
    
    // Return the created point with its ID
    return {
      ...point,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error saving point:', error);
    throw error;
  }
};

// Delete a point from Firestore
export const deletePoint = async (pointId: string): Promise<void> => {
  try {
    console.log(`Deleting map point with ID: ${pointId}`);
    await deleteDoc(doc(firestore, 'locations', pointId));
    console.log("Map point deleted successfully");
  } catch (error) {
    console.error('Error deleting point:', error);
    throw error;
  }
};
