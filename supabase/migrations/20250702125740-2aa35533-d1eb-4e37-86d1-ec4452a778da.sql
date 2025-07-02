
-- Add cycle management and key results structure
CREATE TABLE IF NOT EXISTS public.okr_key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID NOT NULL REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC DEFAULT 0,
  unit TEXT NOT NULL,
  weight NUMERIC DEFAULT 100 CHECK (weight >= 0 AND weight <= 100),
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'on_track', 'at_risk', 'completed')),
  due_date DATE,
  notes TEXT,
  linked_okr_id UUID REFERENCES public.okr_objectives(id), -- Link KR to higher level OKR
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for key results
ALTER TABLE public.okr_key_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for key results
CREATE POLICY "Users can view key results of accessible OKRs" ON public.okr_key_results
FOR SELECT USING (
  okr_id IN (
    SELECT id FROM public.okr_objectives 
    WHERE owner_type = 'company'
    OR (owner_type = 'department' AND department_id IN (
      SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
    ))
    OR (owner_type = 'individual' AND employee_id IN (
      SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
    ))
    OR created_by = auth.uid()
  )
);

CREATE POLICY "Users can manage key results of their OKRs" ON public.okr_key_results
FOR ALL USING (
  okr_id IN (
    SELECT id FROM public.okr_objectives 
    WHERE created_by = auth.uid()
    OR (owner_type = 'individual' AND employee_id IN (
      SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
    ))
  )
);

CREATE POLICY "Managers can manage department key results" ON public.okr_key_results
FOR ALL USING (
  okr_id IN (
    SELECT id FROM public.okr_objectives 
    WHERE owner_type = 'department' 
    AND department_id IN (
      SELECT department_id FROM public.employees 
      WHERE auth_user_id = auth.uid() 
      AND employee_level IN ('level_1', 'level_2')
    )
  )
);

CREATE POLICY "Admins can manage all key results" ON public.okr_key_results
FOR ALL USING (
  has_system_role(auth.uid(), 'admin'::system_role) OR 
  has_system_role(auth.uid(), 'super_admin'::system_role)
);

-- Update trigger for updated_at
CREATE TRIGGER update_okr_key_results_updated_at
  BEFORE UPDATE ON public.okr_key_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_okr_key_results_okr_id ON public.okr_key_results(okr_id);
CREATE INDEX IF NOT EXISTS idx_okr_key_results_linked_okr_id ON public.okr_key_results(linked_okr_id);

-- Update existing OKR cycles table structure if needed
ALTER TABLE public.okr_cycles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.okr_cycles ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Insert some sample cycles if none exist
INSERT INTO public.okr_cycles (name, year, quarter, start_date, end_date, status, is_current, description)
VALUES 
  ('Q3 2025', 2025, 'Q3', '2025-07-01', '2025-09-30', 'planning', false, 'Quý 3 năm 2025'),
  ('Q4 2025', 2025, 'Q4', '2025-10-01', '2025-12-31', 'planning', false, 'Quý 4 năm 2025'),
  ('Q1 2026', 2026, 'Q1', '2026-01-01', '2026-03-31', 'planning', false, 'Quý 1 năm 2026')
ON CONFLICT DO NOTHING;
