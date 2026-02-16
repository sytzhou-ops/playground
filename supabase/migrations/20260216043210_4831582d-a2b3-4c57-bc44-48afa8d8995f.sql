
-- Create bounties table
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;

-- Anyone can view open bounties (public wall)
CREATE POLICY "Anyone can view open bounties"
  ON public.bounties FOR SELECT
  USING (status = 'open');

-- Users can insert their own bounties
CREATE POLICY "Users can create their own bounties"
  ON public.bounties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bounties
CREATE POLICY "Users can update their own bounties"
  ON public.bounties FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own bounties
CREATE POLICY "Users can delete their own bounties"
  ON public.bounties FOR DELETE
  USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bounties_updated_at
  BEFORE UPDATE ON public.bounties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bounties;
