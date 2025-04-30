
// Importa a configuração do Firebase da configuração central
import { app } from '@/config/firebase';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Inicializa os serviços do Firebase
export const auth = getAuth(app);
export const firestore = getFirestore(app);
