-- Create profile_criteria table for storing dynamic profile criteria
CREATE TABLE public.profile_criteria (
    id INTEGER PRIMARY KEY DEFAULT 1,
    criteria TEXT NOT NULL DEFAULT 'Describe the ideal candidate profile...',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default row
INSERT INTO public.profile_criteria (id, criteria) VALUES (1, 'Describe the ideal candidate profile...');

-- Enable Row Level Security
ALTER TABLE public.profile_criteria ENABLE ROW LEVEL SECURITY;

-- Allow all operations (since this is a simple single-row configuration table)
CREATE POLICY "Allow all operations on profile_criteria" 
ON public.profile_criteria 
FOR ALL 
USING (true);

-- Create trigger to update timestamp
CREATE TRIGGER update_profile_criteria_updated_at
    BEFORE UPDATE ON public.profile_criteria
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();