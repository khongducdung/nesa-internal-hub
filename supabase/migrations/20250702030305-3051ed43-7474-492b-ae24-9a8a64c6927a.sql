-- Fix lỗi migration KPI system
-- Cập nhật bảng KPIs hiện tại để phù hợp với tiêu chuẩn doanh nghiệp

-- Tạo bảng KPI categories để phân loại KPI
CREATE TABLE public.kpi_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  color VARCHAR DEFAULT '#2563EB',
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng KPI frameworks để quản lý khung KPI theo cấp độ
CREATE TABLE public.kpi_frameworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  framework_type VARCHAR NOT NULL CHECK (framework_type IN ('company', 'department', 'team', 'individual')),
  target_level VARCHAR NOT NULL CHECK (target_level IN ('strategic', 'operational', 'tactical')),
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  position_id UUID REFERENCES public.positions(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cập nhật bảng kpis (chính xác table name)
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS kpi_category_id UUID REFERENCES public.kpi_categories(id) ON DELETE SET NULL;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS kpi_framework_id UUID REFERENCES public.kpi_frameworks(id) ON DELETE SET NULL;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS measurement_frequency VARCHAR DEFAULT 'monthly' CHECK (measurement_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly'));
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2) DEFAULT 100.0 CHECK (weight >= 0 AND weight <= 100);
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS baseline_value NUMERIC;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS calculation_method TEXT;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS data_source VARCHAR;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS responsible_person_id UUID REFERENCES public.employees(id) ON DELETE SET NULL;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS kpi_type VARCHAR DEFAULT 'quantitative' CHECK (kpi_type IN ('quantitative', 'qualitative'));
ALTER TABLE public.kpis ADD COLUMN IF NOT EXISTS trend_direction VARCHAR DEFAULT 'increase' CHECK (trend_direction IN ('increase', 'decrease', 'maintain'));

-- Tạo bảng KPI measurements để tracking các lần đo
CREATE TABLE public.kpi_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  measured_value NUMERIC NOT NULL,
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  measurement_period VARCHAR NOT NULL,
  notes TEXT,
  evidence_urls JSONB DEFAULT '[]'::jsonb,
  measured_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(kpi_id, measurement_period)
);

-- Tạo bảng KPI targets để quản lý mục tiêu theo thời gian
CREATE TABLE public.kpi_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  target_period VARCHAR NOT NULL,
  target_value NUMERIC NOT NULL,
  minimum_acceptable NUMERIC,
  excellent_threshold NUMERIC,
  target_type VARCHAR DEFAULT 'absolute' CHECK (target_type IN ('absolute', 'percentage', 'ratio')),
  notes TEXT,
  set_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(kpi_id, target_period)
);

-- Tạo bảng KPI action plans cho improvement actions
CREATE TABLE public.kpi_action_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  action_type VARCHAR DEFAULT 'improvement' CHECK (action_type IN ('improvement', 'corrective', 'preventive')),
  priority VARCHAR DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  due_date DATE,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  expected_impact TEXT,
  actual_impact TEXT,
  resources_required JSONB DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng KPI reviews để tracking việc review định kỳ
CREATE TABLE public.kpi_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  review_period VARCHAR NOT NULL,
  review_type VARCHAR DEFAULT 'regular' CHECK (review_type IN ('regular', 'ad_hoc', 'annual')),
  performance_rating VARCHAR CHECK (performance_rating IN ('excellent', 'good', 'acceptable', 'below_target', 'poor')),
  achievement_percentage NUMERIC(5,2),
  variance_analysis TEXT,
  root_cause_analysis TEXT,
  recommendations TEXT,
  corrective_actions TEXT,
  reviewed_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'approved')),
  approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_kpi_categories_updated_at
  BEFORE UPDATE ON public.kpi_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpi_frameworks_updated_at
  BEFORE UPDATE ON public.kpi_frameworks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpi_measurements_updated_at
  BEFORE UPDATE ON public.kpi_measurements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpi_targets_updated_at
  BEFORE UPDATE ON public.kpi_targets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpi_action_plans_updated_at
  BEFORE UPDATE ON public.kpi_action_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpi_reviews_updated_at
  BEFORE UPDATE ON public.kpi_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tạo indexes để tối ưu performance
CREATE INDEX idx_kpi_categories_active ON public.kpi_categories(is_active);
CREATE INDEX idx_kpi_frameworks_type ON public.kpi_frameworks(framework_type);
CREATE INDEX idx_kpi_frameworks_department ON public.kpi_frameworks(department_id);
CREATE INDEX idx_kpis_category ON public.kpis(kpi_category_id);
CREATE INDEX idx_kpis_framework ON public.kpis(kpi_framework_id);
CREATE INDEX idx_kpi_measurements_date ON public.kpi_measurements(measurement_date);
CREATE INDEX idx_kpi_measurements_period ON public.kpi_measurements(measurement_period);
CREATE INDEX idx_kpi_targets_period ON public.kpi_targets(target_period);
CREATE INDEX idx_kpi_action_plans_status ON public.kpi_action_plans(status);
CREATE INDEX idx_kpi_action_plans_assigned ON public.kpi_action_plans(assigned_to);
CREATE INDEX idx_kpi_reviews_period ON public.kpi_reviews(review_period);

-- Tạo RLS policies
ALTER TABLE public.kpi_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies cho kpi_categories
CREATE POLICY "Everyone can view active KPI categories" ON public.kpi_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage KPI categories" ON public.kpi_categories
  FOR ALL USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

-- RLS policies cho kpi_frameworks
CREATE POLICY "Everyone can view active KPI frameworks" ON public.kpi_frameworks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage KPI frameworks" ON public.kpi_frameworks
  FOR ALL USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

-- RLS policies cho kpi_measurements
CREATE POLICY "Users can view their KPI measurements" ON public.kpi_measurements
  FOR SELECT USING (
    kpi_id IN (
      SELECT id FROM public.kpis 
      WHERE employee_id IN (
        SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create their own KPI measurements" ON public.kpi_measurements
  FOR INSERT WITH CHECK (
    kpi_id IN (
      SELECT id FROM public.kpis 
      WHERE employee_id IN (
        SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all KPI measurements" ON public.kpi_measurements
  FOR ALL USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

-- RLS policies cho kpi_targets
CREATE POLICY "Users can view their KPI targets" ON public.kpi_targets
  FOR SELECT USING (
    kpi_id IN (
      SELECT id FROM public.kpis 
      WHERE employee_id IN (
        SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all KPI targets" ON public.kpi_targets
  FOR ALL USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

-- RLS policies cho kpi_action_plans
CREATE POLICY "Users can view their KPI action plans" ON public.kpi_action_plans
  FOR SELECT USING (
    kpi_id IN (
      SELECT id FROM public.kpis 
      WHERE employee_id IN (
        SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
      )
    ) OR
    assigned_to IN (
      SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their KPI action plans" ON public.kpi_action_plans
  FOR INSERT WITH CHECK (
    kpi_id IN (
      SELECT id FROM public.kpis 
      WHERE employee_id IN (
        SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all KPI action plans" ON public.kpi_action_plans
  FOR ALL USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

-- RLS policies cho kpi_reviews
CREATE POLICY "Users can view their KPI reviews" ON public.kpi_reviews
  FOR SELECT USING (
    kpi_id IN (
      SELECT id FROM public.kpis 
      WHERE employee_id IN (
        SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all KPI reviews" ON public.kpi_reviews
  FOR ALL USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

-- Thêm RLS policies cho bảng kpis hiện tại
CREATE POLICY "Users can view their own KPIs" ON public.kpis
  FOR SELECT USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all KPIs" ON public.kpis
  FOR ALL USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

-- Insert dữ liệu mẫu cho KPI categories (chỉ khi có employees)
INSERT INTO public.kpi_categories (name, description, color, created_by) 
SELECT 'Doanh thu', 'Các chỉ số liên quan đến doanh thu và tăng trưởng kinh doanh', '#10B981', id
FROM public.employees LIMIT 1;

INSERT INTO public.kpi_categories (name, description, color, created_by) 
SELECT 'Chất lượng', 'Các chỉ số đánh giá chất lượng sản phẩm và dịch vụ', '#3B82F6', id
FROM public.employees LIMIT 1;

INSERT INTO public.kpi_categories (name, description, color, created_by) 
SELECT 'Hiệu suất', 'Các chỉ số đánh giá hiệu suất làm việc và năng suất', '#F59E0B', id
FROM public.employees LIMIT 1;

INSERT INTO public.kpi_categories (name, description, color, created_by) 
SELECT 'Khách hàng', 'Các chỉ số liên quan đến sự hài lòng và duy trì khách hàng', '#EF4444', id
FROM public.employees LIMIT 1;

-- Insert dữ liệu mẫu cho KPI frameworks (chỉ khi có employees)
INSERT INTO public.kpi_frameworks (name, description, framework_type, target_level, created_by) 
SELECT 'Khung KPI Công ty', 'Khung KPI tổng thể cho toàn công ty theo chiến lược phát triển', 'company', 'strategic', id
FROM public.employees LIMIT 1;

INSERT INTO public.kpi_frameworks (name, description, framework_type, target_level, created_by) 
SELECT 'Khung KPI Phòng ban', 'Khung KPI cho các phòng ban theo mục tiêu vận hành', 'department', 'operational', id
FROM public.employees LIMIT 1;