-- Restrict profiles visibility to authenticated users only
-- 1) Drop overly-permissive public select policy if it exists
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- 2) Create a new SELECT policy scoped to the authenticated role
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- (No other changes needed: insert/update policies already restrict to the row owner)
