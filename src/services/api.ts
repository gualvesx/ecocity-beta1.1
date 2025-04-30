import { firebaseAuth } from './firebaseAuth';
import { firebaseFirestore } from './firebaseFirestore';
import { User } from '@/contexts/AuthContext';
import { EnvironmentalData, EnvironmentalRisk } from './envData';

// API response interfaces
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// User API endpoints
export const userApi = {
  // Get all users
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      console.log("API: Fetching all users");
      
      const users = await firebaseAuth.getAllUsers();
      const appUsers = users.map(user => ({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        isAdmin: !!user.isAdmin
      }));
      
      return {
        success: true,
        data: appUsers
      };
    } catch (error) {
      console.error("API error fetching users:", error);
      return {
        success: false,
        message: "Failed to fetch users"
      };
    }
  },
  
  // Get user by ID
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      console.log(`API: Fetching user with ID ${userId}`);
      
      const users = await firebaseAuth.getAllUsers();
      const user = users.find(u => u.uid === userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found"
        };
      }
      
      return {
        success: true,
        data: {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          isAdmin: !!user.isAdmin
        }
      };
    } catch (error) {
      console.error(`API error fetching user ${userId}:`, error);
      return {
        success: false,
        message: "Failed to fetch user"
      };
    }
  },
  
  // Create user (admin only)
  createUser: async (
    name: string, 
    email: string, 
    password: string, 
    isAdmin: boolean
  ): Promise<ApiResponse<User>> => {
    try {
      console.log(`API: Creating user ${email}`);
      
      const { user } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
      
      if (isAdmin) {
        await firebaseAuth.updateUserAdmin(user.uid, true);
      }
      
      return {
        success: true,
        data: {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          isAdmin: !!user.isAdmin
        }
      };
    } catch (error) {
      console.error("API error creating user:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create user"
      };
    }
  },
  
  // Update user admin status
  updateUserAdmin: async (
    userId: string, 
    isAdmin: boolean
  ): Promise<ApiResponse<null>> => {
    try {
      console.log(`API: Updating user ${userId} admin status to ${isAdmin}`);
      
      await firebaseAuth.updateUserAdmin(userId, isAdmin);
      
      return {
        success: true
      };
    } catch (error) {
      console.error(`API error updating user ${userId}:`, error);
      return {
        success: false,
        message: "Failed to update user"
      };
    }
  },
  
  // Delete user (not implemented in the UI yet)
  deleteUser: async (userId: string): Promise<ApiResponse<null>> => {
    try {
      console.log(`API: Deleting user ${userId}`);
      
      // Firebase delete user would be implemented here
      // For simulation, we just return success
      
      return {
        success: true
      };
    } catch (error) {
      console.error(`API error deleting user ${userId}:`, error);
      return {
        success: false,
        message: "Failed to delete user"
      };
    }
  }
};

// Authentication API endpoints
export const authApi = {
  // Login
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      console.log(`API: Login attempt for ${email}`);
      
      const { user } = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const appUser = firebaseAuth.convertToContextUser(user);
      
      if (!appUser) {
        throw new Error("Failed to convert user data");
      }
      
      return {
        success: true,
        data: appUser
      };
    } catch (error) {
      console.error("API login error:", error);
      return {
        success: false,
        message: "Invalid email or password"
      };
    }
  },
  
  // Register
  register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      console.log(`API: Registration attempt for ${email}`);
      
      const { user } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
      const appUser = firebaseAuth.convertToContextUser(user);
      
      if (!appUser) {
        throw new Error("Failed to convert user data");
      }
      
      return {
        success: true,
        data: appUser
      };
    } catch (error) {
      console.error("API registration error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed"
      };
    }
  },
  
  // Logout
  logout: async (): Promise<ApiResponse<null>> => {
    try {
      console.log("API: Logout attempt");
      
      await firebaseAuth.signOut();
      
      return {
        success: true
      };
    } catch (error) {
      console.error("API logout error:", error);
      return {
        success: false,
        message: "Logout failed"
      };
    }
  }
};

// Environment API endpoints for Presidente Prudente
export const environmentApi = {
  // Get current environmental data
  getCurrentData: async (): Promise<ApiResponse<EnvironmentalData>> => {
    try {
      console.log("API: Fetching current environmental data for Presidente Prudente");
      
      await firebaseFirestore.initEnvironmentalData();
      const data = await firebaseFirestore.getEnvironmentalData();
      
      // Remove Firestore-specific fields but keep the id
      const { createdAt, updatedAt, ...envData } = data;
      
      return {
        success: true,
        data: envData
      };
    } catch (error) {
      console.error("API error fetching environmental data:", error);
      return {
        success: false,
        message: "Failed to fetch environmental data"
      };
    }
  },
  
  // Get all environmental risks
  getEnvironmentalRisks: async (): Promise<ApiResponse<EnvironmentalRisk[]>> => {
    try {
      console.log("API: Fetching environmental risks for Presidente Prudente");
      
      await firebaseFirestore.initEnvironmentalData();
      const snapshot = await firebaseFirestore.collection<any>('environmentalRisks').get();
      
      const risks: EnvironmentalRisk[] = snapshot.docs.map(doc => {
        const data = doc.data();
        // Remove Firestore-specific fields
        const { id, createdAt, updatedAt, ...risk } = data;
        return risk as EnvironmentalRisk;
      });
      
      return {
        success: true,
        data: risks
      };
    } catch (error) {
      console.error("API error fetching environmental risks:", error);
      return {
        success: false,
        message: "Failed to fetch environmental risks"
      };
    }
  },
  
  // Get monitoring statistics
  getMonitoringStats: async () => {
    try {
      console.log("API: Fetching monitoring statistics");
      
      const stats = await firebaseFirestore.getMonitoringStatistics();
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error("API error fetching monitoring statistics:", error);
      return {
        success: false,
        message: "Failed to fetch monitoring statistics"
      };
    }
  }
};
