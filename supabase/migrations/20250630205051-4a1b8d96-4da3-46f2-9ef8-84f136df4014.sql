
-- Remove salary_percentage column from work_groups table since it's now handled per assignment
ALTER TABLE public.work_groups DROP COLUMN IF EXISTS salary_percentage;

-- Create trigger for calculating performance evaluation scores
CREATE OR REPLACE FUNCTION public.calculate_quality_percentage()
RETURNS TRIGGER AS $$
BEGIN
    NEW.quality_percentage = NEW.quality_rating * 10;
    NEW.final_score = (NEW.quantity_score + NEW.quality_percentage) / 2;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to performance_evaluations table
CREATE TRIGGER calculate_evaluation_scores
    BEFORE INSERT OR UPDATE ON public.performance_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_quality_percentage();
