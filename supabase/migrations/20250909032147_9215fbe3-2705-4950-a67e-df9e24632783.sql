-- Corrigir typo na função de sorteio de NFT
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
    (v_classificacao = 'prata' AND classificacao IN ('prata', 'bronze') AND v_random <= raridade) OR
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