
-- Create invoices table with relationship to deals
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id BIGINT REFERENCES public.deals(deal_id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  amount DECIMAL(10,2),
  due_date DATE,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'pending')),
  invoice_number TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create follow_ups table for tracking follow-up activities
CREATE TABLE public.follow_ups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  followed_up BOOLEAN DEFAULT false,
  last_follow_up DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_invoices_deal_id ON public.invoices(deal_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_follow_ups_invoice_id ON public.follow_ups(invoice_id);

-- Create function to automatically create follow-up record when invoice is created
CREATE OR REPLACE FUNCTION create_follow_up_for_invoice()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.follow_ups (invoice_id, client_name, email)
  VALUES (NEW.id, NEW.client_name, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create follow-up records
CREATE TRIGGER trigger_create_follow_up
  AFTER INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION create_follow_up_for_invoice();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_ups_updated_at
  BEFORE UPDATE ON public.follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security) - can be customized based on your auth requirements
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now - adjust based on your auth needs)
CREATE POLICY "Allow all operations on invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations on follow_ups" ON public.follow_ups FOR ALL USING (true);
