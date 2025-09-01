// src/integrations/supabase/client.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Variáveis de ambiente do Supabase não estão definidas.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,         // mantém a sessão entre reloads
    autoRefreshToken: true,       // renova token automaticamente
    detectSessionInUrl: true,     // útil para login via magic link
  },
});
