
import { MapPoint } from '@/types/map';
import { samplePoints } from './sampleData';

export const getStoredPoints = (): MapPoint[] => {
  const storedPoints = localStorage.getItem('mapPoints');
  return storedPoints ? JSON.parse(storedPoints) : samplePoints;
};

export const storePoints = (points: MapPoint[]): void => {
  localStorage.setItem('mapPoints', JSON.stringify(points));
};
