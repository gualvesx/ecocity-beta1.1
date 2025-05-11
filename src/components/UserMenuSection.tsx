
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, UserPlus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const UserMenuSection = ({ 
  onLogout, 
  onClose 
}: { 
  onLogout?: () => void,
  onClose?: () => void
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    if (onLogout) onLogout();
    if (onClose) onClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  if (isMobile) {
    return (
      <div className="px-4 py-4 border-t border-gray-100 mt-2 w-full">
        {user ? (
          <>
            <div className="flex items-center mb-3">
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
            
            {user.isAdmin && (
              <Button
                variant="outline" 
                size="sm"
                onClick={() => handleNavigate('/admin')}
                className="w-full text-eco-brown border-eco-brown hover:bg-eco-brown/10 mb-2"
              >
                <Shield className="h-4 w-4 mr-1" />
                {t('admin')}
              </Button>
            )}

            <Button
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="w-full text-red-500 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              {t('sair')}
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleNavigate('/login')}
              className="w-full bg-eco-green hover:bg-eco-green-dark"
            >
              <LogIn className="h-4 w-4 mr-1" />
              {t('entrar')}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigate('/register')}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {t('cadastrar')}
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
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
  );
};
