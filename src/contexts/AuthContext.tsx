
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'sonner';
import { firebaseAuth, seedInitialUsers } from '@/services/firebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebaseConfig';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Auth context types
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => Promise<User[]>;
  updateUserAdminStatus: (userId: string, isAdmin: boolean) => Promise<boolean>;
  createUserByAdmin: (name: string, email: string, password: string, isAdmin: boolean) => Promise<boolean>;
}

// Creating the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with Firebase Auth listener and seed initial users
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Seed initial users (will only create them if they don't exist)
        await seedInitialUsers();
        console.log("Initial users seeded or already exist");
        
        // Set up Firebase Auth listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log("Auth state changed:", firebaseUser ? `User ${firebaseUser.uid}` : "No user");
          
          if (firebaseUser) {
            // User is logged in
            const appUser = await firebaseAuth.convertToContextUser(firebaseUser);
            if (appUser) {
              setUser(appUser);
            }
          } else {
            setUser(null);
          }
          setIsLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Login function - Firebase only
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login with Firebase...");
      const { user: firebaseUser } = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const currentUser = await firebaseAuth.convertToContextUser(firebaseUser);
      
      if (currentUser) {
        setUser(currentUser);
        toast.success(`Bem-vindo, ${currentUser.name}!`);
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Registration function - Firebase only
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log("Starting registration process for:", name, email);
    
    try {
      console.log("Attempting registration with Firebase...");
      
      // 1. Create user in Firebase Auth and Firestore
      const { user: firebaseUser } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
      console.log("User created in Firebase with UID:", firebaseUser.uid);
      
      // 2. Wait a moment for Firestore write to complete (important!)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Fetch the user data to verify it was created properly
      const newUser = await firebaseAuth.convertToContextUser(firebaseUser);
      console.log("User data from Firestore:", newUser);
      
      if (newUser) {
        // 4. Set user in context
        console.log("Setting user in context:", newUser);
        setUser(newUser);
        toast.success('Registro realizado com sucesso!');
        return true;
      }
      
      console.error("Failed to get context user after Firebase registration");
      return false;
    } catch (error: any) {
      console.error("Firebase registration failed:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este email já está em uso');
      } else {
        toast.error('Erro ao registrar usuário');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function - Firebase only
  const logout = async () => {
    try {
      await firebaseAuth.signOut();
      console.log("Logged out from Firebase");
      setUser(null);
      toast.info('Você saiu');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erro ao sair');
    }
  };

  // Function to get all users (admin only) - Firebase only
  const getAllUsers = useCallback(async (): Promise<User[]> => {
    if (!user?.isAdmin) return [];
    
    try {
      return await firebaseAuth.getAllUsers();
    } catch (error) {
      console.error('Error fetching Firebase users:', error);
      return [];
    }
  }, [user?.isAdmin]);

  // Function to update a user's admin status - Firebase only
  const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para realizar esta ação');
      return false;
    }
    
    try {
      console.log(`Updating user ${userId} admin status to ${isAdmin} in Firebase...`);
      await firebaseAuth.updateUserAdmin(userId, isAdmin);
      
      toast.success(`Status de administrador atualizado com sucesso!`);
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Erro ao atualizar status do usuário');
      return false;
    }
  };
  
  // Function to create user by admin - Firebase only
  const createUserByAdmin = async (
    name: string, 
    email: string, 
    password: string, 
    isAdmin: boolean
  ): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para realizar esta ação');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Creating user in Firebase...");
      const { user: firebaseUser } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
      
      if (isAdmin) {
        await firebaseAuth.updateUserAdmin(firebaseUser.uid, isAdmin);
      }
      
      toast.success('Usuário criado com sucesso!');
      return true;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este email já está em uso');
      } else {
        toast.error('Erro ao criar usuário');
      }
      console.error('User creation error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      getAllUsers,
      updateUserAdminStatus,
      createUserByAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
