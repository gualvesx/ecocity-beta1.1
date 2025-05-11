
// Simple geocoding service that simulates geocoding for local development
// In production, this would connect to a real geocoding API like Google Maps or MapBox

interface GeoLocation {
  lat: number;
  lng: number;
}

// Sample geocoded locations for simulation
const geocodedLocations: Record<string, GeoLocation> = {
  'Avenida Manoel Goulart, 1000 - Centro': { lat: -22.1192, lng: -51.3884 },
  'Prudenshopping, Presidente Prudente': { lat: -22.1254, lng: -51.4041 },
  'Parque do Povo, Presidente Prudente': { lat: -22.1257, lng: -51.3897 },
  'Praça 9 de Julho, Presidente Prudente': { lat: -22.1197, lng: -51.3883 },
  'UNESP, Presidente Prudente': { lat: -22.1217, lng: -51.4078 },
  'Catedral São Sebastião, Presidente Prudente': { lat: -22.1226, lng: -51.3882 },
  'Terminal Rodoviário, Presidente Prudente': { lat: -22.1354, lng: -51.3992 },
  'Recinto de Exposições, Presidente Prudente': { lat: -22.1091, lng: -51.3961 },
  'Matarazzo, Presidente Prudente': { lat: -22.1177, lng: -51.4000 },
};

export const geocodeAddress = async (address: string): Promise<GeoLocation | null> => {
  try {
    // In a real implementation, this would call a geocoding API
    console.log(`Geocoding address: ${address}`);
    
    // Check for exact match in our simulation data
    if (geocodedLocations[address]) {
      return geocodedLocations[address];
    }
    
    // Try to find partial matches
    for (const [knownAddress, location] of Object.entries(geocodedLocations)) {
      if (address.includes(knownAddress) || knownAddress.includes(address)) {
        return location;
      }
    }
    
    // Generate random coordinates near Presidente Prudente if no match (for simulation only)
    // In production, we would return null if the geocoding API can't find the address
    const baseLat = -22.1217;
    const baseLng = -51.4078;
    
    // Generate random offset within ~3km
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    return {
      lat: baseLat + latOffset,
      lng: baseLng + lngOffset
    };
    
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};
