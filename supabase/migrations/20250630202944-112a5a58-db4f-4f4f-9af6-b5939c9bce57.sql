
-- Tạo bảng work_groups (nhóm công việc)
CREATE TABLE public.work_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  salary_percentage NUMERIC(5,2) NOT NULL CHECK (salary_percentage > 0 AND salary_percentage <= 100),
  created_by UUID REFERENCES public.employees(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng performance_cycles (chu kỳ đánh giá)
CREATE TABLE public.performance_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, completed
  created_by UUID REFERENCES public.employees(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng performance_assignments (phân công đánh giá)
CREATE TABLE public.performance_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  performance_cycle_id UUID REFERENCES public.performance_cycles(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  work_group_id UUID REFERENCES public.work_groups(id),
  kpi_target NUMERIC(10,2) NOT NULL,
  kpi_unit VARCHAR(100),
  description TEXT,
  salary_percentage NUMERIC(5,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'assigned', -- assigned, in_progress, submitted, evaluated
  created_by UUID REFERENCES public.employees(id) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng performance_reports (báo cáo công việc của nhân viên)
CREATE TABLE public.performance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  performance_assignment_id UUID REFERENCES public.performance_assignments(id) ON DELETE CASCADE,
  actual_quantity NUMERIC(10,2) DEFAULT 0,
  report_content TEXT,
  attachments JSONB DEFAULT '[]',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng performance_evaluations (đánh giá của quản lý)
CREATE TABLE public.performance_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  performance_assignment_id UUID REFERENCES public.performance_assignments(id) ON DELETE CASCADE,
  quantity_score NUMERIC(5,2), -- % hoàn thành KPI
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 10), -- 1-10 sao
  quality_percentage NUMERIC(5,2), -- 10%, 20%...100%
  final_score NUMERIC(5,2), -- điểm cuối cùng
  comments TEXT,
  evaluated_by UUID REFERENCES public.employees(id) NOT NULL,
  evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Kích hoạt RLS cho các bảng mới
ALTER TABLE public.work_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_evaluations ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho work_groups
CREATE POLICY "Managers can manage work groups" ON public.work_groups
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin') OR
        created_by IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
    );

-- Tạo policies cho performance_cycles
CREATE POLICY "Managers can manage performance cycles" ON public.performance_cycles
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin') OR
        created_by IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
    );

-- Tạo policies cho performance_assignments
CREATE POLICY "Managers can manage assignments" ON public.performance_assignments
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin') OR
        created_by IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Employees can view their assignments" ON public.performance_assignments
    FOR SELECT USING (
        employee_id IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
    );

-- Tạo policies cho performance_reports
CREATE POLICY "Employees can manage their reports" ON public.performance_reports
    FOR ALL USING (
        performance_assignment_id IN (
            SELECT id FROM public.performance_assignments 
            WHERE employee_id IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
        )
    );

CREATE POLICY "Managers can view reports" ON public.performance_reports
    FOR SELECT USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin') OR
        performance_assignment_id IN (
            SELECT id FROM public.performance_assignments 
            WHERE created_by IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
        )
    );

-- Tạo policies cho performance_evaluations
CREATE POLICY "Managers can manage evaluations" ON public.performance_evaluations
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin') OR
        evaluated_by IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Employees can view their evaluations" ON public.performance_evaluations
    FOR SELECT USING (
        performance_assignment_id IN (
            SELECT id FROM public.performance_assignments 
            WHERE employee_id IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid())
        )
    );

-- Thêm trigger để tự động tính toán quality_percentage
CREATE OR REPLACE FUNCTION calculate_quality_percentage()
RETURNS TRIGGER AS $$
BEGIN
    NEW.quality_percentage = NEW.quality_rating * 10;
    NEW.final_score = (NEW.quantity_score + NEW.quality_percentage) / 2;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_quality_percentage_trigger
    BEFORE INSERT OR UPDATE ON public.performance_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION calculate_quality_percentage();

-- Thêm index cho hiệu suất
CREATE INDEX idx_performance_assignments_employee ON public.performance_assignments(employee_id);
CREATE INDEX idx_performance_assignments_cycle ON public.performance_assignments(performance_cycle_id);
CREATE INDEX idx_performance_reports_assignment ON public.performance_reports(performance_assignment_id);
CREATE INDEX idx_performance_evaluations_assignment ON public.performance_evaluations(performance_assignment_id);
