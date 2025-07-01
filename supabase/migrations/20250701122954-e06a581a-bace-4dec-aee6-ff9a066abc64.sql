
-- Cập nhật bảng work_shifts để hỗ trợ nhiều ca trong một công
ALTER TABLE public.work_shifts 
ADD COLUMN IF NOT EXISTS work_sessions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS saturday_work_type VARCHAR DEFAULT 'off' CHECK (saturday_work_type IN ('off', 'full', 'half_morning', 'half_afternoon')),
ADD COLUMN IF NOT EXISTS saturday_work_sessions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS total_work_coefficient DECIMAL DEFAULT 1.0;

-- Cập nhật bảng attendance_settings để cấu hình thời gian chấm công linh hoạt
ALTER TABLE public.attendance_settings 
ADD COLUMN IF NOT EXISTS early_checkin_allowed_minutes INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS late_checkout_allowed_minutes INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS count_early_checkin_as_work BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS count_late_checkout_as_work BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS saturday_work_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS saturday_work_type VARCHAR DEFAULT 'off' CHECK (saturday_work_type IN ('off', 'full', 'half_morning', 'half_afternoon'));

-- Cập nhật dữ liệu mẫu cho work_shifts hiện có
UPDATE public.work_shifts 
SET 
  work_sessions = '[
    {
      "name": "Ca sáng",
      "start_time": "08:00",
      "end_time": "12:00"
    },
    {
      "name": "Ca chiều", 
      "start_time": "13:00",
      "end_time": "17:00"
    }
  ]'::jsonb,
  saturday_work_type = 'half_morning',
  saturday_work_sessions = '[
    {
      "name": "Ca sáng thứ 7",
      "start_time": "08:00", 
      "end_time": "12:00"
    }
  ]'::jsonb,
  total_work_coefficient = 1.0
WHERE name = 'Ca hành chính';

-- Cập nhật attendance_settings mặc định
UPDATE public.attendance_settings 
SET 
  early_checkin_allowed_minutes = 15,
  late_checkout_allowed_minutes = 15,
  count_early_checkin_as_work = false,
  count_late_checkout_as_work = true,
  saturday_work_enabled = true,
  saturday_work_type = 'half_morning'
WHERE is_default = true;
