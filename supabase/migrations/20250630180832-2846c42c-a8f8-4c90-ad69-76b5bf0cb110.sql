
-- Create process notifications table
CREATE TABLE public.process_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_template_id UUID REFERENCES public.process_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('new_process', 'process_updated')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for process notifications
ALTER TABLE public.process_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.process_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only authenticated users can create notifications (for system use)
CREATE POLICY "System can create notifications" 
  ON public.process_notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
  ON public.process_notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_process_notifications_user ON public.process_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_process_notifications_template ON public.process_notifications(process_template_id);
CREATE INDEX IF NOT EXISTS idx_process_notifications_unread ON public.process_notifications(user_id, is_read);

-- Create trigger for updated_at
CREATE TRIGGER update_process_notifications_updated_at 
  BEFORE UPDATE ON public.process_notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
