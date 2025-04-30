
// Firebase configuration simulation
export const firebaseConfig = {
  apiKey: "simulated-firebase-api-key",
  authDomain: "terra-verde-conectada.firebaseapp.com",
  projectId: "terra-verde-conectada",
  storageBucket: "terra-verde-conectada.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-ABCDEFGHIJ"
};

// Simulated Firebase instance
export const simulatedFirebase = {
  initialized: false,
  initialize: () => {
    console.log("Simulating Firebase initialization with config:", firebaseConfig);
    simulatedFirebase.initialized = true;
    return simulatedFirebase;
  },
  auth: () => firebaseAuth,
  firestore: () => firebaseFirestore,
};

// Export the simulated Firebase as default
export default simulatedFirebase;
