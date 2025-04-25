
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export const MapPreview = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize the map when the component mounts
      const mapContainer = document.getElementById('map');
      
      if (mapContainer && !mapRef.current) {
        const map = L.map('map').setView([-22.121389, -51.388611], 13);
        mapRef.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
      }

      // Cleanup on unmount
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, []);

  return (
    <div className="relative w-full pt-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-green-dark">
              Cidades Sustentáveis para um <span className="text-eco-green">Futuro Verde</span>
            </h1>
            <p className="text-lg text-black">Juntos, somos a força que protege o amanhã! 🌿 </p>
            <p className="text-lg text-black">Cada ação conta na preservação do nosso planeta.</p>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white">
            <div id="map" className="h-[400px] w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
