
import { X, MapPinned, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapPoint } from '@/components/EcoMap';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddPointFormProps {
  newPointForm: {
    name: string;
    type: 'recycling-point' | 'recycling-center' | 'seedling-distribution';
    description: string;
    impact: string;
    address: string;
  };
  setNewPointForm: (form: any) => void;
  newPointPosition: { lat: number; lng: number } | null;
  setNewPointPosition: (position: { lat: number; lng: number } | null) => void;
  setIsAddingPoint: (isAdding: boolean) => void;
  handleAddNewPoint: () => void;
}

export const AddPointForm = ({
  newPointForm,
  setNewPointForm,
  newPointPosition,
  setNewPointPosition,
  setIsAddingPoint,
  handleAddNewPoint
}: AddPointFormProps) => {
  const { t } = useLanguage();

  return (
    <div className="absolute bottom-4 right-4 w-full max-w-md bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-eco-green-light/30 z-20">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">Adicionar Novo Ponto Ecológico</h3>
        <button 
          onClick={() => {
            setNewPointPosition(null);
            setIsAddingPoint(false);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nome do Local</label>
          <input
            type="text"
            value={newPointForm.name}
            onChange={(e) => setNewPointForm({...newPointForm, name: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ex: Ecoponto Vila Nova"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={newPointForm.type}
            onChange={(e) => setNewPointForm({...newPointForm, type: e.target.value as any})}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="recycling-point">{t('recycling-point')}</option>
            <option value="recycling-center">{t('recycling-center')}</option>
            <option value="seedling-distribution">{t('seedling-distribution')}</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <div className="relative">
            <MapPinned className="absolute left-2 top-2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={newPointForm.address}
              onChange={(e) => setNewPointForm({...newPointForm, address: e.target.value})}
              className="w-full p-2 pl-8 border border-gray-300 rounded"
              placeholder="Ex: Rua das Flores, 123 - Vila Nova"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {newPointPosition ? 
              "Você selecionou um ponto no mapa. O endereço é opcional." : 
              "Digite o endereço ou clique no mapa para selecionar um ponto."
            }
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={newPointForm.description}
            onChange={(e) => setNewPointForm({...newPointForm, description: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            rows={2}
            placeholder="Descreva este ponto ecológico"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Impacto Ambiental</label>
          <textarea
            value={newPointForm.impact}
            onChange={(e) => setNewPointForm({...newPointForm, impact: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            rows={2}
            placeholder="Qual o impacto positivo deste ponto?"
          ></textarea>
        </div>
        
        {newPointPosition && (
          <div className="text-xs text-muted-foreground mb-3">
            Coordenadas: Lat {newPointPosition.lat.toFixed(6)}, Lng {newPointPosition.lng.toFixed(6)}
          </div>
        )}
        
        <Button 
          onClick={handleAddNewPoint}
          className="w-full bg-eco-green hover:bg-eco-green-dark gap-1"
        >
          <Save size={16} />
          <span>Salvar Ponto Ecológico</span>
        </Button>
      </div>
    </div>
  );
};
