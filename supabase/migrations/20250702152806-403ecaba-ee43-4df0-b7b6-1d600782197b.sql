
-- Xóa toàn bộ dữ liệu và bảng OKR cũ
DROP TABLE IF EXISTS public.okr_user_achievements CASCADE;
DROP TABLE IF EXISTS public.okr_achievements CASCADE;
DROP TABLE IF EXISTS public.okr_collaborators CASCADE;
DROP TABLE IF EXISTS public.okr_comments CASCADE;
DROP TABLE IF EXISTS public.okr_alignments CASCADE;
DROP TABLE IF EXISTS public.okr_key_results CASCADE;
DROP TABLE IF EXISTS public.okr_objectives CASCADE;
DROP TABLE IF EXISTS public.okr_cycles CASCADE;

DROP TYPE IF EXISTS okr_owner_type CASCADE;
DROP TYPE IF EXISTS okr_cycle_status CASCADE;
DROP TYPE IF EXISTS achievement_type CASCADE;

-- Tạo lại enums
CREATE TYPE public.okr_owner_type AS ENUM ('company', 'department', 'individual');
CREATE TYPE public.okr_cycle_status AS ENUM ('planning', 'active', 'review', 'closed');

-- Tạo bảng OKR Cycles (Chu kỳ OKR)
CREATE TABLE public.okr_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  quarter VARCHAR,
  cycle_type VARCHAR NOT NULL CHECK (cycle_type IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status okr_cycle_status DEFAULT 'planning',
  is_current BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng OKR Objectives (Mục tiêu)
CREATE TABLE public.okr_objectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  cycle_id UUID REFERENCES public.okr_cycles(id),
  year INTEGER NOT NULL,
  quarter VARCHAR,
  progress NUMERIC(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  owner_type okr_owner_type NOT NULL,
  owner_id VARCHAR NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  employee_id UUID REFERENCES public.employees(id),
  parent_okr_id UUID REFERENCES public.okr_objectives(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng Key Results
CREATE TABLE public.okr_key_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  okr_id UUID NOT NULL REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC DEFAULT 0,
  unit VARCHAR NOT NULL,
  weight NUMERIC(5,2) DEFAULT 100 CHECK (weight >= 0 AND weight <= 100),
  progress NUMERIC(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR DEFAULT 'not_started' CHECK (status IN ('not_started', 'on_track', 'at_risk', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_okr_objectives_owner ON public.okr_objectives(owner_type, owner_id);
CREATE INDEX idx_okr_objectives_parent ON public.okr_objectives(parent_okr_id);
CREATE INDEX idx_okr_objectives_cycle ON public.okr_objectives(cycle_id);
CREATE INDEX idx_okr_key_results_okr ON public.okr_key_results(okr_id);

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_okr_cycles_updated_at
  BEFORE UPDATE ON public.okr_cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_okr_objectives_updated_at
  BEFORE UPDATE ON public.okr_objectives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_okr_key_results_updated_at
  BEFORE UPDATE ON public.okr_key_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tạo RLS policies
ALTER TABLE public.okr_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_key_results ENABLE ROW LEVEL SECURITY;

-- RLS cho okr_cycles
CREATE POLICY "Everyone can view active cycles" ON public.okr_cycles
  FOR SELECT USING (status = 'active' OR status = 'planning');

CREATE POLICY "Admins can manage cycles" ON public.okr_cycles
  FOR ALL USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

-- RLS cho okr_objectives
CREATE POLICY "Company OKRs are viewable by everyone" ON public.okr_objectives
  FOR SELECT USING (owner_type = 'company');

CREATE POLICY "Department OKRs viewable by department members" ON public.okr_objectives
  FOR SELECT USING (
    owner_type = 'department' AND department_id IN (
      SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Individual OKRs viewable by owner" ON public.okr_objectives
  FOR SELECT USING (
    owner_type = 'individual' AND employee_id IN (
      SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own individual OKRs" ON public.okr_objectives
  FOR INSERT WITH CHECK (
    owner_type = 'individual' AND employee_id IN (
      SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Managers can create department OKRs" ON public.okr_objectives
  FOR INSERT WITH CHECK (
    owner_type = 'department' AND department_id IN (
      SELECT department_id FROM public.employees 
      WHERE auth_user_id = auth.uid() AND employee_level IN ('level_1', 'level_2')
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Admins can create company OKRs" ON public.okr_objectives
  FOR INSERT WITH CHECK (
    owner_type = 'company' AND (
      has_system_role(auth.uid(), 'admin'::system_role) OR 
      has_system_role(auth.uid(), 'super_admin'::system_role)
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Users can update their own OKRs" ON public.okr_objectives
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all OKRs" ON public.okr_objectives
  FOR ALL USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

-- RLS cho okr_key_results
CREATE POLICY "Key results follow OKR visibility" ON public.okr_key_results
  FOR SELECT USING (
    okr_id IN (
      SELECT id FROM public.okr_objectives WHERE
        owner_type = 'company' OR
        (owner_type = 'department' AND department_id IN (
          SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        (owner_type = 'individual' AND employee_id IN (
          SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
        ))
    )
  );

CREATE POLICY "Users can manage key results of their OKRs" ON public.okr_key_results
  FOR ALL USING (
    okr_id IN (
      SELECT id FROM public.okr_objectives WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all key results" ON public.okr_key_results
  FOR ALL USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

-- Tạo chu kỳ hiện tại
INSERT INTO public.okr_cycles (name, year, quarter, cycle_type, start_date, end_date, status, is_current, created_by) VALUES
('Q4 2024', 2024, 'Q4', 'quarterly', '2024-10-01', '2024-12-31', 'active', true, (SELECT id FROM auth.users LIMIT 1));

-- Tạo dữ liệu demo OKR Công ty
INSERT INTO public.okr_objectives (title, description, cycle_id, year, quarter, owner_type, owner_id, progress, status, start_date, end_date, created_by) VALUES
('Tăng doanh thu công ty 25%', 'Đạt mục tiêu tăng trưởng doanh thu 25% so với năm trước thông qua mở rộng thị trường và cải thiện chất lượng dịch vụ', (SELECT id FROM public.okr_cycles WHERE is_current = true), 2024, 'Q4', 'company', 'company', 65, 'active', '2024-10-01', '2024-12-31', (SELECT id FROM auth.users LIMIT 1)),
('Nâng cao chất lượng sản phẩm', 'Cải thiện chất lượng sản phẩm và dịch vụ để đạt mức hài lòng khách hàng 95%', (SELECT id FROM public.okr_cycles WHERE is_current = true), 2024, 'Q4', 'company', 'company', 78, 'active', '2024-10-01', '2024-12-31', (SELECT id FROM auth.users LIMIT 1));

-- Tạo OKR Phòng ban liên kết với OKR Công ty
INSERT INTO public.okr_objectives (title, description, cycle_id, year, quarter, owner_type, owner_id, department_id, parent_okr_id, progress, status, start_date, end_date, created_by) VALUES
('Phòng Kinh doanh đạt 12 tỷ doanh thu', 'Phòng Kinh doanh đóng góp 12 tỷ VND vào mục tiêu tăng doanh thu của công ty', (SELECT id FROM public.okr_cycles WHERE is_current = true), 2024, 'Q4', 'department', (SELECT id FROM public.departments WHERE name LIKE '%Kinh doanh%' LIMIT 1), (SELECT id FROM public.departments WHERE name LIKE '%Kinh doanh%' LIMIT 1), (SELECT id FROM public.okr_objectives WHERE title LIKE '%Tăng doanh thu%' LIMIT 1), 70, 'active', '2024-10-01', '2024-12-31', (SELECT id FROM auth.users LIMIT 1)),
('Phòng Kỹ thuật nâng cao chất lượng sản phẩm', 'Giảm 50% bug trong sản phẩm và cải thiện hiệu suất hệ thống', (SELECT id FROM public.okr_cycles WHERE is_current = true), 2024, 'Q4', 'department', (SELECT id FROM public.departments WHERE name LIKE '%Kỹ thuật%' LIMIT 1), (SELECT id FROM public.departments WHERE name LIKE '%Kỹ thuật%' LIMIT 1), (SELECT id FROM public.okr_objectives WHERE title LIKE '%chất lượng sản phẩm%' LIMIT 1), 85, 'active', '2024-10-01', '2024-12-31', (SELECT id FROM auth.users LIMIT 1));

-- Tạo OKR cá nhân liên kết với OKR Phòng ban
INSERT INTO public.okr_objectives (title, description, cycle_id, year, quarter, owner_type, owner_id, employee_id, parent_okr_id, progress, status, start_date, end_date, created_by) VALUES
('Lê Minh Cường đạt 2 tỷ doanh số', 'Hoàn thành 2 tỷ VND doanh số cá nhân trong Q4 2024', (SELECT id FROM public.okr_cycles WHERE is_current = true), 2024, 'Q4', 'individual', (SELECT id FROM public.employees WHERE full_name LIKE '%Lê Minh Cường%' LIMIT 1), (SELECT id FROM public.employees WHERE full_name LIKE '%Lê Minh Cường%' LIMIT 1), (SELECT id FROM public.okr_objectives WHERE title LIKE '%Phòng Kinh doanh%' LIMIT 1), 60, 'active', '2024-10-01', '2024-12-31', (SELECT auth_user_id FROM public.employees WHERE full_name LIKE '%Lê Minh Cường%' LIMIT 1)),
('Phạm Thị Dung phát triển 50 khách hàng mới', 'Tìm kiếm và phát triển 50 khách hàng mới cho công ty', (SELECT id FROM public.okr_cycles WHERE is_current = true), 2024, 'Q4', 'individual', (SELECT id FROM public.employees WHERE full_name LIKE '%Phạm Thị Dung%' LIMIT 1), (SELECT id FROM public.employees WHERE full_name LIKE '%Phạm Thị Dung%' LIMIT 1), (SELECT id FROM public.okr_objectives WHERE title LIKE '%Phòng Kinh doanh%' LIMIT 1), 45, 'active', '2024-10-01', '2024-12-31', (SELECT auth_user_id FROM public.employees WHERE full_name LIKE '%Phạm Thị Dung%' LIMIT 1));

-- Tạo Key Results cho các OKR
INSERT INTO public.okr_key_results (okr_id, title, description, target_value, current_value, unit, weight, progress, status) VALUES
-- Key Results cho OKR Công ty "Tăng doanh thu"
((SELECT id FROM public.okr_objectives WHERE title LIKE '%Tăng doanh thu%' LIMIT 1), 'Đạt doanh thu 50 tỷ VND', 'Tổng doanh thu cả năm đạt 50 tỷ VND', 50, 32.5, 'tỷ VND', 60, 65, 'on_track'),
((SELECT id FROM public.okr_objectives WHERE title LIKE '%Tăng doanh thu%' LIMIT 1), 'Mở rộng 100 khách hàng mới', 'Thu hút 100 khách hàng doanh nghiệp mới', 100, 70, 'khách hàng', 40, 70, 'on_track'),

-- Key Results cho OKR Công ty "Chất lượng sản phẩm"
((SELECT id FROM public.okr_objectives WHERE title LIKE '%chất lượng sản phẩm%' LIMIT 1), 'Đạt 95% hài lòng khách hàng', 'Tỷ lệ hài lòng khách hàng đạt 95%', 95, 88, '%', 50, 85, 'on_track'),
((SELECT id FROM public.okr_objectives WHERE title LIKE '%chất lượng sản phẩm%' LIMIT 1), 'Giảm 50% phản hồi tiêu cực', 'Giảm số lượng phản hồi tiêu cực từ khách hàng', 50, 35, '%', 50, 70, 'on_track'),

-- Key Results cho OKR Phòng Kinh doanh
((SELECT id FROM public.okr_objectives WHERE title LIKE '%Phòng Kinh doanh%' LIMIT 1), 'Doanh thu Q4 đạt 12 tỷ', 'Hoàn thành 12 tỷ VND trong Q4', 12, 8.4, 'tỷ VND', 70, 70, 'on_track'),
((SELECT id FROM public.okr_objectives WHERE title LIKE '%Phòng Kinh doanh%' LIMIT 1), 'Tỷ lệ chốt deal 25%', 'Nâng cao tỷ lệ chốt deal lên 25%', 25, 22, '%', 30, 88, 'on_track'),

-- Key Results cho OKR cá nhân Lê Minh Cường
((SELECT id FROM public.okr_objectives WHERE title LIKE '%Lê Minh Cường%' LIMIT 1), 'Doanh số tháng 10: 700 triệu', 'Hoàn thành 700 triệu trong tháng 10', 700, 420, 'triệu VND', 30, 60, 'on_track'),
((SELECT id FROM public.okr_objectives WHERE title LIKE '%Lê Minh Cường%' LIMIT 1), 'Doanh số tháng 11: 650 triệu', 'Hoàn thành 650 triệu trong tháng 11', 650, 390, 'triệu VND', 35, 60, 'on_track'),
((SELECT id FROM public.okr_objectives WHERE title LIKE '%Lê Minh Cường%' LIMIT 1), 'Doanh số tháng 12: 650 triệu', 'Hoàn thành 650 triệu trong tháng 12', 650, 0, 'triệu VND', 35, 0, 'not_started');
