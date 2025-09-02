-- Atualizar a função get_squads_com_detalhes para incluir dados do admin
DROP FUNCTION IF EXISTS get_squads_com_detalhes();

CREATE OR REPLACE FUNCTION get_squads_com_detalhes()
RETURNS TABLE(
    id uuid, 
    created_at timestamp with time zone, 
    nome text, 
    cidade text, 
    descricao text, 
    ponto_partida text, 
    distancia_km numeric, 
    capa_url text, 
    is_public boolean, 
    admin_id uuid, 
    limite_membros integer, 
    horario time without time zone, 
    periodo_calculado text, 
    member_count bigint,
    admin_username text,
    admin_avatar_url text,
    codigo_convite text
) 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.created_at,
    s.nome,
    s.cidade,
    s.descricao,
    s.ponto_partida,
    s.distancia_km,
    s.capa_url,
    s.is_public,
    s.admin_id,
    s.limite_membros,
    s.horario,
    CASE
      WHEN EXTRACT(HOUR FROM s.horario) BETWEEN 5 AND 11 THEN 'manha'
      WHEN EXTRACT(HOUR FROM s.horario) BETWEEN 12 AND 17 THEN 'tarde'
      ELSE 'noite'
    END AS periodo_calculado,
    (SELECT count(*) FROM public.squad_members sm WHERE sm.squad_id = s.id AND sm.status = 'approved') AS member_count,
    p.username::TEXT as admin_username,
    p.avatar_url as admin_avatar_url,
    s.codigo_convite
  FROM
    public.squads s
  LEFT JOIN public.profiles p ON s.admin_id = p.id;
END;
$$;