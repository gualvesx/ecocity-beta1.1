
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';

// Tipos para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Tipos para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
  updateUserAdminStatus: (userId: string, isAdmin: boolean) => Promise<boolean>;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lista simulada de usuários
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

  // Inicializar com usuários existentes ou dummy users
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(dummyUsers);
      localStorage.setItem('users', JSON.stringify(dummyUsers));
    }

    // Verificar se existe usuário logado
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        toast.success(`Bem-vindo, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Email ou senha incorretos');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar se o email já está cadastrado
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error('Email já cadastrado');
        return false;
      }
      
      // Criar novo usuário
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
      
      // Logar o usuário automaticamente
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      toast.success('Cadastro realizado com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao cadastrar usuário');
      console.error('Erro no cadastro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.info('Você saiu da sua conta');
  };

  // Função para obter todos os usuários (apenas para admins)
  const getAllUsers = (): User[] => {
    if (!user?.isAdmin) return [];
    
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  };

  // Nova função para atualizar o status de admin de um usuário
  const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
    // Verificar se o usuário atual é admin
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para realizar esta ação');
      return false;
    }
    
    try {
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Encontrar o usuário a ser atualizado
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { ...u, isAdmin };
        }
        return u;
      });
      
      // Atualizar o estado e o localStorage
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Se o usuário alterado for o usuário atual, atualizar também seu estado
      if (user.id === userId) {
        const updatedUser = { ...user, isAdmin };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      return false;
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
      updateUserAdminStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
