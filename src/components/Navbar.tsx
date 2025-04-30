
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, LogIn, LogOut, User, UserPlus, Shield, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const navItems = [
    { name: t('Inicio'), path: '/' },
    { name: t('Mapa'), path: '/map' },
    { name: t('Eventos'), path: '/events' },
    { name: t('Blog'), path: '/blog' },
    { name: t('Sobre'), path: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-eco-green" />
          <span className="font-semibold text-xl text-eco-green-dark">EcoCity</span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "px-1 py-2 font-medium transition-colors relative group",
                    location.pathname === item.path 
                      ? "text-eco-green-dark" 
                      : "text-foreground/80 hover:text-eco-green-dark"
                  )}
                >
                  {item.name}
                  <span 
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-0.5 bg-eco-green-dark transform scale-x-0 transition-transform origin-left group-hover:scale-x-100",
                      location.pathname === item.path && "scale-x-100"
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="ml-8 flex items-center gap-3">
            {user ? (
              <>
                <div className="text-sm mr-2">
                  <span className="text-muted-foreground">{t('ola')}, </span>
                  <span className="font-medium text-foreground">{user.name}</span>
                  {user.isAdmin && (
                    <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-eco-green text-white">
                      {t('admin')}
                    </span>
                  )}
                </div>
                
                {user.isAdmin && (
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="text-eco-brown border-eco-brown hover:bg-eco-brown/10"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    {t('admin')}
                  </Button>
                )}
                
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {t('sair')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="text-foreground"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  {t('Cadastrar')}
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="bg-eco-green hover:bg-eco-green-dark"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  {t('Entrar')}
                </Button>
              </>
            )}
          </div>
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground focus:outline-none ml-2"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed top-[72px] right-0 left-0 bg-background/95 backdrop-blur-md md:hidden transition-transform transform duration-300 shadow-md z-50",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <ul className="flex flex-col space-y-1 p-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "block px-4 py-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-eco-green-light/20 text-eco-green-dark font-medium"
                    : "hover:bg-eco-green-light/10"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
          
          {user?.isAdmin && (
            <li>
              <Link
                to="/admin"
                className="block px-4 py-2 rounded-md transition-colors hover:bg-eco-green-light/10 flex items-center"
              >
                <Shield className="h-4 w-4 mr-2" />
                {t('painel-admin')}
              </Link>
            </li>
          )}
          
          <div className="border-t border-gray-100 my-2"></div>
          
          {user ? (
            <>
              <div className="px-4 py-2">
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t('ola')} </span>
                    <span className="font-medium text-foreground">{user.name}</span>
                    {user.isAdmin && (
                      <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-eco-green text-white">
                        {t('admin')}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="w-full text-red-500 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {t('sair')}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 p-4">
              <Button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full bg-eco-green hover:bg-eco-green-dark"
              >
                <LogIn className="h-4 w-4 mr-1" />
                {t('entrar')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/register');
                  setIsOpen(false);
                }}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {t('cadastrar')}
              </Button>
            </div>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
