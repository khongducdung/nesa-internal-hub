
-- Tạo bảng lưu trữ yêu cầu đào tạo
CREATE TABLE public.training_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    reason TEXT,
    course_url TEXT,
    duration_days INTEGER NOT NULL DEFAULT 30,
    target_type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'general', 'department', 'position', 'employee'
    target_ids TEXT[], -- Array of department_ids, position_ids, or employee_ids
    auto_assign_after_days INTEGER DEFAULT 0, -- Số ngày sau khi có tài khoản thì tự động assign
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng lưu trữ việc assign training cho từng nhân viên
CREATE TABLE public.employee_training_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    training_requirement_id UUID REFERENCES public.training_requirements(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'overdue'
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    notes TEXT,
    assigned_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(training_requirement_id, employee_id)
);

-- Tạo bảng lưu trữ thông báo đào tạo
CREATE TABLE public.training_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_training_assignment_id UUID REFERENCES public.employee_training_assignments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'assignment', 'reminder', 'overdue'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kích hoạt RLS
ALTER TABLE public.training_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_notifications ENABLE ROW LEVEL SECURITY;

-- Policies cho training_requirements
CREATE POLICY "Admins can manage training requirements" ON public.training_requirements
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users can view active training requirements" ON public.training_requirements
    FOR SELECT USING (is_active = true);

-- Policies cho employee_training_assignments
CREATE POLICY "Admins can manage all training assignments" ON public.employee_training_assignments
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users can view their own training assignments" ON public.employee_training_assignments
    FOR SELECT USING (
        employee_id IN (
            SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own training progress" ON public.employee_training_assignments
    FOR UPDATE USING (
        employee_id IN (
            SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
        )
    );

-- Policies cho training_notifications
CREATE POLICY "Admins can manage all training notifications" ON public.training_notifications
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users can view their own training notifications" ON public.training_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own training notifications" ON public.training_notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Tạo function để tự động assign training dựa trên thời gian tài khoản
CREATE OR REPLACE FUNCTION public.auto_assign_training_requirements()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    req RECORD;
    emp RECORD;
    assignment_due_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Lặp qua tất cả training requirements đang active
    FOR req IN 
        SELECT * FROM public.training_requirements 
        WHERE is_active = true AND auto_assign_after_days >= 0
    LOOP
        -- Lặp qua các nhân viên phù hợp với target
        FOR emp IN
            SELECT e.* FROM public.employees e
            WHERE e.work_status = 'active'
            AND e.auth_user_id IS NOT NULL
            AND (
                req.target_type = 'general' OR
                (req.target_type = 'department' AND e.department_id = ANY(req.target_ids::UUID[])) OR
                (req.target_type = 'position' AND e.position_id = ANY(req.target_ids::UUID[])) OR
                (req.target_type = 'employee' AND e.id::TEXT = ANY(req.target_ids))
            )
            AND e.created_at <= NOW() - INTERVAL '1 day' * req.auto_assign_after_days
            AND NOT EXISTS (
                SELECT 1 FROM public.employee_training_assignments eta
                WHERE eta.training_requirement_id = req.id AND eta.employee_id = e.id
            )
        LOOP
            -- Tính due date
            assignment_due_date := NOW() + INTERVAL '1 day' * req.duration_days;
            
            -- Tạo assignment
            INSERT INTO public.employee_training_assignments (
                training_requirement_id,
                employee_id,
                due_date,
                assigned_by
            ) VALUES (
                req.id,
                emp.id,
                assignment_due_date,
                req.created_by
            );
            
            -- Tạo thông báo
            INSERT INTO public.training_notifications (
                employee_training_assignment_id,
                user_id,
                message,
                type
            ) VALUES (
                (SELECT id FROM public.employee_training_assignments 
                 WHERE training_requirement_id = req.id AND employee_id = emp.id),
                emp.auth_user_id,
                'Bạn có yêu cầu đào tạo mới: ' || req.name || '. Vui lòng hoàn thành trước ngày ' || assignment_due_date::DATE,
                'assignment'
            );
        END LOOP;
    END LOOP;
END;
$$;

-- Tạo trigger để tự động update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_training_requirements_updated_at 
    BEFORE UPDATE ON public.training_requirements 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_employee_training_assignments_updated_at 
    BEFORE UPDATE ON public.employee_training_assignments 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_training_notifications_updated_at 
    BEFORE UPDATE ON public.training_notifications 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
