import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// NOVO: Definimos uma interface para os dados do nosso perfil
interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  rank: string;
  cards_completados: number;
  km_percorridos: number;
}

// MODIFICADO: Adicionamos o "profile" ao tipo do nosso contexto
interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null; // NOVO
  loading: boolean;
  signInWithGoogle: (options?: { redirectTo?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // NOVO: Estado para guardar o perfil
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar o perfil do usuário
    const fetchProfile = async (userId: string) => {
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
    };

    // Listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        // MODIFICADO: Se o usuário logou, buscamos o perfil. Se deslogou, limpamos o perfil.
        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Verificação da sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // MODIFICADO: Também buscamos o perfil na verificação inicial
      if (currentUser) {
        fetchProfile(currentUser.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ... (funções signInWithGoogle e signOut permanecem iguais)
  const signInWithGoogle = async (options?: { redirectTo?: string }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: options?.redirectTo || window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao logar com Google:", err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile, // NOVO: Disponibilizamos o perfil no contexto
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
