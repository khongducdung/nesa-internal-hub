
-- Tạo bảng cài đặt chấm công
CREATE TABLE public.attendance_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  work_start_time TIME NOT NULL DEFAULT '08:00:00',
  work_end_time TIME NOT NULL DEFAULT '17:00:00',
  break_start_time TIME DEFAULT '12:00:00',
  break_end_time TIME DEFAULT '13:00:00',
  late_threshold_minutes INTEGER DEFAULT 15,
  early_leave_threshold_minutes INTEGER DEFAULT 15,
  overtime_start_after_minutes INTEGER DEFAULT 0,
  weekend_work_allowed BOOLEAN DEFAULT false,
  require_gps_check BOOLEAN DEFAULT false,
  gps_radius_meters INTEGER DEFAULT 100,
  is_default BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID NOT NULL
);

-- Tạo bảng ca làm việc
CREATE TABLE public.work_shifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_duration_minutes INTEGER DEFAULT 60,
  days_of_week INTEGER[] NOT NULL, -- 0=Sunday, 1=Monday, ... 6=Saturday
  attendance_setting_id UUID REFERENCES public.attendance_settings(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng địa điểm chấm công
CREATE TABLE public.attendance_locations (
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

-- Tạo bảng áp dụng cài đặt chấm công cho nhân viên/phòng ban
CREATE TABLE public.attendance_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attendance_setting_id UUID REFERENCES public.attendance_settings(id) NOT NULL,
  employee_id UUID REFERENCES public.employees(id),
  department_id UUID REFERENCES public.departments(id),
  position_id UUID REFERENCES public.positions(id),
  work_shift_id UUID REFERENCES public.work_shifts(id),
  location_id UUID REFERENCES public.attendance_locations(id),
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID NOT NULL,
  CONSTRAINT check_assignment_target CHECK (
    (employee_id IS NOT NULL AND department_id IS NULL AND position_id IS NULL) OR
    (employee_id IS NULL AND department_id IS NOT NULL AND position_id IS NULL) OR
    (employee_id IS NULL AND department_id IS NULL AND position_id IS NOT NULL)
  )
);

-- Cập nhật bảng attendance hiện tại
ALTER TABLE public.attendance 
ADD COLUMN IF NOT EXISTS attendance_setting_id UUID REFERENCES public.attendance_settings(id),
ADD COLUMN IF NOT EXISTS work_shift_id UUID REFERENCES public.work_shifts(id),
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES public.attendance_locations(id),
ADD COLUMN IF NOT EXISTS check_in_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS check_in_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS check_out_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS check_out_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS is_late BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_early_leave BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS late_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS early_leave_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_work_hours DECIMAL(4, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.employees(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Tạo bảng ngày nghỉ và ngày lễ
CREATE TABLE public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  year INTEGER,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo trigger cập nhật updated_at cho các bảng mới
CREATE TRIGGER update_attendance_settings_updated_at BEFORE UPDATE ON public.attendance_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_shifts_updated_at BEFORE UPDATE ON public.work_shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_locations_updated_at BEFORE UPDATE ON public.attendance_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_assignments_updated_at BEFORE UPDATE ON public.attendance_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON public.holidays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tạo index để tối ưu hiệu suất (chỉ những index chưa tồn tại)
CREATE INDEX IF NOT EXISTS idx_attendance_assignments_employee ON public.attendance_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_assignments_department ON public.attendance_assignments(department_id);
CREATE INDEX IF NOT EXISTS idx_attendance_assignments_position ON public.attendance_assignments(position_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date_new ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_holidays_date ON public.holidays(date);

-- Thêm dữ liệu mẫu cho cài đặt chấm công mặc định
INSERT INTO public.attendance_settings (
  name,
  description,
  work_start_time,
  work_end_time,
  break_start_time,
  break_end_time,
  late_threshold_minutes,
  early_leave_threshold_minutes,
  overtime_start_after_minutes,
  weekend_work_allowed,
  require_gps_check,
  gps_radius_meters,
  is_default,
  created_by
) VALUES (
  'Cài đặt chấm công mặc định',
  'Cài đặt chấm công tiêu chuẩn cho văn phòng',
  '08:00:00',
  '17:00:00',
  '12:00:00',
  '13:00:00',
  15,
  15,
  30,
  false,
  false,
  100,
  true,
  '00000000-0000-0000-0000-000000000000'
);

-- Thêm ca làm việc mặc định
INSERT INTO public.work_shifts (
  name,
  start_time,
  end_time,
  break_duration_minutes,
  days_of_week,
  attendance_setting_id
) VALUES (
  'Ca hành chính',
  '08:00:00',
  '17:00:00',
  60,
  ARRAY[1,2,3,4,5], -- Thứ 2 đến Thứ 6
  (SELECT id FROM public.attendance_settings WHERE is_default = true LIMIT 1)
);
