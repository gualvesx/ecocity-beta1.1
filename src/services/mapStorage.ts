
import { MapPoint } from '@/types/map';
import { firebaseFirestore } from './firebaseFirestore';

export const getStoredPoints = async (): Promise<MapPoint[]> => {
  try {
    console.log('Fetching map points from Firebase...');
    return await firebaseFirestore.mapPoints.getAll();
  } catch (error) {
    console.error('Error fetching points from Firebase:', error);
    // Return empty array if there's an error
    return [];
  }
};

export const storePoints = async (points: MapPoint[]): Promise<void> => {
  try {
    console.log('Storing map points to Firebase...');
    // This would be a more complex operation in a real system
    // For our simulation, we would need to find points to update, add, or delete
    
    // For demonstration purposes only - in a real system you would use transactions or batched writes
    // This implementation is simplified and would not be recommended in production
    
    // Get current points
    const existingPoints = await firebaseFirestore.mapPoints.getAll();
    const existingIds = existingPoints.map(point => String(point.id));
    
    // Points to update or add
    for (const point of points) {
      const pointId = String(point.id);
      if (existingIds.includes(pointId)) {
        // Update existing point - since we don't have a separate update method,
        // we'll simulate by deleting and re-adding
        await firebaseFirestore.mapPoints.delete(pointId);
        await firebaseFirestore.mapPoints.add({
          name: point.name,
          type: point.type,
          lat: point.lat,
          lng: point.lng,
          description: point.description,
          impact: point.impact,
          address: point.address || ''
        });
      } else {
        // Add new point
        await firebaseFirestore.mapPoints.add({
          name: point.name,
          type: point.type,
          lat: point.lat,
          lng: point.lng,
          description: point.description,
          impact: point.impact,
          address: point.address || ''
        });
      }
    }
    
    // Note: This is a simplified implementation that doesn't handle deleting
    // points that exist in Firebase but not in the points array
    
    console.log('Points stored successfully');
  } catch (error) {
    console.error('Error storing points to Firebase:', error);
    throw error;
  }
};
