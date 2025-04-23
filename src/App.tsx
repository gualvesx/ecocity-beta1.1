
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'sonner';
import Layout from '@/components/Layout';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const About = lazy(() => import('@/pages/About'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const MapaEcologico = lazy(() => import('@/pages/EcologicalMap'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading component
const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/map" element={<MapaEcologico />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Layout>
              <Toaster position="top-right" richColors closeButton />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
