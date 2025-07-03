-- Create OKR system settings table
CREATE TABLE IF NOT EXISTS public.okr_system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_type VARCHAR NOT NULL, -- 'rewards', 'alignment', 'notifications'
  settings JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.okr_system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage system settings" ON public.okr_system_settings
  FOR ALL USING (
    has_system_role(auth.uid(), 'super_admin'::system_role) OR 
    has_system_role(auth.uid(), 'admin'::system_role)
  );

-- Create unique constraint for setting types
CREATE UNIQUE INDEX IF NOT EXISTS okr_system_settings_type_unique 
ON public.okr_system_settings(setting_type);

-- Add trigger for updated_at
CREATE TRIGGER okr_system_settings_updated_at
  BEFORE UPDATE ON public.okr_system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();