// Import the functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the auth and firestore modules - will be defined in their respective files
import { firebaseAuth } from './firebaseAuth';
import { firebaseFirestore } from './firebaseFirestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvuILIDo5uxxkX4SRo1rkMGN3EVKf_cRQ",
  authDomain: "ecocity-801cc.firebaseapp.com",
  projectId: "ecocity-801cc",
  storageBucket: "ecocity-801cc.firebasestorage.app",
  messagingSenderId: "825751292076",
  appId: "1:825751292076:web:11dcde0f9a5d153b64b709",
  measurementId: "G-9NQK92Q42X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Firebase service exports
export const firebaseApp = {
  initialized: true,
  app,
  analytics,
  auth: () => auth,
  firestore: () => firestore,
  // Maintain compatibility with existing code
  initialize: () => {
    console.log("Firebase already initialized with config:", firebaseConfig);
    return firebaseApp;
  }
};

// Export the Firebase services as default
export default firebaseApp;

// Export individual services for direct import
export { app, analytics, auth, firestore };
