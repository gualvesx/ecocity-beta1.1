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
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user; // Obter o objeto User

    // 2. Atualizar o perfil do usuário com o nome (OPCIONAL, MAS COMUM)
    if (user) {
      await user.updateProfile({
        displayName: name
        // photoURL: ... // Você pode adicionar uma foto aqui se tiver
      });
      console.log(`API: Perfil do usuário ${user.uid} atualizado com nome: ${name}`);
    }


    // **Observação:** As funções 'updateUserAdmin' e 'convertToContextUser' não são funções padrão do SDK do Firebase Auth
    // Se 'firebaseAuth' é um wrapper customizado, a lógica para admin e conversão deve estar implementada dentro dele.
    // Geralmente, o gerenciamento de funções (como admin) é feito no lado do servidor (por exemplo, com Cloud Functions
    // e o Admin SDK) definindo Custom Claims, pois é mais seguro do que a lógica no cliente.

    // Exemplo (ASSUMINDO QUE SEU WRAPPER firebaseAuth TEM updateAdminStatus e convertUser):
    if (isAdmin && firebaseAuth.updateAdminStatus) { // Verifique se a função existe no seu wrapper
       console.log(`API: Setting user ${user.uid} as admin`);
       // Esta função customizada provavelmente chama o Admin SDK no backend
       await firebaseAuth.updateAdminStatus(user.uid, true);
    }

    // 3. Converter para o seu tipo de usuário customizado (ASSUMINDO QUE SEU WRAPPER TEM convertUser)
    const appUser = firebaseAuth.convertUser ? firebaseAuth.convertUser(user) : user; // Use seu wrapper se existir

    console.log("API: Created user:", appUser);

    if (!appUser) {
      throw new Error("Failed to process user data after creation"); // Mensagem ajustada
    }

    // Wait for potential backend writes like admin status (if done in backend)
    // The setTimeout might be needed depending on your backend logic flow,
    // but relying on promises from backend calls is generally better.
    // await new Promise(resolve => setTimeout(resolve, 500));


    return {
      success: true,
      data: appUser as User // Ajuste de tipo se necessário
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
                userMessage = `Falha ao criar usuário: ${error.message}`;
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
