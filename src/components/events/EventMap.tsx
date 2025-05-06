
import { useState } from 'react';
import EcoMap from '@/components/EcoMap';
import { useEventStore } from '@/hooks/useEventStore';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const EventMap = () => {
  const { events, isLoading } = useEventStore();
  const [searchQuery, setSearchQuery] = useState('');

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
      
      <div className="h-[70vh] w-full relative rounded-xl overflow-hidden shadow-2xl">
        {/* Add soft gradient overlay for better blending */}
        <div className="absolute inset-0 bg-gradient-to-br from-eco-green/5 to-eco-blue/5 z-0 opacity-70 pointer-events-none"></div>
        <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
        
        <EcoMap hideControls={false} eventMode={true} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default EventMap;
