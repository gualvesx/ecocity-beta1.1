
import { MapPoint } from '@/types/map';
import { mapApi } from './api';

// Get stored map points
export const getStoredPoints = async (): Promise<MapPoint[]> => {
  try {
    const response = await mapApi.getAllPoints();
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch map points');
  } catch (error) {
    console.error('Error getting stored points:', error);
    throw error;
  }
};

// Save a new point
export const savePoint = async (point: Omit<MapPoint, 'id'>): Promise<MapPoint> => {
  try {
    const response = await mapApi.addPoint(point);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to save map point');
  } catch (error) {
    console.error('Error saving point:', error);
    throw error;
  }
};

// Delete a point
export const deletePoint = async (pointId: string): Promise<void> => {
  try {
    const response = await mapApi.deletePoint(pointId);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete map point');
    }
  } catch (error) {
    console.error('Error deleting point:', error);
    throw error;
  }
};
