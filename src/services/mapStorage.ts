
import { MapPoint } from '@/types/map';
import { firebaseFirestore } from './firebaseFirestore';

export const getStoredPoints = async (): Promise<MapPoint[]> => {
  try {
    console.log('Fetching map points from Firebase...');
    const snapshot = await firebaseFirestore.collection<any>('mapPoints').get();
    
    return snapshot.docs.map(doc => {
      const pointData = doc.data();
      return firebaseFirestore.convertToMapPoint(pointData);
    });
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
    const snapshot = await firebaseFirestore.collection<any>('mapPoints').get();
    const existingIds = snapshot.docs.map(doc => doc.id);
    
    // Points to update or add
    for (const point of points) {
      const pointId = String(point.id);
      if (existingIds.includes(pointId)) {
        // Update existing point
        await firebaseFirestore.collection<any>('mapPoints').doc(pointId).update({
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
        const now = new Date().toISOString();
        await firebaseFirestore.collection<any>('mapPoints').add({
          name: point.name,
          type: point.type,
          lat: point.lat,
          lng: point.lng,
          description: point.description,
          impact: point.impact,
          address: point.address || '',
          createdBy: 'system', // Since we don't have user context here
          createdAt: now,
          updatedAt: now
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
