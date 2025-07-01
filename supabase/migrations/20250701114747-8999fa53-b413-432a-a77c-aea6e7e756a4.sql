
-- Cập nhật bảng work_shifts để hỗ trợ các loại lịch làm việc
ALTER TABLE public.work_shifts 
ADD COLUMN IF NOT EXISTS shift_type VARCHAR DEFAULT 'fulltime' CHECK (shift_type IN ('fulltime', 'parttime', 'flexible')),
ADD COLUMN IF NOT EXISTS is_flexible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS min_hours_per_day DECIMAL(4,2) DEFAULT 8.0,
ADD COLUMN IF NOT EXISTS max_hours_per_day DECIMAL(4,2) DEFAULT 8.0,
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#3B82F6';

-- Tạo bảng leave_types để quản lý các loại nghỉ
CREATE TABLE IF NOT EXISTS public.leave_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  is_paid BOOLEAN DEFAULT true,
  max_days_per_year INTEGER DEFAULT 12,
  requires_approval BOOLEAN DEFAULT true,
  color VARCHAR(7) DEFAULT '#10B981',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID NOT NULL
);

-- Cập nhật bảng leave_requests để link với leave_types
ALTER TABLE public.leave_requests 
ADD COLUMN IF NOT EXISTS leave_type_id UUID REFERENCES public.leave_types(id),
ADD COLUMN IF NOT EXISTS manager_notes TEXT,
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Tạo bảng attendance_reports để lưu báo cáo
CREATE TABLE IF NOT EXISTS public.attendance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  report_type VARCHAR NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'custom')),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  filters JSONB DEFAULT '{}',
  file_url TEXT,
  generated_by UUID NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cập nhật bảng attendance để hỗ trợ ghi chú và trạng thái xác nhận
ALTER TABLE public.attendance 
ADD COLUMN IF NOT EXISTS manager_notes TEXT,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_required BOOLEAN DEFAULT false;

-- Tạo trigger
CREATE TRIGGER update_leave_types_updated_at 
  BEFORE UPDATE ON public.leave_types 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tạo index
CREATE INDEX IF NOT EXISTS idx_leave_types_active ON public.leave_types(is_active);
CREATE INDEX IF NOT EXISTS idx_attendance_reports_date ON public.attendance_reports(date_from, date_to);
CREATE INDEX IF NOT EXISTS idx_attendance_reports_type ON public.attendance_reports(report_type);

-- Thêm dữ liệu mẫu cho leave_types
INSERT INTO public.leave_types (name, description, is_paid, max_days_per_year, color, created_by) VALUES 
('Nghỉ phép năm', 'Nghỉ phép có lương theo quy định', true, 12, '#10B981', '00000000-0000-0000-0000-000000000000'),
('Nghỉ ốm', 'Nghỉ ốm có lương', true, 30, '#F59E0B', '00000000-0000-0000-0000-000000000000'),
('Nghỉ không lương', 'Nghỉ không được trả lương', false, 365, '#EF4444', '00000000-0000-0000-0000-000000000000'),
('Nghỉ lễ', 'Nghỉ lễ tết theo quy định nhà nước', true, 10, '#8B5CF6', '00000000-0000-0000-0000-000000000000'),
('Nghỉ thai sản', 'Nghỉ thai sản theo quy định', true, 180, '#EC4899', '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- Cập nhật work_shifts mẫu
UPDATE public.work_shifts 
SET 
  shift_type = 'fulltime',
  min_hours_per_day = 8.0,
  max_hours_per_day = 8.0,
  color = '#3B82F6'
WHERE name = 'Ca hành chính';

-- Thêm ca làm việc part-time và flexible
INSERT INTO public.work_shifts (name, start_time, end_time, break_duration_minutes, days_of_week, shift_type, min_hours_per_day, max_hours_per_day, color, attendance_setting_id) VALUES 
('Ca bán thời gian', '08:00:00', '12:00:00', 0, ARRAY[1,2,3,4,5], 'parttime', 4.0, 4.0, '#10B981', (SELECT id FROM public.attendance_settings WHERE is_default = true LIMIT 1)),
('Ca linh hoạt', '08:00:00', '17:00:00', 60, ARRAY[1,2,3,4,5], 'flexible', 6.0, 10.0, '#F59E0B', (SELECT id FROM public.attendance_settings WHERE is_default = true LIMIT 1))
ON CONFLICT DO NOTHING;
