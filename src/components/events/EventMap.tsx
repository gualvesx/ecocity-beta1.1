
import { useEffect, useState } from 'react';
import EcoMap from '@/components/EcoMap';
import { useEventStore } from '@/hooks/useEventStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

const EventMap = () => {
  const { events, isLoading } = useEventStore();
  const [searchQuery, setSearchQuery] = useState('');

  // The events will be passed to the map component 
  // which already has the rendering logic for map points

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar eventos no mapa..."
            className="pl-9 bg-white/90 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="h-[70vh] w-full">
        <EcoMap hideControls={false} eventMode={true} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default EventMap;
