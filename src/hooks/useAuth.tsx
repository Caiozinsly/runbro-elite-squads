// src/hooks/useauth.tsx - VERSÃO ATUALIZADA

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// ... (interface Profile continua a mesma)
interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  rank: string;
  cards_completados: number;
  km_percorridos: number;
}


// MODIFICADO: Adicionamos refreshProfile
interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: (options?: { redirectTo?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>; // NOVO
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // MODIFICADO: Usamos useCallback para otimizar a função de fetch
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    // ... (onAuthStateChange e getSession continuam os mesmos, mas agora usam a função otimizada)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) { fetchProfile(currentUser.id); } 
        else { setProfile(null); }
        setLoading(false);
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) { fetchProfile(currentUser.id); }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);
  
  // NOVO: Função para refrescar os dados do perfil manualmente
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // ... (signInWithGoogle e signOut permanecem iguais)
  const signInWithGoogle = async (options?: { redirectTo?: string }) => {/* ...código... */};
  const signOut = async () => {/* ...código... */};

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    refreshProfile, // NOVO
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { throw new Error("useAuth must be used within an AuthProvider"); }
  return context;
};
