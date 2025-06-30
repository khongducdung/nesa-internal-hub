
-- Remove salary_percentage column from work_groups table since it's now handled per assignment
ALTER TABLE public.work_groups DROP COLUMN IF EXISTS salary_percentage;
