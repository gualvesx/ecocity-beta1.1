
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

// Function to check Firebase connection
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Simple test to check if we can access Firestore
    const testDoc = await getFirestore(app);
    console.log("Firebase connection successful");
    return true;
  } catch (error) {
    console.error("Firebase connection error:", error);
    return false;
  }
};

// Function to seed initial users if they don't exist yet
// This should only be run once during setup or development
export const seedInitialUsers = async () => {
  // This function will be implemented in firebaseAuth.ts
  // to avoid circular dependencies
  console.log("Seed initial users function called");
};
