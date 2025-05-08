
// Placeholder API service until the real API is available
export const environmentApi = {
  getMonitoringStats: async () => {
    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return {
      success: true,
      data: {
        hectaresMonitored: 5822,
        riskAreasIdentified: 42,
        deforestationAlerts: 127,
        airQualityIndex: 61
      }
    };
  }
};
