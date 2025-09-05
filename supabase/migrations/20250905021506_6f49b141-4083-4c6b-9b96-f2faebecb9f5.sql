-- Criar bucket para imagens de capa dos squads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('squad-covers', 'squad-covers', true);

-- Políticas RLS para o bucket squad-covers
CREATE POLICY "Squad covers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'squad-covers');

CREATE POLICY "Squad admins can upload covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'squad-covers' 
  AND auth.uid() IN (
    SELECT admin_id FROM squads 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Squad admins can update covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'squad-covers' 
  AND auth.uid() IN (
    SELECT admin_id FROM squads 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Squad admins can delete covers"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'squad-covers' 
  AND auth.uid() IN (
    SELECT admin_id FROM squads 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Habilitar RLS nas tabelas que estavam sem
ALTER TABLE bilhetes_sorteio ENABLE ROW LEVEL SECURITY;
ALTER TABLE corridas ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para as tabelas
CREATE POLICY "Users can view own bilhetes_sorteio"
ON bilhetes_sorteio FOR SELECT
USING (auth.uid() = utilizador_id);

CREATE POLICY "Users can insert own bilhetes_sorteio"
ON bilhetes_sorteio FOR INSERT
WITH CHECK (auth.uid() = utilizador_id);

CREATE POLICY "Squad admins can view corridas"
ON corridas FOR SELECT
USING (
  squad_id IN (
    SELECT id FROM squads WHERE admin_id = auth.uid()
  )
);

CREATE POLICY "Squad admins can manage corridas"
ON corridas FOR ALL
USING (
  squad_id IN (
    SELECT id FROM squads WHERE admin_id = auth.uid()
  )
);

CREATE POLICY "Users can view own perfis"
ON perfis FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own perfis"
ON perfis FOR UPDATE
USING (auth.uid() = id);

-- Função para deletar squad (apenas o admin pode deletar)
CREATE OR REPLACE FUNCTION delete_squad(squad_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o usuário é o admin do squad
  IF NOT EXISTS (
    SELECT 1 FROM squads 
    WHERE id = squad_id_param AND admin_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only squad admin can delete squad';
  END IF;
  
  -- Deletar membros do squad primeiro
  DELETE FROM squad_members WHERE squad_id = squad_id_param;
  
  -- Deletar corridas do squad
  DELETE FROM corridas WHERE squad_id = squad_id_param;
  
  -- Deletar o squad
  DELETE FROM squads WHERE id = squad_id_param;
  
  RETURN true;
END;
$$;