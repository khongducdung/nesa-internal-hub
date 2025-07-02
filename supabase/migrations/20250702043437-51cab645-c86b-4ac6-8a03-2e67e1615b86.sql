-- Fix the foreign key relationship between audit_logs and profiles
-- First, add the missing foreign key relationship to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update audit_logs to properly reference profiles through auth.users
-- The audit_logs.user_id should be able to join to profiles.id since both reference auth.users.id