
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, firestore, USE_FIREBASE } from './firebaseConfig';
import { User } from '@/contexts/AuthContext';

// Convert FirebaseUser to application User
const convertToContextUser = async (firebaseUser: FirebaseUser | null): Promise<User | null> => {
  if (!firebaseUser) return null;
  
  try {
    // Check if user has additional data in Firestore
    const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
    const userData = userDoc.data();
    
    // Return user data with correct structure
    return {
      id: firebaseUser.uid,
      name: userData?.name || firebaseUser.displayName || "Usuário",
      email: userData?.email || firebaseUser.email || "",
      isAdmin: userData?.role === "admin" // Check for admin role
    };
  } catch (error) {
    console.error("Error converting user:", error);
    // Fallback to basic Firebase Auth data
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Usuário",
      email: firebaseUser.email || "",
      isAdmin: false
    };
  }
};

// Local storage implementations for offline development
const localStorageAuth = {
  users: JSON.parse(localStorage.getItem('localUsers') || '[]'),
  
  saveUsers() {
    localStorage.setItem('localUsers', JSON.stringify(this.users));
  },
  
  createUser(email: string, password: string, name: string, isAdmin: boolean = false) {
    const user = {
      uid: Date.now().toString(),
      email,
      password,
      displayName: name,
      isAdmin
    };
    this.users.push(user);
    this.saveUsers();
    return user;
  },
  
  findUser(email: string, password: string) {
    return this.users.find(u => u.email === email && u.password === password);
  },
  
  updateUserAdmin(uid: string, isAdmin: boolean) {
    const user = this.users.find(u => u.uid === uid);
    if (user) {
      user.isAdmin = isAdmin;
      this.saveUsers();
    }
    return user;
  }
};

export const firebaseAuth = {
  // Register new user - ensures exact match to Firestore structure
  createUserWithEmailAndPassword: async (email: string, password: string, name: string): Promise<{ user: FirebaseUser }> => {
    if (!USE_FIREBASE) {
      // Local implementation
      const user = localStorageAuth.createUser(email, password, name);
      return { user: user as unknown as FirebaseUser };
    }
    
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
      
      // 3. Store additional data in Firestore - WITHOUT the password
      const userRef = doc(firestore, "users", userCredential.user.uid);
      
      // Create user document with the specified fields
      await setDoc(userRef, {
        name: name,
        email: email,
        role: "user",
        createdAt: new Date()
      });
      
      console.log("User document created in Firestore with structure:", {
        name,
        email,
        role: "user",
        createdAt: new Date()
      });
      
      return { user: userCredential.user };
    } catch (error: any) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  
  // User login
  signInWithEmailAndPassword: async (email: string, password: string): Promise<{ user: FirebaseUser }> => {
    if (!USE_FIREBASE) {
      // Local implementation
      const user = localStorageAuth.findUser(email, password);
      if (!user) throw new Error("Invalid email or password");
      return { user: user as unknown as FirebaseUser };
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },
  
  // Sign out
  signOut: async (): Promise<void> => {
    if (!USE_FIREBASE) {
      // Local implementation - just clear local session
      localStorage.removeItem('currentUser');
      return;
    }
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },
  
  // Update admin status
  updateUserAdmin: async (uid: string, isAdmin: boolean): Promise<void> => {
    if (!USE_FIREBASE) {
      // Local implementation
      localStorageAuth.updateUserAdmin(uid, isAdmin);
      return;
    }
    
    try {
      const userRef = doc(firestore, "users", uid);
      await setDoc(userRef, { role: isAdmin ? "admin" : "user" }, { merge: true });
      console.log(`Updated user ${uid} admin status to ${isAdmin}`);
    } catch (error) {
      console.error(`Error updating user ${uid} admin status:`, error);
      throw error;
    }
  },
  
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    if (!USE_FIREBASE) {
      // Local implementation
      return localStorageAuth.users.map(u => ({
        id: u.uid,
        name: u.displayName || "Usuário",
        email: u.email,
        isAdmin: u.isAdmin || false
      }));
    }
    
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
          isAdmin: data.role === "admin" // Check for admin role
        };
      });
      
      console.log("Processed users:", users);
      return users;
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  },
  
  // Utilities
  convertToContextUser
};
