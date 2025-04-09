
import { User } from '@/contexts/AuthContext';

// Interface for Neon API responses
interface NeonApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface NeonLoginResponse {
  success: boolean;
  user: User;
  token?: string;
}

interface NeonUserResponse {
  success: boolean;
  user: User;
}

// Simulated Neon PostgreSQL connection and operations
export const neonSimulation = {
  isConnected: false,
  connectionDelay: 300, // Simulate network delay in ms
  
  // Simulate connection to Neon PostgreSQL
  connect: async (): Promise<NeonApiResponse<null>> => {
    console.log("Attempting to connect to Neon PostgreSQL...");
    
    // Add artificial delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, neonSimulation.connectionDelay));
    
    // Simulate successful connection 80% of the time
    const isSuccessful = Math.random() > 0.2;
    
    if (isSuccessful) {
      neonSimulation.isConnected = true;
      console.log("Connected to Neon PostgreSQL successfully!");
      return { success: true };
    } else {
      console.error("Failed to connect to Neon PostgreSQL");
      throw new Error("Connection to Neon PostgreSQL failed");
    }
  },
  
  // Simulate fetching users from Neon
  getUsers: async (): Promise<(User & { password: string })[]> => {
    console.log("Fetching users from Neon PostgreSQL...");
    
    if (!neonSimulation.isConnected) {
      await neonSimulation.connect();
    }
    
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, neonSimulation.connectionDelay));
    
    // Get users from localStorage for consistent simulation
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      console.log(`Retrieved ${users.length} users from Neon`);
      return users;
    }
    
    // Return empty array if no users found
    return [];
  },
  
  // Simulate user login with Neon
  login: async (email: string, password: string): Promise<NeonLoginResponse> => {
    console.log(`Attempting to login user ${email} with Neon...`);
    
    if (!neonSimulation.isConnected) {
      await neonSimulation.connect();
    }
    
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, neonSimulation.connectionDelay));
    
    // Check localStorage for users to maintain consistency
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const foundUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        console.log(`User ${email} logged in successfully with Neon`);
        return { 
          success: true, 
          user: userWithoutPassword,
          token: "simulated-neon-jwt-token-" + Date.now()
        };
      }
    }
    
    console.log(`Login failed for user ${email} with Neon`);
    throw new Error("Invalid email or password");
  },
  
  // Simulate user registration with Neon
  register: async (name: string, email: string, password: string): Promise<NeonUserResponse> => {
    console.log(`Attempting to register user ${email} with Neon...`);
    
    if (!neonSimulation.isConnected) {
      await neonSimulation.connect();
    }
    
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, neonSimulation.connectionDelay));
    
    // Check if email already exists in localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        console.log(`Registration failed: user ${email} already exists in Neon`);
        throw new Error("Email already registered");
      }
    }
    
    // Create new user
    const newUser = {
      id: `neon-${Date.now()}`,
      name,
      email,
      isAdmin: false,
    };
    
    // Store user in localStorage for persistence and consistency
    const newUserWithPassword = { ...newUser, password };
    const updatedUsers = storedUsers ? [...JSON.parse(storedUsers), newUserWithPassword] : [newUserWithPassword];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    console.log(`User ${email} registered successfully with Neon`);
    return { success: true, user: newUser };
  },
  
  // Simulate user logout with Neon
  logout: async (): Promise<NeonApiResponse<null>> => {
    console.log("Logging out from Neon...");
    
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, neonSimulation.connectionDelay));
    
    return { success: true };
  },
  
  // Simulate updating user admin status with Neon
  updateUserAdmin: async (userId: string, isAdmin: boolean): Promise<NeonApiResponse<null>> => {
    console.log(`Updating user ${userId} admin status to ${isAdmin} with Neon...`);
    
    if (!neonSimulation.isConnected) {
      await neonSimulation.connect();
    }
    
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, neonSimulation.connectionDelay));
    
    // Update user in localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => {
        if (u.id === userId) {
          return { ...u, isAdmin };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      console.log(`Updated user ${userId} admin status to ${isAdmin} in Neon`);
      return { success: true };
    }
    
    console.log(`Failed to update user ${userId} admin status in Neon`);
    throw new Error("User not found");
  },
  
  // Simulate creating a user by admin with Neon
  createUser: async (name: string, email: string, password: string, isAdmin: boolean): Promise<NeonUserResponse> => {
    console.log(`Creating user ${email} with Neon...`);
    
    if (!neonSimulation.isConnected) {
      await neonSimulation.connect();
    }
    
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, neonSimulation.connectionDelay));
    
    // Check if email already exists
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        console.log(`User creation failed: ${email} already exists in Neon`);
        throw new Error("Email already registered");
      }
    }
    
    // Create new user
    const newUser = {
      id: `neon-${Date.now()}`,
      name,
      email,
      isAdmin,
    };
    
    // Store user in localStorage
    const newUserWithPassword = { ...newUser, password };
    const updatedUsers = storedUsers ? [...JSON.parse(storedUsers), newUserWithPassword] : [newUserWithPassword];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    console.log(`User ${email} created successfully in Neon`);
    return { success: true, user: newUser };
  }
};
