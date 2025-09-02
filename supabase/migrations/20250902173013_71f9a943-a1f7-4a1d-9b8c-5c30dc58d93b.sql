-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_squad_details(uuid);

-- Create corrected get_squad_details function
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
$$ LANGUAGE plpgsql SECURITY DEFINER;