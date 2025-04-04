
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Index";
import MapaEcologico from "./pages/EcologicalMap";
import Sobre from "./pages/About";
import Blog from "./pages/Blog";
import NaoEncontrado from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Inicio /></Layout>} />
          <Route path="/map" element={<Layout><MapaEcologico /></Layout>} />
          <Route path="/about" element={<Layout><Sobre /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
