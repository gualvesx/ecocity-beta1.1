
declare module 'leaflet' {
  export interface Map {
    remove(): void;
    setView(center: [number, number], zoom: number): this;
  }

  export function map(id: string): Map;
  export function tileLayer(url: string, options?: any): any;
}

declare global {
  interface Window {
    L: {
      map(id: string): any;
      tileLayer(url: string, options?: any): any;
      marker(latlng: [number, number], options?: any): any;
    };
  }
}

export {};
