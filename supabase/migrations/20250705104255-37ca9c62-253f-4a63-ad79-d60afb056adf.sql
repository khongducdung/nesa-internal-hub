
-- Update the training_requirements table to support 'mixed' target type
ALTER TABLE public.training_requirements 
DROP CONSTRAINT IF EXISTS training_requirements_target_type_check;

ALTER TABLE public.training_requirements 
ADD CONSTRAINT training_requirements_target_type_check 
CHECK (target_type IN ('general', 'department', 'position', 'employee', 'mixed'));
