
declare module 'leaflet' {
  export interface Map {
    remove(): void;
  }

  export function map(id: string): Map;
  export function tileLayer(url: string, options?: any): any;
}

declare global {
  interface Window {
    L: any;
  }
}

export {};
