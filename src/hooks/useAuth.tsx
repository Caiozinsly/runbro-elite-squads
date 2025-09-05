import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  points: number;
  created_at: string | null;
  updated_at: string | null;
  cards_completados: number;
  km_percorridos: number;
  // Colunas do Strava adicionadas
  strava_access_token?: string | null;
  strava_refresh_token?: string | null;
  strava_token_expires_at?: string | null;
  strava_athlete_id?: string | null;
}


interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: (options?: { redirectTo?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
      // Type assertion para garantir compatibilidade
      const profileData = data as any;
      const profile: Profile = {
        id: profileData.id,
        username: profileData.username,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        points: profileData.points || 0,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
        cards_completados: profileData.cards_completados || 0,
        km_percorridos: Number(profileData.km_percorridos) || 0,
      };
      setProfile(profile);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) { 
          fetchProfile(currentUser.id); 
        } else { 
          setProfile(null); 
        }
        setLoading(false);
      }
    );
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) { 
        fetchProfile(currentUser.id); 
      }
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, [fetchProfile]);
  
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signInWithGoogle = async (options?: { redirectTo?: string }) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: options?.redirectTo || window.location.origin,
      },
    });
    if (error) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  };

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
