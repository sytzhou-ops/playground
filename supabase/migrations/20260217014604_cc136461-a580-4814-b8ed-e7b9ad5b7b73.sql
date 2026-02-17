
-- Applications table: FDEs apply to bounties
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

-- Applicants can view their own applications
CREATE POLICY "Applicants can view own applications"
ON public.applications FOR SELECT
USING (auth.uid() = applicant_id);

-- Bounty owners can view applications on their bounties
CREATE POLICY "Bounty owners can view applications"
ON public.applications FOR SELECT
USING (
  bounty_id IN (SELECT id FROM public.bounties WHERE user_id = auth.uid())
);

-- Authenticated users can create applications
CREATE POLICY "Authenticated users can apply"
ON public.applications FOR INSERT
WITH CHECK (auth.uid() = applicant_id);

-- Applicants can update their pending applications
CREATE POLICY "Applicants can update own pending applications"
ON public.applications FOR UPDATE
USING (auth.uid() = applicant_id AND status = 'pending');

-- Bounty owners can update application status (accept/reject)
CREATE POLICY "Bounty owners can update application status"
ON public.applications FOR UPDATE
USING (
  bounty_id IN (SELECT id FROM public.bounties WHERE user_id = auth.uid())
);

-- Trigger for updated_at
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Scheduled calls table
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

-- Both parties can view their calls
CREATE POLICY "Users can view own calls"
ON public.scheduled_calls FOR SELECT
USING (auth.uid() = poster_id OR auth.uid() = applicant_id);

-- Poster can create calls
CREATE POLICY "Poster can schedule calls"
ON public.scheduled_calls FOR INSERT
WITH CHECK (auth.uid() = poster_id);

-- Both parties can update calls
CREATE POLICY "Participants can update calls"
ON public.scheduled_calls FOR UPDATE
USING (auth.uid() = poster_id OR auth.uid() = applicant_id);

-- Agreements table: locks down scope and payment
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

-- Both parties can view their agreements
CREATE POLICY "Users can view own agreements"
ON public.agreements FOR SELECT
USING (auth.uid() = poster_id OR auth.uid() = applicant_id);

-- Poster can create agreements
CREATE POLICY "Poster can create agreements"
ON public.agreements FOR INSERT
WITH CHECK (auth.uid() = poster_id);

-- Both parties can update agreements
CREATE POLICY "Participants can update agreements"
ON public.agreements FOR UPDATE
USING (auth.uid() = poster_id OR auth.uid() = applicant_id);

-- Trigger for updated_at on agreements
CREATE TRIGGER update_agreements_updated_at
BEFORE UPDATE ON public.agreements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
