
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, User, Leaf, Mail, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/map');
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
          </div>
        </div>

        <Card className="mt-8 p-6 max-w-md w-full border-eco-green">
          <h3 className="text-center font-semibold text-lg text-eco-green-dark mb-4">Credenciais de Acesso</h3>
          
          <div className="space-y-4">
            <div className="bg-eco-green/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Administrador
              </h4>
              <p><strong>Email:</strong> admin@terraverde.com</p>
              <p><strong>Senha:</strong> admin@123</p>
              <Button 
                onClick={setAdminCredentials} 
                variant="outline" 
                size="sm"
                className="mt-2 border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
              >
                Usar estas credenciais
              </Button>
            </div>
            
            <div className="bg-eco-sand/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Usuário Padrão
              </h4>
              <p><strong>Email:</strong> usuario@terraverde.com</p>
              <p><strong>Senha:</strong> usuario@123</p>
              <Button 
                onClick={setUserCredentials} 
                variant="outline"
                size="sm"
                className="mt-2 border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
              >
                Usar estas credenciais
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
