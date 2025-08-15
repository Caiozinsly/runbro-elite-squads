-- Security Fix #1: Restrict profiles visibility to authenticated users only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Security Fix #2: Restrict squad_members visibility 
DROP POLICY IF EXISTS "Anyone can view squad members" ON public.squad_members;

CREATE POLICY "Users can view squad members they belong to" 
ON public.squad_members 
FOR SELECT 
TO authenticated
USING (
  -- Users can see members of squads they belong to
  EXISTS (
    SELECT 1 FROM public.squad_members sm 
    WHERE sm.squad_id = squad_members.squad_id 
    AND sm.user_id = auth.uid() 
    AND sm.status = 'approved'
  )
  OR 
  -- Squad admins can see all members of their squads
  EXISTS (
    SELECT 1 FROM public.squads s 
    WHERE s.id = squad_members.squad_id 
    AND s.admin_id = auth.uid()
  )
);

-- Security Fix #3: Update database functions with proper search path security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$function$;