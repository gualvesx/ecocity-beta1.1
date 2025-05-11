
// Import Firebase services from the central configuration
import { app } from '@/config/firebase';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Flag to determine if we're using local storage fallback or real Firebase
export const USE_FIREBASE = true; // Set to true to use Firebase, false to use local storage fallback
