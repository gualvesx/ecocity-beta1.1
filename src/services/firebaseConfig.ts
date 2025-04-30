
// Import Firebase configuration from the central config file
import { app, analytics } from '@/config/firebase';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the auth and firestore modules
import { firebaseAuth } from './firebaseAuth';
import { firebaseFirestore } from './firebaseFirestore';

// Initialize Firebase services
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
    console.log("Firebase already initialized with unified config");
    return firebaseApp;
  }
};

// Export the Firebase services as default
export default firebaseApp;

// Export individual services for direct import
export { app, analytics, auth, firestore };
