
-- Create table for CV evaluation results
CREATE TABLE public.cv_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  candidate_name TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  email TEXT,
  date_of_birth DATE,
  education TEXT,
  job_history TEXT,
  skills TEXT,
  ai_summary TEXT,
  vote INTEGER CHECK (vote >= 0 AND vote <= 100),
  consideration TEXT CHECK (consideration IN ('Shortlist', 'Rejected', 'Under Review')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_cv_evaluations_date ON public.cv_evaluations(evaluation_date DESC);
CREATE INDEX idx_cv_evaluations_vote ON public.cv_evaluations(vote DESC);
CREATE INDEX idx_cv_evaluations_name ON public.cv_evaluations(candidate_name);

-- Enable RLS (though this might be public data, keeping it flexible)
ALTER TABLE public.cv_evaluations ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for now (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on cv_evaluations" 
  ON public.cv_evaluations 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Add trigger for updating updated_at
CREATE TRIGGER update_cv_evaluations_updated_at
  BEFORE UPDATE ON public.cv_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
