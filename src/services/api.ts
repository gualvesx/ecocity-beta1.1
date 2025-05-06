import { firebaseAuth } from './firebaseAuth';
import { firebaseFirestore } from './firebaseFirestore';
import { User } from '@/contexts/AuthContext';
import { Event, EventRequest } from '@/hooks/useEventStore';

// Interfaces de resposta da API
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Environmental monitoring stats (mock data for UI)
interface EnvironmentalStats {
  hectaresMonitored: number;
  riskAreasIdentified: number;
  deforestationAlerts: number;
  airQualityIndex: number;
}

// Mock environmental API
export const environmentApi = {
  getMonitoringStats: async (): Promise<ApiResponse<EnvironmentalStats>> => {
    try {
      // This is a mock implementation that returns hardcoded values
      // In a real application, this would connect to Firebase
      return {
        success: true,
        data: {
          hectaresMonitored: 5822,
          riskAreasIdentified: 42,
          deforestationAlerts: 127,
          airQualityIndex: 61
        }
      };
    } catch (error) {
      console.error('Error fetching environmental stats:', error);
      return {
        success: false,
        message: 'Failed to fetch environmental data'
      };
    }
  }
};

// API de usuários - Fixed implementation
export const userApi = {
  // Obter todos os usuários
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      console.log("API: Buscando todos os usuários");
      
      const users = await firebaseAuth.getAllUsers();
      console.log("API: Users retrieved:", users);
      
      return {
        success: true,
        data: users
      };
    } catch (error) {
      console.error("API error fetching users:", error);
      return {
        success: false,
        message: "Falha ao buscar usuários"
      };
    }
  },
  
  // Obter usuário por ID
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      console.log(`API: Buscando usuário com ID ${userId}`);
      
      const users = await firebaseAuth.getAllUsers();
      console.log("API: All users for finding by ID:", users);
      
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        console.log(`API: User with ID ${userId} not found`);
        return {
          success: false,
          message: "Usuário não encontrado"
        };
      }
      
      console.log(`API: User found:`, user);
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error(`API error fetching user ${userId}:`, error);
      return {
        success: false,
        message: "Falha ao buscar usuário"
      };
    }
  },
  
// Criar usuário (somente admin)
createUser: async (
  name: string,
  email: string,
  password: string,
  isAdmin: boolean
): Promise<ApiResponse<User>> => {
  try {
    console.log(`API: Criando usuário ${email} com isAdmin=${isAdmin}`);

    // 1. Criar o usuário com email e senha (CORRIGIDO)
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
    const user = userCredential.user; // Obter o objeto User

    // No need to update profile here as it's handled in firebaseAuth.createUserWithEmailAndPassword

    // Set admin status if needed
    if (isAdmin) { 
       console.log(`API: Setting user ${user.uid} as admin`);
       await firebaseAuth.updateUserAdmin(user.uid, true);
    }

    // Get the user with updated data
    const appUser = await firebaseAuth.convertToContextUser(user);

    console.log("API: Created user:", appUser);

    if (!appUser) {
      throw new Error("Failed to process user data after creation");
    }

    return {
      success: true,
      data: appUser
    };
  } catch (error) {
    console.error("API error creating user:", error);
    // Tratamento de erros específicos do Auth
    let userMessage = "Falha ao criar usuário";
    if (error && typeof error === 'object' && 'code' in error) {
        switch ((error as any).code) {
            case 'auth/email-already-in-use':
                userMessage = 'Este email já está em uso.';
                break;
            case 'auth/invalid-email':
                userMessage = 'O formato do email é inválido.';
                break;
            case 'auth/operation-not-allowed':
                userMessage = 'Autenticação por Email/Senha não está ativada. Habilite no Console Firebase.';
                break;
            case 'auth/weak-password':
                userMessage = 'A senha é muito fraca.';
                break;
            default:
                userMessage = `Falha ao criar usuário: ${(error as any).message}`;
                break;
        }
    }

    return {
      success: false,
      message: userMessage // Use a mensagem de erro tratada ou a original
    };
  }
},
  
  // Atualizar status de admin do usuário
  updateUserAdmin: async (
    userId: string, 
    isAdmin: boolean
  ): Promise<ApiResponse<null>> => {
    try {
      console.log(`API: Atualizando usuário ${userId} para status de admin: ${isAdmin}`);
      
      await firebaseAuth.updateUserAdmin(userId, isAdmin);
      console.log(`API: User ${userId} admin status updated successfully`);
      
      return {
        success: true
      };
    } catch (error) {
      console.error(`API error updating user ${userId}:`, error);
      return {
        success: false,
        message: "Falha ao atualizar usuário"
      };
    }
  }
};

// API de autenticação
export const authApi = {
  // Login
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      console.log(`API: Tentativa de login para ${email}`);
      
      const { user } = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const appUser = await firebaseAuth.convertToContextUser(user);
      
      if (!appUser) {
        throw new Error("Falha ao converter dados do usuário");
      }
      
      return {
        success: true,
        data: appUser
      };
    } catch (error) {
      console.error("API login error:", error);
      return {
        success: false,
        message: "Email ou senha inválidos"
      };
    }
  },
  
  // Registro
  register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      console.log(`API: Tentativa de registro para ${email}`);
      
      const { user } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
      const appUser = await firebaseAuth.convertToContextUser(user);
      
      if (!appUser) {
        throw new Error("Falha ao converter dados do usuário");
      }
      
      return {
        success: true,
        data: appUser
      };
    } catch (error) {
      console.error("API registration error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Falha no registro"
      };
    }
  },
  
  // Logout
  logout: async (): Promise<ApiResponse<null>> => {
    try {
      console.log("API: Tentativa de logout");
      
      await firebaseAuth.signOut();
      
      return {
        success: true
      };
    } catch (error) {
      console.error("API logout error:", error);
      return {
        success: false,
        message: "Falha ao fazer logout"
      };
    }
  }
};

// API de eventos
export const eventApi = {
  // Obter todos os eventos
  getAllEvents: async (): Promise<ApiResponse<Event[]>> => {
    try {
      console.log("API: Buscando todos os eventos");
      
      const events = await firebaseFirestore.events.getAll();
      
      return {
        success: true,
        data: events
      };
    } catch (error) {
      console.error("API error fetching events:", error);
      return {
        success: false,
        message: "Falha ao buscar eventos"
      };
    }
  },
  
  // Adicionar evento
  addEvent: async (eventData: Omit<Event, 'id'>): Promise<ApiResponse<Event>> => {
    try {
      console.log("API: Adicionando novo evento");
      
      const event = await firebaseFirestore.events.add(eventData);
      
      return {
        success: true,
        data: event
      };
    } catch (error) {
      console.error("API error adding event:", error);
      return {
        success: false,
        message: "Falha ao adicionar evento"
      };
    }
  },
  
  // Obter solicitações de eventos
  getEventRequests: async (): Promise<ApiResponse<EventRequest[]>> => {
    try {
      console.log("API: Buscando solicitações de eventos");
      
      const requests = await firebaseFirestore.eventRequests.getAll();
      
      return {
        success: true,
        data: requests
      };
    } catch (error) {
      console.error("API error fetching event requests:", error);
      return {
        success: false,
        message: "Falha ao buscar solicitações de eventos"
      };
    }
  },
  
  // Adicionar solicitação de evento
  addEventRequest: async (requestData: Omit<EventRequest, 'id'>): Promise<ApiResponse<EventRequest>> => {
    try {
      console.log("API: Adicionando nova solicitação de evento");
      
      const request = await firebaseFirestore.eventRequests.add(requestData);
      
      return {
        success: true,
        data: request
      };
    } catch (error) {
      console.error("API error adding event request:", error);
      return {
        success: false,
        message: "Falha ao adicionar solicitação de evento"
      };
    }
  }
};
