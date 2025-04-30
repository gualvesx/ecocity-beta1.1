
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'sonner';
import { firebaseAuth } from '@/services/firebaseAuth';

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
  getAllUsers: () => User[];
  updateUserAdminStatus: (userId: string, isAdmin: boolean) => Promise<boolean>;
  createUserByAdmin: (name: string, email: string, password: string, isAdmin: boolean) => Promise<boolean>;
}

// Creating the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users list (apenas para fallback, o Firebase é a fonte principal)
const dummyUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@terraverde.com',
    password: 'admin@123',
    isAdmin: true,
  },
  {
    id: '2',
    name: 'Usuário',
    email: 'usuario@terraverde.com',
    password: 'usuario@123',
    isAdmin: false,
  }
];

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<(User & { password: string })[]>([]);

  // Initialize with existing or dummy users
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Manter os dados de usuário dummy apenas para fallback
        setUsers(dummyUsers);
        console.log("Usando dados de usuário para fallback local");

        // Check if a user is logged in
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading users:", error);
        setUsers(dummyUsers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try Firebase login first
      try {
        console.log("Attempting login with Firebase...");
        const { user: firebaseUser } = await firebaseAuth.signInWithEmailAndPassword(email, password);
        const currentUser = await firebaseAuth.convertToContextUser(firebaseUser);
        
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          toast.success(`Welcome, ${currentUser.name}!`);
          return true;
        }
      } catch (firebaseError) {
        console.log("Firebase login failed, trying alternatives", firebaseError);
      }
      
      // Fallback to local login
      return loginWithLocalData(email, password);
    } catch (error) {
      toast.error('Error logging in');
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for local login (fallback)
  const loginWithLocalData = (email: string, password: string): boolean => {
    const foundUser = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome, ${foundUser.name}!`);
      return true;
    } else {
      toast.error('Incorrect email or password');
      return false;
    }
  };

  // Registration function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try Firebase registration
      try {
        console.log("Attempting registration with Firebase...");
        const { user: firebaseUser } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
        const newUser = await firebaseAuth.convertToContextUser(firebaseUser);
        
        if (newUser) {
          setUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          toast.success('Registration successful via Firebase!');
          return true;
        }
      } catch (firebaseError) {
        console.log("Firebase registration failed, falling back to local methods", firebaseError);
        return registerLocally(name, email, password);
      }
      
      return false;
    } catch (error) {
      toast.error('Error registering user');
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for local registration (fallback)
  const registerLocally = (name: string, email: string, password: string): boolean => {
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error('Email already registered');
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      isAdmin: false,
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Auto-login the user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    toast.success('Registration successful (local mode)!');
    return true;
  };

  // Logout function
  const logout = async () => {
    try {
      // Try Firebase logout first
      try {
        await firebaseAuth.signOut();
        console.log("Logged out from Firebase");
      } catch (firebaseError) {
        console.log("Firebase logout failed", firebaseError);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
    
    // Clear local data
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.info('You have logged out');
  };

  // Function to get all users (admin only) - Use useCallback to memoize
  const getAllUsers = useCallback((): User[] => {
    if (!user?.isAdmin) return [];
    
    // Use Firebase Auth if available
    const fetchFirebaseUsers = async () => {
      try {
        return await firebaseAuth.getAllUsers();
      } catch (error) {
        console.error('Error fetching Firebase users:', error);
        return null;
      }
    };
    
    // Use local users as fallback
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }, [users, user?.isAdmin]); // Add dependencies

  // Function to update a user's admin status
  const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
    // Check if current user is admin
    if (!user?.isAdmin) {
      toast.error('You do not have permission to perform this action');
      return false;
    }
    
    try {
      // Try to update in Firebase first
      try {
        console.log(`Updating user ${userId} admin status to ${isAdmin} in Firebase...`);
        await firebaseAuth.updateUserAdmin(userId, isAdmin);
        
        // Update local data for consistency
        updateLocalUserAdminStatus(userId, isAdmin);
        return true;
      } catch (firebaseError) {
        console.log("Firebase update failed, falling back to other methods", firebaseError);
      }
      
      // If Firebase is not available, use local update
      return updateLocalUserAdminStatus(userId, isAdmin);
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  };
  
  // Helper for local admin status update
  const updateLocalUserAdminStatus = (userId: string, isAdmin: boolean): boolean => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, isAdmin };
      }
      return u;
    });
    
    // Update state
    setUsers(updatedUsers);
    
    // If the modified user is the current user, update their state too
    if (user && user.id === userId) {
      const updatedUser = { ...user, isAdmin };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    return true;
  };
  
  // Function to create user by admin
  const createUserByAdmin = async (
    name: string, 
    email: string, 
    password: string, 
    isAdmin: boolean
  ): Promise<boolean> => {
    // Check if current user is admin
    if (!user?.isAdmin) {
      toast.error('You do not have permission to perform this action');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Try to create user in Firebase first
      try {
        console.log("Creating user in Firebase...");
        const { user: firebaseUser } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
        
        if (isAdmin) {
          await firebaseAuth.updateUserAdmin(firebaseUser.uid, isAdmin);
        }
        
        toast.success('User created successfully in Firebase!');
        return true;
      } catch (firebaseError) {
        console.log("Firebase user creation failed, falling back to local", firebaseError);
        return createLocalUserByAdmin(name, email, password, isAdmin);
      }
    } catch (error) {
      toast.error('Error creating user');
      console.error('User creation error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for local user creation by admin
  const createLocalUserByAdmin = (name: string, email: string, password: string, isAdmin: boolean): boolean => {
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error('Email already registered');
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      isAdmin,
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    toast.success('User created successfully (local mode)!');
    return true;
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
