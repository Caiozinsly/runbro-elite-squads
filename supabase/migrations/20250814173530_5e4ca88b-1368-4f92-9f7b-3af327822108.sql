-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create squads table
CREATE TABLE public.squads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  ritmo_min VARCHAR(10),
  ritmo_max VARCHAR(10), 
  dias_treino INTEGER,
  max_members INTEGER DEFAULT 8,
  description TEXT,
  image_url TEXT,
  admin_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create squad members table
CREATE TABLE public.squad_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(squad_id, user_id)
);

-- Create mural photos table
CREATE TABLE public.mural_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  squad_id UUID REFERENCES public.squads(id),
  photo_url TEXT NOT NULL,
  caption TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mural_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for squads
CREATE POLICY "Anyone can view squads" ON public.squads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create squads" ON public.squads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Squad admins can update their squads" ON public.squads FOR UPDATE USING (auth.uid() = admin_id);
CREATE POLICY "Squad admins can delete their squads" ON public.squads FOR DELETE USING (auth.uid() = admin_id);

-- RLS Policies for squad_members
CREATE POLICY "Anyone can view squad members" ON public.squad_members FOR SELECT USING (true);
CREATE POLICY "Authenticated users can request to join" ON public.squad_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own membership" ON public.squad_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Squad admins can manage members" ON public.squad_members FOR UPDATE USING (
  auth.uid() IN (SELECT admin_id FROM public.squads WHERE id = squad_id)
);

-- RLS Policies for mural_photos
CREATE POLICY "Anyone can view approved photos" ON public.mural_photos FOR SELECT USING (approved = true);
CREATE POLICY "Authenticated users can upload photos" ON public.mural_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own photos" ON public.mural_photos FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_squads_updated_at BEFORE UPDATE ON public.squads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.profiles (id, username, full_name, avatar_url, points) VALUES
  (gen_random_uuid(), 'runner_elite', 'Ana Silva', null, 150),
  (gen_random_uuid(), 'speed_demon', 'Carlos Santos', null, 200),
  (gen_random_uuid(), 'urban_wolf', 'Maria Oliveira', null, 180);

INSERT INTO public.squads (name, cidade, ritmo_min, ritmo_max, dias_treino, max_members, description, admin_id) VALUES
  ('Wolves SP', 'São Paulo', '4:50', '5:10', 4, 8, 'Squad elite para corredores avançados em SP', (SELECT id FROM public.profiles WHERE username = 'runner_elite')),
  ('Porto Runners', 'Porto', '5:10', '5:30', 3, 6, 'Grupo de corrida matinal no Porto', (SELECT id FROM public.profiles WHERE username = 'speed_demon')),
  ('Lisboa Streets', 'Lisboa', '5:30', '6:00', 3, 8, 'Explorando as ruas históricas de Lisboa', (SELECT id FROM public.profiles WHERE username = 'urban_wolf'));

INSERT INTO public.squad_members (squad_id, user_id, status) VALUES
  ((SELECT id FROM public.squads WHERE name = 'Wolves SP'), (SELECT id FROM public.profiles WHERE username = 'runner_elite'), 'approved'),
  ((SELECT id FROM public.squads WHERE name = 'Wolves SP'), (SELECT id FROM public.profiles WHERE username = 'speed_demon'), 'approved'),
  ((SELECT id FROM public.squads WHERE name = 'Porto Runners'), (SELECT id FROM public.profiles WHERE username = 'speed_demon'), 'approved'),
  ((SELECT id FROM public.squads WHERE name = 'Lisboa Streets'), (SELECT id FROM public.profiles WHERE username = 'urban_wolf'), 'approved');