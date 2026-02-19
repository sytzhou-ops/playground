-- ============================================================
-- patch.ai — Full Database Migration
-- ============================================================
-- HOW TO USE:
-- 1. Create a new project at https://supabase.com
-- 2. Go to SQL Editor (left sidebar)
-- 3. Paste this entire file and click "Run"
-- 4. Then set up Google Auth (see instructions below the SQL)
-- ============================================================


-- ==========================================
-- 1. HELPER FUNCTION: auto-update timestamps
-- ==========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;


-- ==========================================
-- 2. ROLES SYSTEM
-- ==========================================

CREATE TYPE public.app_role AS ENUM ('admin', 'hunter', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if a user has a specific role
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

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));


-- ==========================================
-- 3. PROFILES (auto-created on signup)
-- ==========================================

CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  date_of_birth DATE,
  phone_number TEXT,
  city TEXT,
  country TEXT,
  job_title TEXT,
  company TEXT,
  industry TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- 4. BOUNTIES
-- ==========================================

CREATE TABLE public.bounties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  industry TEXT,
  problem_description TEXT NOT NULL,
  current_process TEXT,
  pain_frequency TEXT,
  hours_wasted INTEGER DEFAULT 0,
  annual_cost INTEGER DEFAULT 0,
  pain_description TEXT,
  desired_outcome TEXT,
  acceptance_criteria TEXT,
  tool_preferences TEXT,
  bounty_amount INTEGER NOT NULL DEFAULT 0,
  payment_structure TEXT DEFAULT 'milestone',
  urgency TEXT,
  deadline DATE,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  ai_summary TEXT,
  ai_completeness_score INTEGER,
  ai_clarity_score INTEGER,
  ai_scopability_score INTEGER,
  impact_description TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open bounties"
  ON public.bounties FOR SELECT
  USING (status = 'open');

CREATE POLICY "Users can create their own bounties"
  ON public.bounties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bounties"
  ON public.bounties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bounties"
  ON public.bounties FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_bounties_updated_at
  BEFORE UPDATE ON public.bounties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.bounties;


-- ==========================================
-- 5. APPLICATIONS
-- ==========================================

CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bounty_id UUID NOT NULL REFERENCES public.bounties(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
  problem_understanding TEXT NOT NULL,
  scope_approach TEXT NOT NULL,
  solution_plan TEXT NOT NULL,
  needs_from_requestor TEXT NOT NULL,
  estimated_hours INTEGER NOT NULL,
  estimated_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = applicant_id);

CREATE POLICY "Bounty owners can view applications"
  ON public.applications FOR SELECT
  USING (
    bounty_id IN (SELECT id FROM public.bounties WHERE user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can apply"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Applicants can update own pending applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = applicant_id AND status = 'pending');

CREATE POLICY "Bounty owners can update application status"
  ON public.applications FOR UPDATE
  USING (
    bounty_id IN (SELECT id FROM public.bounties WHERE user_id = auth.uid())
  );

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ==========================================
-- 6. SCHEDULED CALLS
-- ==========================================

CREATE TABLE public.scheduled_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  bounty_id UUID NOT NULL REFERENCES public.bounties(id) ON DELETE CASCADE,
  poster_id UUID NOT NULL,
  applicant_id UUID NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scheduled_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calls"
  ON public.scheduled_calls FOR SELECT
  USING (auth.uid() = poster_id OR auth.uid() = applicant_id);

CREATE POLICY "Poster can schedule calls"
  ON public.scheduled_calls FOR INSERT
  WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Participants can update calls"
  ON public.scheduled_calls FOR UPDATE
  USING (auth.uid() = poster_id OR auth.uid() = applicant_id);


-- ==========================================
-- 7. AGREEMENTS
-- ==========================================

CREATE TABLE public.agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  bounty_id UUID NOT NULL REFERENCES public.bounties(id) ON DELETE CASCADE,
  poster_id UUID NOT NULL,
  applicant_id UUID NOT NULL,
  agreed_scope TEXT NOT NULL,
  agreed_amount INTEGER NOT NULL,
  agreed_timeline TEXT NOT NULL,
  poster_accepted BOOLEAN NOT NULL DEFAULT false,
  applicant_accepted BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agreements"
  ON public.agreements FOR SELECT
  USING (auth.uid() = poster_id OR auth.uid() = applicant_id);

CREATE POLICY "Poster can create agreements"
  ON public.agreements FOR INSERT
  WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Participants can update agreements"
  ON public.agreements FOR UPDATE
  USING (auth.uid() = poster_id OR auth.uid() = applicant_id);

CREATE TRIGGER update_agreements_updated_at
  BEFORE UPDATE ON public.agreements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ==========================================
-- 8. HUNTER PROFILES (FDE vetting)
-- ==========================================

CREATE TABLE public.hunter_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  title text NOT NULL,
  bio text NOT NULL,
  years_experience integer NOT NULL DEFAULT 0,
  expertise_areas text[] NOT NULL DEFAULT '{}',
  linkedin_url text,
  github_url text,
  portfolio_url text,
  resume_path text,
  certifications text,
  past_projects text,
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

CREATE TRIGGER update_hunter_profiles_updated_at
  BEFORE UPDATE ON public.hunter_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ==========================================
-- 9. STORAGE: Resume uploads
-- ==========================================

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


-- ============================================================
-- DONE! Your database is ready.
-- Now follow the steps in the guide to set up auth and env vars.
-- ============================================================
