
import React, { useState } from 'react';
import { useEventRequests } from '@/hooks/useEventRequests';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const EventRequestForm: React.FC = () => {
  const { addEventRequest, isLoading } = useEventRequests();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [organizer, setOrganizer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para solicitar um evento');
      return;
    }
    
    if (!title || !description || !date || !time || !address || !organizer) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      const result = await addEventRequest({
        title,
        description,
        date,
        time,
        address,
        organizer
      });
      
      if (result) {
        // Clear form on success
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setAddress('');
        setOrganizer('');
        
        toast.success('Solicitação de evento enviada com sucesso!');
      }
    } catch (error) {
      console.error('Error submitting event request:', error);
      toast.error('Erro ao enviar solicitação de evento');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-eco-green-dark mb-4">Solicitar Novo Evento</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Título do Evento</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Limpeza da Praia"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o objetivo e detalhes do evento"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Endereço completo do evento"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="organizer">Organizador</Label>
          <Input
            id="organizer"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            placeholder="Nome da pessoa ou organização responsável"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-eco-green hover:bg-eco-green-dark"
          disabled={isLoading || !user}
        >
          {isLoading ? 'Enviando...' : 'Solicitar Evento'}
        </Button>
        
        {!user && (
          <p className="text-sm text-center text-red-500">
            Você precisa estar logado para solicitar eventos.
          </p>
        )}
      </form>
    </div>
  );
};
