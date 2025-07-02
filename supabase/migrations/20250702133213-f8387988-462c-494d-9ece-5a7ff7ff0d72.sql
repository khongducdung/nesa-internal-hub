-- Enhanced OKR Cycles with Monthly Support
ALTER TABLE public.okr_cycles 
ADD COLUMN IF NOT EXISTS cycle_type VARCHAR DEFAULT 'quarterly' CHECK (cycle_type IN ('monthly', 'quarterly', 'yearly')),
ADD COLUMN IF NOT EXISTS month INTEGER,
ADD COLUMN IF NOT EXISTS parent_cycle_id UUID REFERENCES public.okr_cycles(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_okr_cycles_cycle_type ON public.okr_cycles(cycle_type);
CREATE INDEX IF NOT EXISTS idx_okr_cycles_parent_cycle_id ON public.okr_cycles(parent_cycle_id);

-- Enhanced Key Results linking
ALTER TABLE public.okr_key_results 
ADD COLUMN IF NOT EXISTS linked_department_id UUID REFERENCES public.departments(id),
ADD COLUMN IF NOT EXISTS linked_kr_id UUID REFERENCES public.okr_key_results(id);

-- Create OKR linking table for better hierarchy management
CREATE TABLE IF NOT EXISTS public.okr_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_okr_id UUID NOT NULL REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
  child_okr_id UUID NOT NULL REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
  link_type VARCHAR NOT NULL CHECK (link_type IN ('contributes_to', 'supports', 'aligns_with')),
  contribution_percentage NUMERIC DEFAULT 100 CHECK (contribution_percentage >= 0 AND contribution_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  UNIQUE(parent_okr_id, child_okr_id)
);

-- Enable RLS for okr_links
ALTER TABLE public.okr_links ENABLE ROW LEVEL SECURITY;

-- RLS policies for okr_links
CREATE POLICY "Users can view OKR links of accessible OKRs" ON public.okr_links
FOR SELECT USING (
  parent_okr_id IN (
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
  AND child_okr_id IN (
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

CREATE POLICY "Users can manage OKR links for their OKRs" ON public.okr_links
FOR ALL USING (
  child_okr_id IN (
    SELECT id FROM public.okr_objectives 
    WHERE created_by = auth.uid()
    OR (owner_type = 'individual' AND employee_id IN (
      SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
    ))
  )
);

CREATE POLICY "Managers can manage department OKR links" ON public.okr_links
FOR ALL USING (
  child_okr_id IN (
    SELECT id FROM public.okr_objectives 
    WHERE owner_type = 'department' 
    AND department_id IN (
      SELECT department_id FROM public.employees 
      WHERE auth_user_id = auth.uid() 
      AND employee_level IN ('level_1', 'level_2')
    )
  )
);

CREATE POLICY "Admins can manage all OKR links" ON public.okr_links
FOR ALL USING (
  has_system_role(auth.uid(), 'admin'::system_role) OR 
  has_system_role(auth.uid(), 'super_admin'::system_role)
);

-- Insert sample monthly cycles for Q4 2024
INSERT INTO public.okr_cycles (name, year, quarter, month, cycle_type, start_date, end_date, status, is_current, description, parent_cycle_id)
SELECT 
  'Tháng 10/2024', 2024, 'Q4', 10, 'monthly', '2024-10-01', '2024-10-31', 'active', false, 'Tháng 10 năm 2024', id
FROM public.okr_cycles WHERE name = 'Q4 2024'
ON CONFLICT DO NOTHING;

INSERT INTO public.okr_cycles (name, year, quarter, month, cycle_type, start_date, end_date, status, is_current, description, parent_cycle_id)
SELECT 
  'Tháng 11/2024', 2024, 'Q4', 11, 'monthly', '2024-11-01', '2024-11-30', 'active', false, 'Tháng 11 năm 2024', id
FROM public.okr_cycles WHERE name = 'Q4 2024'
ON CONFLICT DO NOTHING;

INSERT INTO public.okr_cycles (name, year, quarter, month, cycle_type, start_date, end_date, status, is_current, description, parent_cycle_id)
SELECT 
  'Tháng 12/2024', 2024, 'Q4', 12, 'monthly', '2024-12-01', '2024-12-31', 'planning', false, 'Tháng 12 năm 2024', id
FROM public.okr_cycles WHERE name = 'Q4 2024'
ON CONFLICT DO NOTHING;