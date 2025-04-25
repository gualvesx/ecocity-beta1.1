
import React, { useEffect, useRef, useState } from 'react';

export const MapPreview = () => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Make sure Leaflet is loaded from the window object
    if (typeof window !== 'undefined' && window.L) {
      try {
        // Initialize the map when the component mounts
        const mapContainer = document.getElementById('map');
        
        if (mapContainer && !mapRef.current) {
          console.log('Creating map instance');
          const map = window.L.map('map').setView([-22.121389, -51.388611], 13);
          mapRef.current = map;

          // Add OpenStreetMap tiles
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          setMapLoaded(true);
          console.log('Map instance created successfully');
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }

      // Cleanup on unmount
      return () => {
        if (mapRef.current) {
          console.log('Removing map instance');
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } else {
      console.warn('Leaflet is not loaded on window object');
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
