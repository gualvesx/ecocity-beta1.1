
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
      name: firebaseUser.displayName || userData?.name || "Usuário",
      email: firebaseUser.email || userData?.email || "",
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
  // Registrar novo usuário - Fixed user creation flow
  createUserWithEmailAndPassword: async (email: string, password: string, name: string): Promise<{ user: FirebaseUser }> => {
    try {
      console.log(`Creating user with email: ${email}, name: ${name}`);
      
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created in Firebase Auth, now updating profile");
      
      // Atualizar perfil com nome de exibição
      await updateProfile(userCredential.user, {
        displayName: name
      });
      console.log("Profile updated with displayName");
      
      // Armazenar dados adicionais no Firestore
      const userRef = doc(firestore, "users", userCredential.user.uid);
      await setDoc(userRef, {
        name,
        email,
        isAdmin: false,
        createdAt: new Date().toISOString()
      });
      console.log("User data stored in Firestore");
      
      return { user: userCredential.user };
    } catch (error) {
      console.error("Error creating user:", error);
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
