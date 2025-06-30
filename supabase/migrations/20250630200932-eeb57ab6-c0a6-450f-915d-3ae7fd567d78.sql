
-- Cập nhật bảng attendance_settings để hỗ trợ cấu hình checkin/checkout
ALTER TABLE public.attendance_settings 
ADD COLUMN IF NOT EXISTS check_type_config VARCHAR DEFAULT 'daily' CHECK (check_type_config IN ('daily', 'shift', 'both')),
ADD COLUMN IF NOT EXISTS require_shift_start_checkin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS require_shift_start_checkout BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS require_shift_end_checkin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS require_shift_end_checkout BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS require_daily_start_checkin BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS require_daily_end_checkout BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_multiple_checkins BOOLEAN DEFAULT false;

-- Cập nhật cài đặt mặc định
UPDATE public.attendance_settings 
SET 
  check_type_config = 'daily',
  require_daily_start_checkin = true,
  require_daily_end_checkout = true,
  require_shift_start_checkin = false,
  require_shift_start_checkout = false,
  require_shift_end_checkin = false,
  require_shift_end_checkout = false,
  allow_multiple_checkins = false
WHERE is_default = true;
