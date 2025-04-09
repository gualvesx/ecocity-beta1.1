import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lygvpskjhiwgzsmqiojc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create the Supabase client if we have both URL and key
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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

// Dummy users list
const dummyUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    id: '2',
    name: 'Usuário',
    email: 'user@example.com',
    password: 'user123',
    isAdmin: false,
  }
];

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<(User & { password: string })[]>([]);

  // Initialize with existing or dummy users
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(dummyUsers);
      localStorage.setItem('users', JSON.stringify(dummyUsers));
    }

    // Check if a user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
    
    // Check Supabase session if Supabase is initialized
    if (supabase) {
      checkSupabaseSession();
    }
  }, []);
  
  // Check Supabase session at startup
  const checkSupabaseSession = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error.message);
        return;
      }
      
      if (data.session) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (userError) {
          console.error('Error fetching user data:', userError.message);
          return;
        }
        
        if (userData) {
          const currentUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            isAdmin: userData.is_admin || false,
          };
          
          setUser(currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
      }
    } catch (error) {
      console.error('Error checking Supabase session:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try Supabase login if available
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error('Supabase login error:', error.message);
          
          // Fallback to local login
          return loginWithLocalData(email, password);
        }
        
        // Successful Supabase login
        if (data.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (userError) {
            console.error('Error fetching user data:', userError.message);
            toast.error('Error fetching user data');
            return false;
          }
          
          const currentUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            isAdmin: userData.is_admin || false,
          };
          
          setUser(currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          toast.success(`Welcome, ${currentUser.name}!`);
          return true;
        }
        
        return false;
      } else {
        // If Supabase is not available, use local login
        return loginWithLocalData(email, password);
      }
    } catch (error) {
      toast.error('Error logging in');
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for local login
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
      // Try Supabase registration if available
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });
        
        if (error) {
          console.error('Supabase registration error:', error.message);
          
          // Fallback to local registration
          return registerLocally(name, email, password);
        }
        
        // Successful Supabase registration
        if (data.user) {
          // Insert additional data in users table
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              { 
                id: data.user.id,
                name, 
                email,
                is_admin: false,
              }
            ]);
            
          if (insertError) {
            console.error('Error inserting user data:', insertError.message);
            toast.error('Error completing registration');
            return false;
          }
          
          // Create local user for consistency
          const newUser = {
            id: data.user.id,
            name,
            email,
            isAdmin: false,
          };
          
          setUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          
          toast.success('Registration successful!');
          return true;
        }
        
        return false;
      } else {
        // If Supabase is not available, use local registration
        return registerLocally(name, email, password);
      }
    } catch (error) {
      toast.error('Error registering user');
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for local registration
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
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Auto-login the user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    toast.success('Registration successful!');
    return true;
  };

  // Logout function
  const logout = async () => {
    try {
      // Supabase logout if available
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error logging out of Supabase:', error);
    }
    
    // Clear local data
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.info('You have logged out');
  };

  // Function to get all users (admin only) - Use useCallback to memoize
  const getAllUsers = useCallback((): User[] => {
    if (!user?.isAdmin) return [];
    
    // Try to fetch users from Supabase
    const fetchSupabaseUsers = async () => {
      try {
        if (!supabase) return null;
        
        const { data, error } = await supabase
          .from('users')
          .select('*');
          
        if (error) {
          console.error('Error fetching users from Supabase:', error.message);
          return null;
        }
        
        if (data && data.length > 0) {
          // Map Supabase data to expected format
          const formattedUsers = data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            isAdmin: u.is_admin || false,
          }));
          
          return formattedUsers;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      
      return null;
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
      // Try to update in Supabase first
      if (supabase) {
        const { error } = await supabase
          .from('users')
          .update({ is_admin: isAdmin })
          .eq('id', userId);
          
        if (error) {
          console.error('Error updating admin status in Supabase:', error.message);
          
          // Fallback to local update
          return updateLocalUserAdminStatus(userId, isAdmin);
        }
        
        // If no error, update local data as well for consistency
        return updateLocalUserAdminStatus(userId, isAdmin);
      } else {
        // If Supabase is not available, use local update
        return updateLocalUserAdminStatus(userId, isAdmin);
      }
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
    
    // Update state and localStorage
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
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
      // Try to create user in Supabase
      if (supabase) {
        // Note: In a real app, this would require server-side code with admin privileges
        // This is a simplified approach for the demo
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });
        
        if (error) {
          console.error('Error creating user in Supabase:', error.message);
          
          // Fallback to local creation
          return createLocalUserByAdmin(name, email, password, isAdmin);
        }
        
        // Successful creation in Supabase
        if (data.user) {
          // Insert additional data in users table
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              { 
                id: data.user.id,
                name, 
                email,
                is_admin: isAdmin,
              }
            ]);
            
          if (insertError) {
            console.error('Error inserting user data:', insertError.message);
            toast.error('Error completing user registration');
            return false;
          }
          
          toast.success('User created successfully!');
          return true;
        }
        
        return false;
      } else {
        // If Supabase is not available, use local creation
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
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    toast.success('User created successfully!');
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
