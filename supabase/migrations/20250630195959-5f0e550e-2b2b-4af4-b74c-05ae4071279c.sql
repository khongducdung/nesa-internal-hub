
-- Tạo bảng áp dụng ca làm việc cho nhân viên/phòng ban/vị trí
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

-- Cập nhật bảng attendance để hỗ trợ nhiều lần check in/out
ALTER TABLE public.attendance 
ADD COLUMN IF NOT EXISTS shift_start_check_in TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shift_start_check_out TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shift_end_check_in TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shift_end_check_out TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS daily_start_check_in TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS daily_end_check_out TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS check_type VARCHAR DEFAULT 'daily' CHECK (check_type IN ('daily', 'shift')),
ADD COLUMN IF NOT EXISTS shift_assignment_id UUID REFERENCES public.shift_assignments(id);

-- Tạo bảng lưu trữ GPS locations cho check in/out
CREATE TABLE IF NOT EXISTS public.attendance_check_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attendance_id UUID REFERENCES public.attendance(id) NOT NULL,
  check_type VARCHAR NOT NULL CHECK (check_type IN ('shift_start_in', 'shift_start_out', 'shift_end_in', 'shift_end_out', 'daily_start', 'daily_end')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo trigger cho shift_assignments
CREATE TRIGGER update_shift_assignments_updated_at 
  BEFORE UPDATE ON public.shift_assignments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tạo index để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_shift_assignments_employee ON public.shift_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_department ON public.shift_assignments(department_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_position ON public.shift_assignments(position_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_work_shift ON public.shift_assignments(work_shift_id);
CREATE INDEX IF NOT EXISTS idx_attendance_check_locations_attendance ON public.attendance_check_locations(attendance_id);

-- Thêm dữ liệu mẫu cho shift assignments
INSERT INTO public.shift_assignments (
  work_shift_id,
  department_id,
  effective_from,
  created_by
) 
SELECT 
  ws.id,
  d.id,
  CURRENT_DATE,
  '00000000-0000-0000-0000-000000000000'
FROM public.work_shifts ws
CROSS JOIN public.departments d
WHERE ws.name = 'Ca hành chính'
AND d.name IN ('Phòng Nhân sự', 'Phòng Kế toán')
ON CONFLICT DO NOTHING;
