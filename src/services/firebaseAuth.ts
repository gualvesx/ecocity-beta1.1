
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
    
    return {
      id: firebaseUser.uid,
      name: userData?.name || firebaseUser.displayName || "Usuário",
      email: userData?.email || firebaseUser.email || "",
      isAdmin: userData?.isAdmin || false
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
  // Registrar novo usuário - Fixed to match exact Firestore structure
  createUserWithEmailAndPassword: async (email: string, password: string, name: string): Promise<{ user: FirebaseUser }> => {
    try {
      console.log(`Creating user with email: ${email}, name: ${name}`);
      
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created in Firebase Auth with UID:", userCredential.user.uid);
      
      // 2. Atualizar perfil com nome de exibição
      await updateProfile(userCredential.user, {
        displayName: name
      });
      console.log("Profile updated with displayName:", name);
      
      // 3. Armazenar dados adicionais no Firestore - EXACTLY matching the structure
      // Note: id is the document ID, not a field in the document
      const userRef = doc(firestore, "users", userCredential.user.uid);
      await setDoc(userRef, {
        name: name,
        email: email,
        isAdmin: false
      });
      console.log("User data stored in Firestore collection 'users' with correct structure");
      
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
    } catch (error) {
      console.error(`Error updating user ${uid} admin status:`, error);
      throw error;
    }
  },
  
  // Obter todos os usuários
  getAllUsers: async (): Promise<User[]> => {
    try {
      const usersRef = collection(firestore, "users");
      const snapshot = await getDocs(usersRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "Usuário",
        email: doc.data().email || "",
        isAdmin: doc.data().isAdmin || false
      }));
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  },
  
  // Utilitários
  convertToContextUser
};
