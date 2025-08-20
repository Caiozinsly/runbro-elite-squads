-- Update the profiles RLS policy to be more restrictive
-- Users can only view their own profile and profiles of users in their squads

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a new restrictive policy
CREATE POLICY "Users can view own profile and squad members profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Users can always view their own profile
  auth.uid() = id
  OR
  -- Users can view profiles of people in squads where they're also members
  EXISTS (
    SELECT 1 
    FROM public.squad_members sm1
    JOIN public.squad_members sm2 ON sm1.squad_id = sm2.squad_id
    WHERE sm1.user_id = auth.uid() 
      AND sm1.status = 'approved'
      AND sm2.user_id = profiles.id 
      AND sm2.status = 'approved'
  )
);