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
import CreateSquadPage from "./pages/CreateSquad";
import ProfilePage from "./pages/ProfilePage";
import SquadDetailPage from "./pages/SquadDetailPage";
import StravaConnectionPage from "./pages/StravaConnection";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/useAuth";
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import SupabaseTestPage from './pages/SupabaseTestPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HelmetProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/test" element={<SupabaseTestPage />} />
                <Route path="/squads" element={<Squads />} />
                <Route path="/squads/:squadId" element={<SquadDetailPage />} /> 
                <Route path="/squads/criar" element={<ProtectedRoute><CreateSquadPage /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/strava" element={<ProtectedRoute><StravaConnectionPage /></ProtectedRoute>} />
                <Route path="/hall" element={<Hall />} />
                <Route path="/mural" element={<Mural />} />
                <Route path="/parceiros" element={<Parceiros />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HelmetProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;