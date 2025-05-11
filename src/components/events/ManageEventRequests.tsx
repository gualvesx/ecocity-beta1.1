
import React, { useEffect } from 'react';
import { useEventRequests } from '@/hooks/useEventRequests';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, X, Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EventStatus } from '@/types/events';

export const ManageEventRequests: React.FC = () => {
  const { 
    eventRequests, 
    isLoading, 
    error, 
    removeEventRequest, 
    approveRequest,
    rejectRequest,
    refreshRequests 
  } = useEventRequests();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.isAdmin) {
      refreshRequests();
    }
  }, [user?.isAdmin, refreshRequests]);
  
  if (!user?.isAdmin) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Você precisa ter permissões de administrador para acessar esta página.
        </p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2 text-muted-foreground">Carregando solicitações de eventos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erro ao carregar solicitações: {error.message}</p>
        <Button onClick={refreshRequests} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  if (eventRequests.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Não há solicitações de eventos pendentes.
        </p>
      </div>
    );
  }
  
  const getStatusBadge = (status?: EventStatus) => {
    switch (status) {
      case EventStatus.APPROVED:
        return <Badge className="bg-green-600">Aprovado</Badge>;
      case EventStatus.REJECTED:
        return <Badge className="bg-red-600">Rejeitado</Badge>;
      case EventStatus.PENDING:
      default:
        return <Badge className="bg-yellow-600">Pendente</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-eco-green-dark">
          Solicitações de Eventos
        </h2>
        <Button onClick={refreshRequests} variant="outline" size="sm">
          Atualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventRequests.map(request => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{request.title}</CardTitle>
                {getStatusBadge(request.status)}
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {request.date}
              </CardDescription>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {request.time}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <p className="text-sm text-gray-700 mb-2">{request.description}</p>
              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{request.address}</span>
              </div>
              <p className="text-sm mt-2">
                <span className="font-medium">Organizador:</span> {request.organizer}
              </p>
            </CardContent>
            
            <CardFooter className="pt-2 flex justify-end gap-2">
              {request.status === EventStatus.PENDING && (
                <>
                  <Button
                    onClick={() => rejectRequest(request.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Recusar
                  </Button>
                  
                  <Button
                    onClick={() => approveRequest(request.id)}
                    size="sm"
                    className="bg-eco-green hover:bg-eco-green-dark"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                </>
              )}
              
              {request.status !== EventStatus.PENDING && (
                <Button
                  onClick={() => removeEventRequest(request.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remover
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
