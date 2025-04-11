
// Environmental data for Presidente Prudente
export interface EnvironmentalData {
  id: string;
  date: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  deforestationHectares: number;
  reforestationHectares: number;
  airQualityIndex: number;
  temperatureCelsius: number;
  rainfallMm: number;
  risks: EnvironmentalRisk[];
}

export interface EnvironmentalRisk {
  id: string;
  type: 'deforestation' | 'fire' | 'flood' | 'drought' | 'pollution';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  description: string;
  reportDate: string;
}

// Simulated historical data for Presidente Prudente
export const historicalData: EnvironmentalData[] = [
  {
    id: "pp-2024-01",
    date: "2024-01-15",
    location: "Presidente Prudente - Central",
    coordinates: [-22.1255, -51.3883],
    deforestationHectares: 32,
    reforestationHectares: 18,
    airQualityIndex: 65,
    temperatureCelsius: 28.5,
    rainfallMm: 180,
    risks: [
      {
        id: "r-pp-2024-01-1",
        type: "flood",
        severity: "medium",
        location: "Rio Santo Anastácio",
        coordinates: [-22.1153, -51.3821],
        description: "Risco de inundação devido a chuvas intensas",
        reportDate: "2024-01-10"
      }
    ]
  },
  {
    id: "pp-2024-02",
    date: "2024-02-15",
    location: "Presidente Prudente - Central",
    coordinates: [-22.1255, -51.3883],
    deforestationHectares: 28,
    reforestationHectares: 22,
    airQualityIndex: 68,
    temperatureCelsius: 29.2,
    rainfallMm: 165,
    risks: [
      {
        id: "r-pp-2024-02-1",
        type: "flood",
        severity: "low",
        location: "Córrego do Veado",
        coordinates: [-22.1286, -51.4032],
        description: "Nível de água elevado",
        reportDate: "2024-02-08"
      }
    ]
  },
  {
    id: "pp-2024-03",
    date: "2024-03-15",
    location: "Presidente Prudente - Central",
    coordinates: [-22.1255, -51.3883],
    deforestationHectares: 36,
    reforestationHectares: 24,
    airQualityIndex: 63,
    temperatureCelsius: 28.1,
    rainfallMm: 120,
    risks: [
      {
        id: "r-pp-2024-03-1",
        type: "deforestation",
        severity: "medium",
        location: "Zona Rural Leste",
        coordinates: [-22.0955, -51.3283],
        description: "Desmatamento para expansão agrícola",
        reportDate: "2024-03-05"
      }
    ]
  },
  {
    id: "pp-2024-04",
    date: "2024-04-15",
    location: "Presidente Prudente - Central",
    coordinates: [-22.1255, -51.3883],
    deforestationHectares: 42,
    reforestationHectares: 28,
    airQualityIndex: 60,
    temperatureCelsius: 26.8,
    rainfallMm: 95,
    risks: [
      {
        id: "r-pp-2024-04-1",
        type: "pollution",
        severity: "medium",
        location: "Distrito Industrial",
        coordinates: [-22.1485, -51.4123],
        description: "Aumento de emissões industriais",
        reportDate: "2024-04-12"
      }
    ]
  },
  {
    id: "pp-2024-05",
    date: "2024-05-15",
    location: "Presidente Prudente - Central",
    coordinates: [-22.1255, -51.3883],
    deforestationHectares: 48,
    reforestationHectares: 35,
    airQualityIndex: 58,
    temperatureCelsius: 23.4,
    rainfallMm: 70,
    risks: [
      {
        id: "r-pp-2024-05-1",
        type: "drought",
        severity: "low",
        location: "Região Oeste",
        coordinates: [-22.1255, -51.4283],
        description: "Redução no volume dos reservatórios",
        reportDate: "2024-05-20"
      }
    ]
  },
  {
    id: "pp-2024-06",
    date: "2024-06-15",
    location: "Presidente Prudente - Central",
    coordinates: [-22.1255, -51.3883],
    deforestationHectares: 52,
    reforestationHectares: 42,
    airQualityIndex: 55,
    temperatureCelsius: 21.2,
    rainfallMm: 45,
    risks: [
      {
        id: "r-pp-2024-06-1",
        type: "fire",
        severity: "high",
        location: "Região Norte",
        coordinates: [-22.0855, -51.3883],
        description: "Risco elevado de incêndios devido ao clima seco",
        reportDate: "2024-06-10"
      }
    ]
  }
];

// Get current environmental data for Presidente Prudente with some randomization
export const getCurrentEnvironmentalData = (): EnvironmentalData => {
  const now = new Date();
  const currentMonth = now.getMonth();
  
  // Base the current data on the historical month data with some randomization
  const baseData = historicalData[currentMonth] || historicalData[0];
  
  // Add some randomness to simulate real-time changes
  const randomFactor = (min: number, max: number) => Math.random() * (max - min) + min;
  
  return {
    id: `pp-current-${now.toISOString()}`,
    date: now.toISOString().split('T')[0],
    location: baseData.location,
    coordinates: baseData.coordinates,
    deforestationHectares: Math.round(baseData.deforestationHectares * randomFactor(0.9, 1.1)),
    reforestationHectares: Math.round(baseData.reforestationHectares * randomFactor(0.9, 1.2)),
    airQualityIndex: Math.round(baseData.airQualityIndex * randomFactor(0.95, 1.05)),
    temperatureCelsius: parseFloat((baseData.temperatureCelsius * randomFactor(0.95, 1.05)).toFixed(1)),
    rainfallMm: Math.round(baseData.rainfallMm * randomFactor(0.9, 1.1)),
    risks: baseData.risks.map(risk => ({
      ...risk,
      id: `r-current-${now.getTime()}-${Math.random().toString(36).substring(2, 9)}`,
      reportDate: now.toISOString().split('T')[0]
    }))
  };
};

// Get all environmental risks for Presidente Prudente
export const getAllEnvironmentalRisks = (): EnvironmentalRisk[] => {
  return historicalData.flatMap(data => data.risks);
};

// Get current monitoring statistics
export const getMonitoringStats = () => {
  return {
    hectaresMonitored: 5822,
    riskAreasIdentified: 42,
    deforestationAlerts: 127,
    airQualityIndex: 61
  };
};
