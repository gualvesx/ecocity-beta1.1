
import { neonSimulation } from './neonService';
import { User } from '@/contexts/AuthContext';

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
      
      const users = await neonSimulation.getUsers();
      const filteredUsers = users.map(({ password, ...rest }) => rest);
      
      return {
        success: true,
        data: filteredUsers
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
      
      const users = await neonSimulation.getUsers();
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found"
        };
      }
      
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        data: userWithoutPassword
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
      
      const result = await neonSimulation.createUser(name, email, password, isAdmin);
      
      return {
        success: true,
        data: result.user
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
      
      await neonSimulation.updateUserAdmin(userId, isAdmin);
      
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
      
      // Simulate user deletion
      const users = await neonSimulation.getUsers();
      const filteredUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      
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
      
      const result = await neonSimulation.login(email, password);
      
      return {
        success: true,
        data: result.user
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
      
      const result = await neonSimulation.register(name, email, password);
      
      return {
        success: true,
        data: result.user
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
      
      await neonSimulation.logout();
      
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
