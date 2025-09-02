-- Corrigir a função get_squad_details para usar os tipos corretos
DROP FUNCTION IF EXISTS get_squad_details(uuid);

CREATE OR REPLACE FUNCTION get_squad_details(squad_id_param UUID)
RETURNS TABLE (
    id UUID,
    created_at TIMESTAMPTZ,
    admin_id UUID,
    nome TEXT,
    cidade TEXT,
    descricao TEXT,
    ponto_partida TEXT,
    distancia_km NUMERIC,
    limite_membros INTEGER,
    horario TIME,
    admin_username TEXT,
    admin_avatar_url TEXT,
    is_public BOOLEAN,
    capa_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.created_at,
        s.admin_id,
        s.nome,
        s.cidade,
        s.descricao,
        s.ponto_partida,
        s.distancia_km,
        s.limite_membros,
        s.horario,
        p.username::TEXT as admin_username,
        p.avatar_url,
        s.is_public,
        s.capa_url
    FROM squads s
    LEFT JOIN profiles p ON s.admin_id = p.id
    WHERE s.id = squad_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Adicionar coluna codigo_convite para squads privados
ALTER TABLE squads ADD COLUMN IF NOT EXISTS codigo_convite TEXT;

-- Função para gerar código de convite
CREATE OR REPLACE FUNCTION generate_invite_code() 
RETURNS TEXT AS $$
BEGIN
    RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar código automaticamente para squads privados
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_public = false AND NEW.codigo_convite IS NULL THEN
        NEW.codigo_convite = generate_invite_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar o trigger
DROP TRIGGER IF EXISTS trigger_set_invite_code ON squads;
CREATE TRIGGER trigger_set_invite_code
    BEFORE INSERT OR UPDATE ON squads
    FOR EACH ROW
    EXECUTE FUNCTION set_invite_code();

-- Atualizar squads privados existentes sem código
UPDATE squads 
SET codigo_convite = generate_invite_code() 
WHERE is_public = false AND codigo_convite IS NULL;