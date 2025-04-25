
declare module 'leaflet' {
  export interface Map {
    remove(): void;
    setView(center: [number, number], zoom: number): this;
    on(eventName: string, handler: Function): this;
    eachLayer(callback: (layer: any) => void): this;
    addControl(control: any): this;
  }

  export function map(element: string | HTMLElement): Map;
  export function tileLayer(url: string, options?: any): any;
}

declare global {
  interface Window {
    L: {
      map(element: string | HTMLElement): any;
      tileLayer(url: string, options?: any): any;
      marker(latlng: [number, number], options?: any): any;
      divIcon(options: any): any;
      NavigationControl?: any;
    };
  }
}

export {};
