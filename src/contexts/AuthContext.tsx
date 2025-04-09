
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  createUserByAdmin: (name: string, email: string, password: string, isAdmin: boolean) => Promise<boolean>;
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
    
    // Verificar sessão do Supabase
    checkSupabaseSession();
  }, []);
  
  // Verificar sessão do Supabase ao iniciar
  const checkSupabaseSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error.message);
        return;
      }
      
      if (data.session) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (userError) {
          console.error('Erro ao buscar dados do usuário:', userError.message);
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
      console.error('Erro ao verificar sessão do Supabase:', error);
    }
  };

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Tentativa de login com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Erro de login Supabase:', error.message);
        
        // Fallback para o login local
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
      }
      
      // Login com Supabase bem-sucedido
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userError) {
          console.error('Erro ao buscar dados do usuário:', userError.message);
          toast.error('Erro ao buscar dados do usuário');
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
        toast.success(`Bem-vindo, ${currentUser.name}!`);
        return true;
      }
      
      return false;
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
      // Tentar registrar no Supabase
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
        console.error('Erro no registro Supabase:', error.message);
        
        // Fallback para registro local
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
      }
      
      // Registro no Supabase bem-sucedido
      if (data.user) {
        // Inserir dados adicionais na tabela de usuários
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
          console.error('Erro ao inserir dados do usuário:', insertError.message);
          toast.error('Erro ao completar o cadastro');
          return false;
        }
        
        // Criar usuário local para manter consistência
        const newUser = {
          id: data.user.id,
          name,
          email,
          isAdmin: false,
        };
        
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        toast.success('Cadastro realizado com sucesso!');
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('Erro ao cadastrar usuário');
      console.error('Erro no cadastro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      // Logout do Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout do Supabase:', error);
    }
    
    // Limpar dados locais
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.info('Você saiu da sua conta');
  };

  // Função para obter todos os usuários (apenas para admins)
  const getAllUsers = (): User[] => {
    if (!user?.isAdmin) return [];
    
    // Tentar buscar usuários do Supabase
    const fetchSupabaseUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');
          
        if (error) {
          console.error('Erro ao buscar usuários do Supabase:', error.message);
          return;
        }
        
        if (data && data.length > 0) {
          // Mapear dados do Supabase para o formato esperado
          const formattedUsers = data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            isAdmin: u.is_admin || false,
          }));
          
          return formattedUsers;
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
      
      return null;
    };
    
    // Usar usuários locais como fallback
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  };

  // Função para atualizar o status de admin de um usuário
  const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
    // Verificar se o usuário atual é admin
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para realizar esta ação');
      return false;
    }
    
    try {
      // Tentar atualizar no Supabase primeiro
      const { error } = await supabase
        .from('users')
        .update({ is_admin: isAdmin })
        .eq('id', userId);
        
      if (error) {
        console.error('Erro ao atualizar status de admin no Supabase:', error.message);
        
        // Fallback para atualização local
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
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      return false;
    }
  };
  
  // Nova função para criar usuário pelo administrador
  const createUserByAdmin = async (
    name: string, 
    email: string, 
    password: string, 
    isAdmin: boolean
  ): Promise<boolean> => {
    // Verificar se o usuário atual é admin
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para realizar esta ação');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Tentar criar usuário no Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });
      
      if (error) {
        console.error('Erro ao criar usuário no Supabase:', error.message);
        
        // Fallback para criação local
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
          isAdmin,
        };
        
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        toast.success('Usuário criado com sucesso!');
        return true;
      }
      
      // Criação no Supabase bem-sucedida
      if (data.user) {
        // Inserir dados adicionais na tabela de usuários
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
          console.error('Erro ao inserir dados do usuário:', insertError.message);
          toast.error('Erro ao completar o cadastro do usuário');
          return false;
        }
        
        toast.success('Usuário criado com sucesso!');
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('Erro ao criar usuário');
      console.error('Erro na criação de usuário:', error);
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

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
