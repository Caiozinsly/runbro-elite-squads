// Arquivo: src/components/auth/ProtectedRoute.tsx
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enquanto a autenticação está sendo verificada, não renderiza nada (ou um spinner)
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não há usuário e o carregamento terminou, redireciona para a home
  if (!user) {
    // Usamos 'replace' e 'state' para uma melhor experiência de usuário após o login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se o usuário existe, permite o acesso à página filha
  return <>{children}</>;
}
