
-- Cập nhật bảng employees để liên kết với auth.users
ALTER TABLE public.employees 
ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Cập nhật bảng profiles để đồng bộ với employees
ALTER TABLE public.profiles 
ADD COLUMN employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL;

-- Cập nhật RLS policies cho employees để hỗ trợ auth
CREATE POLICY "Users can view their own employee record by auth_user_id" ON public.employees
    FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own employee record by auth_user_id" ON public.employees
    FOR UPDATE USING (auth_user_id = auth.uid());

-- Tạo function để tự động tạo profile khi có employee mới với auth_user_id
CREATE OR REPLACE FUNCTION public.sync_employee_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Nếu employee có auth_user_id, tạo hoặc cập nhật profile
    IF NEW.auth_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (
            id, 
            employee_id,
            full_name, 
            email, 
            phone,
            employee_code,
            department_id,
            position_id,
            employee_level,
            hire_date
        ) 
        VALUES (
            NEW.auth_user_id,
            NEW.id,
            NEW.full_name,
            NEW.email,
            NEW.phone,
            NEW.employee_code,
            NEW.department_id,
            NEW.position_id,
            NEW.employee_level,
            NEW.hire_date
        )
        ON CONFLICT (id) DO UPDATE SET
            employee_id = NEW.id,
            full_name = NEW.full_name,
            email = NEW.email,
            phone = NEW.phone,
            employee_code = NEW.employee_code,
            department_id = NEW.department_id,
            position_id = NEW.position_id,
            employee_level = NEW.employee_level,
            hire_date = NEW.hire_date,
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$;

-- Tạo trigger để tự động sync
CREATE TRIGGER sync_employee_profile_trigger
    AFTER INSERT OR UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_employee_profile();
