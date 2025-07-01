
-- Tạo bảng attendance_locations để lưu địa điểm chấm công
CREATE TABLE IF NOT EXISTS public.attendance_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng shift_assignments để phân công ca làm việc
CREATE TABLE IF NOT EXISTS public.shift_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_shift_id UUID REFERENCES public.work_shifts(id) NOT NULL,
  employee_id UUID REFERENCES public.employees(id),
  department_id UUID REFERENCES public.departments(id),
  position_id UUID REFERENCES public.positions(id),
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID NOT NULL,
  CONSTRAINT check_shift_assignment_target CHECK (
    (employee_id IS NOT NULL AND department_id IS NULL AND position_id IS NULL) OR
    (employee_id IS NULL AND department_id IS NOT NULL AND position_id IS NULL) OR
    (employee_id IS NULL AND department_id IS NULL AND position_id IS NOT NULL)
  )
);

-- Tạo trigger cho updated_at
CREATE TRIGGER update_attendance_locations_updated_at 
  BEFORE UPDATE ON public.attendance_locations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_assignments_updated_at 
  BEFORE UPDATE ON public.shift_assignments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tạo index để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_attendance_locations_active ON public.attendance_locations(is_active);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_employee ON public.shift_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_department ON public.shift_assignments(department_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_position ON public.shift_assignments(position_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_work_shift ON public.shift_assignments(work_shift_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_active ON public.shift_assignments(is_active);

-- Thêm RLS policies cho bảng attendance_locations
ALTER TABLE public.attendance_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage attendance locations" 
  ON public.attendance_locations 
  FOR ALL 
  USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

CREATE POLICY "Users can view active attendance locations" 
  ON public.attendance_locations 
  FOR SELECT 
  USING (is_active = true);

-- Thêm RLS policies cho bảng shift_assignments
ALTER TABLE public.shift_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage shift assignments" 
  ON public.shift_assignments 
  FOR ALL 
  USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

CREATE POLICY "Users can view their shift assignments" 
  ON public.shift_assignments 
  FOR SELECT 
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE auth_user_id = auth.uid()
    ) OR
    department_id IN (
      SELECT department_id FROM employees WHERE auth_user_id = auth.uid()
    ) OR
    position_id IN (
      SELECT position_id FROM employees WHERE auth_user_id = auth.uid()
    )
  );
