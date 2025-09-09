-- Criar tabela de NFTs/recompensas
CREATE TABLE IF NOT EXISTS public.nft_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT NOT NULL,
  classificacao TEXT NOT NULL CHECK (classificacao IN ('bronze', 'prata', 'ouro', 'diamante')),
  raridade NUMERIC NOT NULL DEFAULT 1.0 CHECK (raridade >= 0 AND raridade <= 1),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de NFTs conquistados pelos usuários
CREATE TABLE IF NOT EXISTS public.user_nft_collection (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nft_reward_id UUID NOT NULL REFERENCES public.nft_rewards(id) ON DELETE CASCADE,
  squad_id UUID REFERENCES public.squads(id) ON DELETE SET NULL,
  challenge_completion_id UUID REFERENCES public.squad_challenge_completions(id) ON DELETE SET NULL,
  conquistado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.nft_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_nft_collection ENABLE ROW LEVEL SECURITY;

-- Políticas para nft_rewards (todos podem ver NFTs ativos)
CREATE POLICY "Anyone can view active NFT rewards" 
ON public.nft_rewards 
FOR SELECT 
USING (ativo = true);

-- Políticas para user_nft_collection
CREATE POLICY "Users can view their own NFT collection" 
ON public.user_nft_collection 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Squad members can view collection of other members in same squad"
ON public.user_nft_collection 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM squad_members sm1 
    JOIN squad_members sm2 ON sm1.squad_id = sm2.squad_id 
    WHERE sm1.user_id = auth.uid() 
    AND sm1.status = 'approved'
    AND sm2.user_id = user_nft_collection.user_id 
    AND sm2.status = 'approved'
  )
);

-- Trigger para atualizar updated_at em nft_rewards
CREATE TRIGGER update_nft_rewards_updated_at
BEFORE UPDATE ON public.nft_rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir NFTs padrão das 4 classificações
INSERT INTO public.nft_rewards (nome, descricao, imagem_url, classificacao, raridade) VALUES
('Corredor Bronze', 'NFT de bronze para iniciantes', '/placeholder-bronze.svg', 'bronze', 0.8),
('Corredor Prata', 'NFT de prata para corredores dedicados', '/placeholder-silver.svg', 'prata', 0.6),
('Corredor Ouro', 'NFT de ouro para corredores experientes', '/placeholder-gold.svg', 'ouro', 0.3),
('Corredor Diamante', 'NFT de diamante para corredores elite', '/placeholder-diamond.svg', 'diamante', 0.1);

-- Função para sortear NFT baseado na classificação do desafio
CREATE OR REPLACE FUNCTION public.sortear_nft_recompensa(
  p_user_id UUID,
  p_squad_id UUID,
  p_challenge_completion_id UUID,
  p_distancia_km NUMERIC
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_classificacao TEXT;
  v_nft_sorteado UUID;
  v_random NUMERIC;
BEGIN
  -- Determinar classificação baseada na distância
  IF p_distancia_km >= 20 THEN
    v_classificacao := 'diamante';
  ELSIF p_distancia_km >= 15 THEN
    v_classificacao := 'ouro';
  ELSIF p_distancia_km >= 10 THEN
    v_classificacao := 'prata';
  ELSE
    v_classificacao := 'bronze';
  END IF;

  -- Gerar número aleatório para raridade
  v_random := random();

  -- Sortear NFT da classificação apropriada ou inferior baseado na raridade
  SELECT id INTO v_nft_sorteado
  FROM nft_rewards
  WHERE ativo = true
  AND (
    (v_classificacao = 'diamante' AND classificacao IN ('diamante', 'ouro', 'prata', 'bronze') AND v_random <= raridade) OR
    (v_classificacao = 'ouro' AND classificacao IN ('ouro', 'prata', 'bronze') AND v_random <= raridade) OR
    (v_clasificacao = 'prata' AND classificacao IN ('prata', 'bronze') AND v_random <= raridade) OR
    (v_classificacao = 'bronze' AND classificacao = 'bronze' AND v_random <= raridade)
  )
  ORDER BY 
    CASE classificacao 
      WHEN 'diamante' THEN 1 
      WHEN 'ouro' THEN 2 
      WHEN 'prata' THEN 3 
      WHEN 'bronze' THEN 4 
    END,
    random()
  LIMIT 1;

  -- Se não encontrou NFT raro, pegar um bronze garantido
  IF v_nft_sorteado IS NULL THEN
    SELECT id INTO v_nft_sorteado
    FROM nft_rewards
    WHERE ativo = true AND classificacao = 'bronze'
    ORDER BY random()
    LIMIT 1;
  END IF;

  -- Inserir na coleção do usuário se NFT foi sorteado
  IF v_nft_sorteado IS NOT NULL THEN
    INSERT INTO user_nft_collection (user_id, nft_reward_id, squad_id, challenge_completion_id)
    VALUES (p_user_id, v_nft_sorteado, p_squad_id, p_challenge_completion_id);
  END IF;

  RETURN v_nft_sorteado;
END;
$$;