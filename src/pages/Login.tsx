
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Leaf, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        navigate('/map');
      } else {
        toast({
          title: "Falha no login",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao processar seu login. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const setAdminCredentials = () => {
    setEmail('admin@terraverde.com');
    setPassword('admin@123');
  };

  const setUserCredentials = () => {
    setEmail('usuario@terraverde.com');
    setPassword('usuario@123');
  };

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-eco-sand/30">
      <div className="container px-4 py-8 flex flex-col items-center">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <Leaf className="h-8 w-8 text-eco-green" />
          <span className="font-semibold text-xl text-eco-green-dark">Terra Verde Conectada</span>
        </Link>

        <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-eco-green-dark">Entrar</h1>
              <p className="text-muted-foreground mt-2">
                Acesse sua conta para contribuir com o mapa ecológico
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-eco-green hover:bg-eco-green-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-eco-green-dark hover:underline font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-center font-semibold text-sm text-eco-green-dark mb-4">
                Credenciais Disponíveis
              </h3>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={setAdminCredentials} 
                  variant="outline" 
                  size="sm"
                  className="w-full border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
                >
                  Usar credenciais de Administrador
                </Button>
                
                <Button 
                  onClick={setUserCredentials} 
                  variant="outline"
                  size="sm"
                  className="w-full border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
                >
                  Usar credenciais de Usuário Padrão
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
