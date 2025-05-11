
export interface MapPoint {
  id: string;
  name: string;
  description: string;
  category: string;
  position: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  addedBy: string;
  lat?: number;
  lng?: number;
  type?: string;
  address?: string;
  impact?: string;
}

export interface NewPoint extends Omit<MapPoint, 'id' | 'createdAt'> {
  position: {
    latitude: number;
    longitude: number;
  };
}
