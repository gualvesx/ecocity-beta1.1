
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, firestore } from './firebaseConfig';
import { User } from '@/contexts/AuthContext';

// Converter FirebaseUser para User da aplicação
const convertToContextUser = async (firebaseUser: FirebaseUser | null): Promise<User | null> => {
  if (!firebaseUser) return null;
  
  try {
    // Verificar se o usuário tem dados adicionais no Firestore
    const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
    const userData = userDoc.data();
    
    // Ensure we're returning the correct structure
    return {
      id: firebaseUser.uid,
      name: userData?.name || firebaseUser.displayName || "Usuário",
      email: userData?.email || firebaseUser.email || "",
      isAdmin: userData?.isAdmin === true // Explicitly check for true
    };
  } catch (error) {
    console.error("Error converting user:", error);
    // Fallback para dados básicos do Firebase Auth
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Usuário",
      email: firebaseUser.email || "",
      isAdmin: false
    };
  }
};

export const firebaseAuth = {
  // Registrar novo usuário - Ensures exact match to required Firestore structure
  createUserWithEmailAndPassword: async (email: string, password: string, name: string): Promise<{ user: FirebaseUser }> => {
    try {
      console.log(`Creating user with email: ${email}, name: ${name}`);
      
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created in Firebase Auth with UID:", userCredential.user.uid);
      
      // 2. Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      console.log("Profile updated with displayName:", name);
      
      // 3. Store additional data in Firestore - EXACTLY matching the structure
      const userRef = doc(firestore, "users", userCredential.user.uid);
      
      // Create user document with EXACTLY the specified fields
      await setDoc(userRef, {
        name: name,
        email: email,
        isAdmin: false
      });
      
      console.log("User document created in Firestore with structure:", {
        name,
        email,
        isAdmin: false
      });
      
      return { user: userCredential.user };
    } catch (error: any) {
      console.error("Error creating user:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      throw error;
    }
  },
  
  // Login de usuário
  signInWithEmailAndPassword: async (email: string, password: string): Promise<{ user: FirebaseUser }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },
  
  // Sair
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },
  
  // Atualizar status de administrador
  updateUserAdmin: async (uid: string, isAdmin: boolean): Promise<void> => {
    try {
      const userRef = doc(firestore, "users", uid);
      await setDoc(userRef, { isAdmin }, { merge: true });
      console.log(`Updated user ${uid} admin status to ${isAdmin}`);
    } catch (error) {
      console.error(`Error updating user ${uid} admin status:`, error);
      throw error;
    }
  },
  
  // Obter todos os usuários - Modified for more reliable user fetching
  getAllUsers: async (): Promise<User[]> => {
    try {
      console.log("Fetching all users from Firestore");
      const usersRef = collection(firestore, "users");
      const snapshot = await getDocs(usersRef);
      
      if (snapshot.empty) {
        console.log("No users found in Firestore");
        return [];
      }
      
      console.log(`Found ${snapshot.size} users in Firestore`);
      
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`User data for ${doc.id}:`, data);
        
        return {
          id: doc.id,
          name: data.name || "Usuário",
          email: data.email || "",
          isAdmin: data.isAdmin === true // Explicitly check for true
        };
      });
      
      console.log("Processed users:", users);
      return users;
    } catch (error) {
      console.error("Error getting all users:", error);
      console.error(JSON.stringify(error));
      return [];
    }
  },
  
  // Utilitários
  convertToContextUser
};
