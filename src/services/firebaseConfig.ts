
// Import Firebase services from the central configuration
import { app } from '@/config/firebase';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Always use Firebase, local storage fallback is now disabled
export const USE_FIREBASE = true;

// Function to seed initial users if they don't exist yet
// This should only be run once during setup or development
export const seedInitialUsers = async () => {
  // This function will be implemented in firebaseAuth.ts
  // to avoid circular dependencies
};
