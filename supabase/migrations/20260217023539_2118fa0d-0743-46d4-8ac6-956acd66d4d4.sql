
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'hunter', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Hunter profiles table for vetting applications
CREATE TABLE public.hunter_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Professional info
  full_name text NOT NULL,
  title text NOT NULL,
  bio text NOT NULL,
  years_experience integer NOT NULL DEFAULT 0,
  
  -- Expertise areas (multi-select)
  expertise_areas text[] NOT NULL DEFAULT '{}',
  
  -- Links
  linkedin_url text,
  github_url text,
  portfolio_url text,
  
  -- Resume
  resume_path text,
  
  -- Certifications & past projects
  certifications text,
  past_projects text,
  
  -- Vetting
  status text NOT NULL DEFAULT 'pending',
  ai_score integer,
  ai_assessment text,
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hunter_profiles ENABLE ROW LEVEL SECURITY;

-- RLS for hunter_profiles
CREATE POLICY "Users can view own hunter profile"
  ON public.hunter_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own hunter profile"
  ON public.hunter_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending profile"
  ON public.hunter_profiles FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all hunter profiles"
  ON public.hunter_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hunter profiles"
  ON public.hunter_profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_hunter_profiles_updated_at
  BEFORE UPDATE ON public.hunter_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

CREATE POLICY "Users can upload own resume"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own resume"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));
