// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Squads from "./pages/Squads";
import Hall from "./pages/Hall";
import Mural from "./pages/Mural";
import Parceiros from "./pages/Parceiros";
import CreateSquadPage from "./pages/CreateSquad"; // Importe a nova página
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/useAuth";
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HelmetProvider>
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/squads" element={<Squads />} />
              {/* Rota Protegida para Criar Squad */}
              <Route path="/squads/criar" element={<ProtectedRoute><CreateSquadPage /></ProtectedRoute>} />
              <Route path="/hall" element={<Hall />} />
              <Route path="/mural" element={<Mural />} />
              <Route path="/parceiros" element={<Parceiros />} />
              <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </>
        </HelmetProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
