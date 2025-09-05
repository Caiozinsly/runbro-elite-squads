// supabase/functions/strava-callback/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Trata a requisição pre-flight de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    // 1. O utilizador deve estar logado na RunBro para iniciar a conexão
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("Utilizador não autenticado na RunBro.");
    }

    // 2. Extrair o 'code' temporário que o Strava nos envia
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      throw new Error("Código de autorização do Strava não encontrado.");
    }

    // 3. Trocar o 'code' pelos tokens de acesso no Strava
    const stravaResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: Deno.env.get("STRAVA_CLIENT_ID"),
        client_secret: Deno.env.get("STRAVA_CLIENT_SECRET"),
        code: code,
        grant_type: "authorization_code",
      }),
    });

    if (!stravaResponse.ok) {
      const errorBody = await stravaResponse.json();
      throw new Error(`Erro ao obter tokens do Strava: ${errorBody.message}`);
    }

    const stravaData = await stravaResponse.json();
    const { access_token, refresh_token, expires_at, athlete } = stravaData;

    // 4. Guardar os tokens na nossa base de dados
    // Usamos um cliente com service_role para poder escrever na tabela 'profiles'
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        strava_access_token: access_token,
        strava_refresh_token: refresh_token,
        strava_token_expires_at: new Date(expires_at * 1000).toISOString(),
        strava_athlete_id: athlete.id.toString(),
      })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    // 5. Redirecionar o utilizador de volta para a sua página de perfil
    const redirectTo = `${Deno.env.get("VITE_SITE_URL") || 'http://localhost:8080'}/perfil`;
    return new Response(null, {
      status: 302, // Status de redirecionamento
      headers: { ...CORS_HEADERS, Location: redirectTo },
    });

  } catch (error) {
    console.error("Erro no callback do Strava:", error);
    // Redireciona para uma página de erro se algo falhar
    const errorRedirectTo = `${Deno.env.get("VITE_SITE_URL") || 'http://localhost:8080'}/perfil?error=${encodeURIComponent(error.message)}`;
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json", Location: errorRedirectTo },
    });
  }
});