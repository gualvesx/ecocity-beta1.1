
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Loader2, MapPin, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useEventStore } from '@/hooks/useEventStore';

export function EventRequests() {
  const { eventRequests, approveEventRequest, rejectEventRequest, fetchEventRequests } = useEventStore();
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadRequests = async () => {
      try {
        await fetchEventRequests();
      } catch (error) {
        console.error('Error loading event requests:', error);
        toast.error("Erro ao carregar solicitações de eventos");
      } finally {
        setLoading(false);
      }
    };
    
    loadRequests();
  }, [fetchEventRequests]);
  
  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await approveEventRequest(requestId);
      toast.success("Evento aprovado com sucesso!");
    } catch (error) {
      console.error('Error approving event request:', error);
      toast.error("Erro ao aprovar evento");
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await rejectEventRequest(requestId);
      toast.success("Solicitação rejeitada");
    } catch (error) {
      console.error('Error rejecting event request:', error);
      toast.error("Erro ao rejeitar solicitação");
    } finally {
      setProcessingId(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-eco-green" />
      </div>
    );
  }
  
  if (eventRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma solicitação pendente</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {eventRequests.map((request) => {
        const eventDate = new Date(request.date);
        const isProcessing = processingId === request.id;
        
        return (
          <Card key={request.id} className="p-4 relative">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{request.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {format(eventDate, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Pendente
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 shrink-0 mt-0.5 text-eco-green" />
                <span>{request.time}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-eco-green" />
                <span>{request.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 shrink-0 mt-0.5 text-eco-green" />
                <span>{request.organizer}</span>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <p className="text-sm mb-4">
              {request.description}
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-green-200 bg-green-50 hover:bg-green-100 text-green-700"
                onClick={() => handleApprove(request.id)}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4 mr-1" />}
                Aprovar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
                onClick={() => handleReject(request.id)}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsDown className="h-4 w-4 mr-1" />}
                Rejeitar
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
