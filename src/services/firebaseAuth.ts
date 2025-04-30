
import { User } from '@/contexts/AuthContext';

// Simulated Firebase Auth service
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  isAdmin?: boolean;
}

interface AuthState {
  currentUser: AuthUser | null;
  users: (AuthUser & { password: string })[];
}

const authState: AuthState = {
  currentUser: null,
  users: [
    {
      uid: "admin-uid-123",
      email: "admin@example.com",
      displayName: "Admin User",
      isAdmin: true,
      password: "admin123"
    },
    {
      uid: "user-uid-456",
      email: "user@example.com",
      displayName: "Regular User",
      isAdmin: false,
      password: "user123"
    }
  ]
};

// Simulated Firebase Auth instance
export const firebaseAuth = {
  // Get current authenticated user
  currentUser: () => authState.currentUser,
  
  // Sign in with email and password
  signInWithEmailAndPassword: async (email: string, password: string) => {
    console.log(`Attempting to sign in with email: ${email}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = authState.users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
      throw new Error("auth/invalid-credentials");
    }
    
    const { password: _, ...authUser } = user;
    authState.currentUser = authUser;
    
    console.log(`User ${email} signed in successfully`);
    
    return {
      user: authUser
    };
  },
  
  // Create a new user with email and password
  createUserWithEmailAndPassword: async (email: string, password: string, displayName: string) => {
    console.log(`Attempting to create user with email: ${email}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (authState.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("auth/email-already-in-use");
    }
    
    const newUser: AuthUser & { password: string } = {
      uid: `user-uid-${Date.now()}`,
      email,
      displayName,
      isAdmin: false,
      password
    };
    
    authState.users.push(newUser);
    
    const { password: _, ...authUser } = newUser;
    authState.currentUser = authUser;
    
    console.log(`User ${email} created successfully`);
    
    return {
      user: authUser
    };
  },
  
  // Sign out the current user
  signOut: async () => {
    console.log("Signing out current user");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    authState.currentUser = null;
    
    console.log("User signed out successfully");
  },
  
  // Update a user's admin status
  updateUserAdmin: async (uid: string, isAdmin: boolean) => {
    console.log(`Updating admin status for user ${uid} to ${isAdmin}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = authState.users.findIndex(u => u.uid === uid);
    if (userIndex === -1) {
      throw new Error("auth/user-not-found");
    }
    
    authState.users[userIndex].isAdmin = isAdmin;
    
    // Update current user if it's the same user
    if (authState.currentUser?.uid === uid) {
      authState.currentUser.isAdmin = isAdmin;
    }
    
    console.log(`User ${uid} admin status updated to ${isAdmin}`);
  },
  
  // Get all users (admin only)
  getAllUsers: async () => {
    console.log("Fetching all users");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Remove passwords before returning
    return authState.users.map(({ password, ...user }) => user);
  },
  
  // Convert AuthUser to User for the app context
  convertToContextUser: (authUser: AuthUser | null): User | null => {
    if (!authUser) return null;
    
    return {
      id: authUser.uid,
      name: authUser.displayName,
      email: authUser.email,
      isAdmin: !!authUser.isAdmin
    };
  }
};
