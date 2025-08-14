import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

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

  return { signInWithGoogle, loading };
};
