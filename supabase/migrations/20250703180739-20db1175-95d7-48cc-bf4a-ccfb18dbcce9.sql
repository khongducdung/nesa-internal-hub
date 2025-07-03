-- Create ideas table for iDea widget
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_shared BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own ideas" ON public.ideas
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can view shared ideas" ON public.ideas
  FOR SELECT USING (is_shared = true);

CREATE POLICY "Users can create their own ideas" ON public.ideas
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own ideas" ON public.ideas
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own ideas" ON public.ideas
  FOR DELETE USING (created_by = auth.uid());

-- Admins can manage all ideas
CREATE POLICY "Admins can manage all ideas" ON public.ideas
  FOR ALL USING (
    has_system_role(auth.uid(), 'super_admin'::system_role) OR 
    has_system_role(auth.uid(), 'admin'::system_role)
  );

-- Add trigger for updated_at
CREATE TRIGGER ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX IF NOT EXISTS ideas_created_by_idx ON public.ideas(created_by);
CREATE INDEX IF NOT EXISTS ideas_shared_idx ON public.ideas(is_shared) WHERE is_shared = true;
CREATE INDEX IF NOT EXISTS ideas_created_at_idx ON public.ideas(created_at DESC);