-- Corrigir políticas RLS para bucket avatars
-- Permitir usuários autenticados fazerem upload de avatars
CREATE POLICY "Users can upload avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir usuários atualizarem seus próprios avatars
CREATE POLICY "Users can update own avatar" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir usuários deletarem seus próprios avatars
CREATE POLICY "Users can delete own avatar" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Criar tabela para desafios/challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  distancia_km NUMERIC NOT NULL,
  tempo_limite_minutos INTEGER NOT NULL,
  pontos_recompensa INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Política para visualizar challenges ativos
CREATE POLICY "Anyone can view active challenges" 
ON public.challenges 
FOR SELECT 
USING (ativo = true);

-- Criar tabela para completar desafios pelo squad
CREATE TABLE IF NOT EXISTS public.squad_challenge_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID NOT NULL,
  challenge_id UUID NOT NULL,
  tempo_total_minutos NUMERIC NOT NULL,
  km_total NUMERIC NOT NULL,
  pace_medio NUMERIC NOT NULL,
  pontos_ganhos INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(squad_id, challenge_id)
);

-- Enable RLS on completions
ALTER TABLE public.squad_challenge_completions ENABLE ROW LEVEL SECURITY;

-- Política para squad members verem completions do seu squad
CREATE POLICY "Squad members can view their completions" 
ON public.squad_challenge_completions 
FOR SELECT 
USING (
  squad_id IN (
    SELECT sm.squad_id 
    FROM squad_members sm 
    WHERE sm.user_id = auth.uid() AND sm.status = 'approved'
  )
);

-- Política para squad admins gerenciarem completions
CREATE POLICY "Squad admins can manage completions" 
ON public.squad_challenge_completions 
FOR ALL 
USING (
  squad_id IN (
    SELECT s.id 
    FROM squads s 
    WHERE s.admin_id = auth.uid()
  )
);

-- Trigger para atualizar updated_at em challenges
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir desafios padrão
INSERT INTO public.challenges (nome, descricao, distancia_km, tempo_limite_minutos, pontos_recompensa) VALUES
('Desafio 5K', 'Complete uma corrida de 5 km', 5, 40, 100),
('Desafio 10K', 'Complete uma corrida de 10 km', 10, 80, 200),
('Desafio 15K', 'Complete uma corrida de 15 km', 15, 120, 300),
('Desafio 21K - Meia Maratona', 'Complete uma meia maratona', 21, 180, 500);