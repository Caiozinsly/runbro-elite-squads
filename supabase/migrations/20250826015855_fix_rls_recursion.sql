-- Remove a política de segurança recursiva e problemática da tabela de perfis.
DROP POLICY IF EXISTS "Users can view own profile and squad members profiles" ON public.profiles;

-- Cria uma política nova e mais simples que permite a qualquer utilizador autenticado
-- ver os perfis de outros utilizadores, evitando a recursão.
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);