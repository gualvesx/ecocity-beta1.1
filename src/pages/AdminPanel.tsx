
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { user, getAllUsers, updateUserAdminStatus } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirecionar se não for admin ou não estiver logado
    if (!user || !user.isAdmin) {
      navigate('/');
    } else {
      // Carregar a lista de usuários
      setUsers(getAllUsers());
    }
  }, [user, navigate, getAllUsers]);

  if (!user || !user.isAdmin) {
    return null;
  }

  const handleToggleAdmin = async (userId: string, makeAdmin: boolean) => {
    setIsLoading(true);
    try {
      const success = await updateUserAdminStatus(userId, makeAdmin);
      if (success) {
        toast.success(`Usuário ${makeAdmin ? 'promovido a administrador' : 'removido de administrador'} com sucesso!`);
        // Atualizar lista de usuários
        setUsers(getAllUsers());
      } else {
        toast.error('Falha ao atualizar status do usuário');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status do usuário');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <Link to="/map" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Mapa</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-eco-green" />
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Painel de Administração</h1>
          </div>
          
          <p className="text-lg text-muted-foreground">
            Gerencie usuários e tenha acesso a informações privilegiadas
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex items-center gap-3 p-6 border-b">
              <Users className="h-5 w-5 text-eco-green" />
              <h2 className="text-xl font-semibold">Usuários Cadastrados</h2>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Nome</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Tipo</th>
                      <th className="px-4 py-3 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-t">
                        <td className="px-4 py-3">{user.id}</td>
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-eco-green text-white">
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Usuário
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {user.isAdmin ? (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              disabled={isLoading || user.id === user.id}
                              onClick={() => handleToggleAdmin(user.id, false)}
                              className="text-xs"
                            >
                              <UserX className="h-3 w-3 mr-1" />
                              Remover Admin
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={isLoading}
                              onClick={() => handleToggleAdmin(user.id, true)}
                              className="text-xs"
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Tornar Admin
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
