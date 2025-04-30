
import { MapPoint } from '@/types/map';
import { Event, EventRequest } from '@/hooks/useEventStore';
import { EnvironmentalData, EnvironmentalRisk, getCurrentEnvironmentalData, getAllEnvironmentalRisks, getMonitoringStats } from './envData';

// Types for Firestore documents
interface FirestoreDoc {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface MapPointDoc extends FirestoreDoc {
  name: string;
  type: string;
  lat: number;
  lng: number;
  description: string;
  impact: string;
  address: string;
  createdBy: string;
}

interface EventDoc extends FirestoreDoc {
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  organizer: string;
  lat: number;
  lng: number;
  createdBy: string;
}

interface EventRequestDoc extends FirestoreDoc {
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  organizer: string;
  createdBy: string;
}

interface EnvironmentalDataDoc extends EnvironmentalData, FirestoreDoc {}
interface EnvironmentalRiskDoc extends EnvironmentalRisk, FirestoreDoc {}

// Sample data for initial database
const sampleMapPoints: MapPointDoc[] = [
  {
    id: "1",
    name: "Ponto de Coleta Seletiva - Centro",
    type: "recycling-point",
    lat: -22.123456,
    lng: -51.345678,
    description: "Ponto de coleta de materiais recicláveis no centro da cidade.",
    impact: "Redução de resíduos enviados ao aterro sanitário.",
    address: "Praça Central, Centro",
    createdBy: "admin-uid-123",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-01T10:00:00Z"
  },
  {
    id: "2",
    name: "Centro de Reciclagem Municipal",
    type: "recycling-center",
    lat: -22.125678,
    lng: -51.323456,
    description: "Centro municipal de reciclagem com capacidade para processar diversos tipos de materiais.",
    impact: "Processamento de 10 toneladas diárias de material reciclável.",
    address: "Rua Ambiental, 1000, Bairro Verde",
    createdBy: "admin-uid-123",
    createdAt: "2025-04-02T14:30:00Z",
    updatedAt: "2025-04-02T14:30:00Z"
  },
  {
    id: "3",
    name: "Distribuição de Mudas - Parque Ecológico",
    type: "seedling-distribution",
    lat: -22.127890,
    lng: -51.367890,
    description: "Local de distribuição gratuita de mudas de árvores nativas.",
    impact: "Aumento da cobertura vegetal urbana e educação ambiental.",
    address: "Parque Ecológico Municipal, Av. das Árvores, s/n",
    createdBy: "admin-uid-123",
    createdAt: "2025-04-03T09:15:00Z",
    updatedAt: "2025-04-03T09:15:00Z"
  }
];

const sampleEvents: EventDoc[] = [
  {
    id: "1",
    title: "Plantio de Árvores no Parque Ecológico",
    description: "Venha participar do nosso evento de plantio de árvores no Parque Ecológico da cidade. Traga sua família e amigos para esta importante ação ambiental.",
    date: "2025-05-15",
    time: "09:00",
    address: "Parque Ecológico, Avenida Brasil, 1000",
    organizer: "Associação Ambiental Verde Vivo",
    lat: -22.125092,
    lng: -51.379639,
    createdBy: "admin-uid-123",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-01T10:00:00Z"
  },
  {
    id: "2",
    title: "Palestra sobre Sustentabilidade",
    description: "Palestra com especialistas sobre práticas sustentáveis que podemos implementar em nosso dia a dia.",
    date: "2025-05-20",
    time: "19:00",
    address: "Auditório da Universidade FCT Unesp",
    organizer: "Grupo Acadêmico de Ecologia",
    lat: -22.120092,
    lng: -51.409639,
    createdBy: "admin-uid-123",
    createdAt: "2025-04-05T14:30:00Z",
    updatedAt: "2025-04-05T14:30:00Z"
  }
];

// Database state
const firestoreState = {
  mapPoints: [...sampleMapPoints],
  events: [...sampleEvents],
  eventRequests: [] as EventRequestDoc[],
  environmentalData: null as EnvironmentalDataDoc | null,
  environmentalRisks: [] as EnvironmentalRiskDoc[]
};

// Collection reference creator
const collection = <T>(collectionName: string) => {
  const getCollection = () => {
    switch(collectionName) {
      case 'mapPoints':
        return firestoreState.mapPoints as T[];
      case 'events':
        return firestoreState.events as T[];
      case 'eventRequests':
        return firestoreState.eventRequests as T[];
      case 'environmentalRisks':
        return firestoreState.environmentalRisks as T[];
      default:
        throw new Error(`Collection ${collectionName} not found`);
    }
  };

  const setCollection = (data: T[]) => {
    switch(collectionName) {
      case 'mapPoints':
        firestoreState.mapPoints = data as any;
        break;
      case 'events':
        firestoreState.events = data as any;
        break;
      case 'eventRequests':
        firestoreState.eventRequests = data as any;
        break;
      case 'environmentalRisks':
        firestoreState.environmentalRisks = data as any;
        break;
      default:
        throw new Error(`Collection ${collectionName} not found`);
    }
  };

  return {
    // Get all documents in a collection
    get: async () => {
      console.log(`Getting documents from ${collectionName} collection`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        docs: getCollection().map(doc => ({
          id: (doc as any).id,
          data: () => doc
        }))
      };
    },
    
    // Get a document by ID
    doc: (id: string) => {
      return {
        get: async () => {
          console.log(`Getting document ${id} from ${collectionName} collection`);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const doc = getCollection().find(d => (d as any).id === id);
          
          if (!doc) {
            return { exists: false };
          }
          
          return {
            exists: true,
            data: () => doc
          };
        },
        
        // Update a document
        update: async (data: Partial<T>) => {
          console.log(`Updating document ${id} in ${collectionName} collection`);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const collection = getCollection();
          const index = collection.findIndex(d => (d as any).id === id);
          
          if (index === -1) {
            throw new Error(`Document ${id} not found in ${collectionName}`);
          }
          
          collection[index] = {
            ...collection[index],
            ...data,
            updatedAt: new Date().toISOString()
          };
          
          setCollection(collection);
          
          return { id };
        },
        
        // Delete a document
        delete: async () => {
          console.log(`Deleting document ${id} from ${collectionName} collection`);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const collection = getCollection();
          const filtered = collection.filter(d => (d as any).id !== id);
          
          if (filtered.length === collection.length) {
            throw new Error(`Document ${id} not found in ${collectionName}`);
          }
          
          setCollection(filtered);
        }
      };
    },
    
    // Add a new document
    add: async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log(`Adding document to ${collectionName} collection`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const now = new Date().toISOString();
      const newDoc = {
        ...data,
        id: `${collectionName}-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      } as T;
      
      const collection = getCollection();
      setCollection([...collection, newDoc]);
      
      return {
        id: (newDoc as any).id,
        get: async () => {
          return {
            exists: true,
            data: () => newDoc
          };
        }
      };
    },
    
    // Query a collection
    where: (field: string, operator: string, value: any) => {
      return {
        get: async () => {
          console.log(`Querying ${collectionName} where ${field} ${operator} ${value}`);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const collection = getCollection();
          let filteredDocs = collection;
          
          switch (operator) {
            case '==':
              filteredDocs = collection.filter(doc => (doc as any)[field] === value);
              break;
            case '!=':
              filteredDocs = collection.filter(doc => (doc as any)[field] !== value);
              break;
            case '>':
              filteredDocs = collection.filter(doc => (doc as any)[field] > value);
              break;
            case '>=':
              filteredDocs = collection.filter(doc => (doc as any)[field] >= value);
              break;
            case '<':
              filteredDocs = collection.filter(doc => (doc as any)[field] < value);
              break;
            case '<=':
              filteredDocs = collection.filter(doc => (doc as any)[field] <= value);
              break;
            case 'array-contains':
              filteredDocs = collection.filter(doc => 
                Array.isArray((doc as any)[field]) && (doc as any)[field].includes(value)
              );
              break;
            default:
              throw new Error(`Unsupported operator: ${operator}`);
          }
          
          return {
            docs: filteredDocs.map(doc => ({
              id: (doc as any).id,
              data: () => doc
            }))
          };
        }
      };
    }
  };
};

// Simulated Firestore instance
export const firebaseFirestore = {
  // Get a collection reference
  collection: <T>(collectionName: string) => {
    return collection<T>(collectionName);
  },
  
  // Initialize environmental data (loaded once)
  initEnvironmentalData: async () => {
    if (firestoreState.environmentalData !== null) {
      return;
    }
    
    console.log("Initializing environmental data");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const envData = getCurrentEnvironmentalData();
    const now = new Date().toISOString();
    
    firestoreState.environmentalData = {
      ...envData,
      id: "env-data-1",
      createdAt: now,
      updatedAt: now
    };
    
    // Initialize environmental risks
    const risks = getAllEnvironmentalRisks();
    firestoreState.environmentalRisks = risks.map((risk, index) => ({
      ...risk,
      id: `env-risk-${index + 1}`,
      createdAt: now,
      updatedAt: now
    }));
  },
  
  // Get the current environmental data
  getEnvironmentalData: async (): Promise<EnvironmentalDataDoc> => {
    if (firestoreState.environmentalData === null) {
      await firebaseFirestore.initEnvironmentalData();
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return firestoreState.environmentalData as EnvironmentalDataDoc;
  },
  
  // Get monitoring statistics
  getMonitoringStatistics: async () => {
    console.log("Getting monitoring statistics");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return getMonitoringStats();
  },
  
  // Convert Firestore MapPointDoc to MapPoint
  convertToMapPoint: (doc: MapPointDoc): MapPoint => {
    return {
      id: parseInt(doc.id),  // Convert to number for compatibility
      name: doc.name,
      type: doc.type as any, // Type assertion for compatibility
      lat: doc.lat,
      lng: doc.lng,
      description: doc.description,
      impact: doc.impact,
      address: doc.address
    };
  },
  
  // Convert Firestore EventDoc to Event
  convertToEvent: (doc: EventDoc): Event => {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      date: doc.date,
      time: doc.time,
      address: doc.address,
      organizer: doc.organizer,
      lat: doc.lat,
      lng: doc.lng,
      createdBy: doc.createdBy,
      createdAt: doc.createdAt
    };
  },
  
  // Convert Firestore EventRequestDoc to EventRequest
  convertToEventRequest: (doc: EventRequestDoc): EventRequest => {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      date: doc.date,
      time: doc.time,
      address: doc.address,
      organizer: doc.organizer,
      createdBy: doc.createdBy,
      createdAt: doc.createdAt
    };
  }
};
