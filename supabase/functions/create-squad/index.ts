import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.23.4/mod.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Schema de validação Zod para garantir a integridade dos dados
const SquadSchema = z.object({
  nome: z.string().min(3),
  cidade: z.string().min(2),
  descricao: z.string().min(10),
  ponto_partida: z.string().min(5),
  distancia_km: z.number().min(5),
  is_public: z.boolean(),
  limite_membros: z.number().int().positive(),
  horario: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  capa_url: z.string().url().optional().nullable(),
});

serve(async (req) => {
  // Responde à requisição pre-flight (OPTIONS) do browser para CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    // Cria um cliente Supabase usando a chave de serviço (admin) para validar o utilizador
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Valida o token JWT do utilizador enviado no header da requisição
    const authHeader = req.headers.get("Authorization")!;
    const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));

    if (!user) {
      return new Response(JSON.stringify({ error: "Utilizador não autenticado" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Lê e valida o corpo da requisição com o schema Zod
    const body = await req.json();
    const validatedData = SquadSchema.parse(body);

    // Insere os dados validados na tabela, associando o admin_id ao ID do utilizador autenticado
    const { data, error } = await supabaseAdmin
      .from("squads")
      .insert({
        ...validatedData,
        admin_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Retorna o novo squad criado com sucesso
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    // Retorna uma resposta de erro genérica em caso de falha
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});