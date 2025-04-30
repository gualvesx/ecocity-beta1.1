#🌱 Ecologia
## EcoCity - Mapeamento Sustentável de Resíduos

**URL**: https://test-green-iota-34.vercel.app/

Bem-vindo ao EcoCity, um projeto web inovador que conecta pessoas a pontos de coleta de lixo eletrônico, lâmpadas e materiais recicláveis em suas cidades. Nosso objetivo é promover a sustentabilidade e facilitar o descarte correto, reduzindo impactos ambientais

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/gualvesx/EcoCity.git

# Step 2: Navigate to the project directory.
cd EcoCity

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eca389c4-ae91-4d03-b97c-0b1d4a7494cc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvuILIDo5uxxkX4SRo1rkMGN3EVKf_cRQ",
  authDomain: "ecocity-801cc.firebaseapp.com",
  projectId: "ecocity-801cc",
  storageBucket: "ecocity-801cc.firebasestorage.app",
  messagingSenderId: "825751292076",
  appId: "1:825751292076:web:11dcde0f9a5d153b64b709",
  measurementId: "G-9NQK92Q42X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

--

npm install firebase
npm install -g firebase-tools

É possível implantar agora ou depois. Para implantar agora, abra uma janela de terminal e navegue ou crie um diretório raiz a partir do seu app da Web.

Faça login no Google
firebase login
Iniciar seu projeto
Execute este comando do diretório raiz do seu app:

firebase init
Quando tudo estiver pronto, implante seu app da Web
Inclua seus arquivos estáticos (por exemplo, HTML, CSS, JS) no diretório de implantação do app (o padrão é "público"). Em seguida, execute este comando no diretório raiz dele:

firebase deploy
