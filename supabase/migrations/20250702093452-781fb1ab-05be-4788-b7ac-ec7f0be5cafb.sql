-- Tạo bảng system_settings cho cài đặt hệ thống
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR NOT NULL UNIQUE,
  value TEXT NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  data_type VARCHAR NOT NULL CHECK (data_type IN ('boolean', 'string', 'number', 'json')),
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage system settings" ON public.system_settings
FOR ALL TO authenticated
USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

CREATE POLICY "Public settings are viewable by everyone" ON public.system_settings
FOR SELECT TO authenticated
USING (is_public = true);

-- Thêm các cài đặt hệ thống mặc định
INSERT INTO public.system_settings (key, value, category, description, data_type, is_public, created_by) VALUES
-- Bảo mật
('session_timeout_minutes', '30', 'security', 'Thời gian timeout phiên đăng nhập (phút)', 'number', false, (SELECT id FROM auth.users LIMIT 1)),
('max_login_attempts', '5', 'security', 'Số lần đăng nhập sai tối đa', 'number', false, (SELECT id FROM auth.users LIMIT 1)),
('require_2fa', 'false', 'security', 'Bắt buộc xác thực 2 bước', 'boolean', false, (SELECT id FROM auth.users LIMIT 1)),
('password_min_length', '8', 'security', 'Độ dài mật khẩu tối thiểu', 'number', false, (SELECT id FROM auth.users LIMIT 1)),

-- Hệ thống
('system_maintenance_mode', 'false', 'system', 'Chế độ bảo trì hệ thống', 'boolean', true, (SELECT id FROM auth.users LIMIT 1)),
('backup_frequency_hours', '24', 'system', 'Tần suất sao lưu tự động (giờ)', 'number', false, (SELECT id FROM auth.users LIMIT 1)),
('max_file_size_mb', '10', 'system', 'Kích thước file tối đa (MB)', 'number', true, (SELECT id FROM auth.users LIMIT 1)),
('system_timezone', '"Asia/Ho_Chi_Minh"', 'system', 'múi giờ hệ thống', 'string', true, (SELECT id FROM auth.users LIMIT 1)),

-- Thông báo
('email_notifications', 'true', 'notifications', 'Bật thông báo qua email', 'boolean', true, (SELECT id FROM auth.users LIMIT 1)),
('sms_notifications', 'false', 'notifications', 'Bật thông báo qua SMS', 'boolean', true, (SELECT id FROM auth.users LIMIT 1)),
('notification_retention_days', '30', 'notifications', 'Thời gian lưu thông báo (ngày)', 'number', false, (SELECT id FROM auth.users LIMIT 1)),

-- API
('api_rate_limit_per_minute', '100', 'api', 'Giới hạn request API mỗi phút', 'number', false, (SELECT id FROM auth.users LIMIT 1)),
('api_key_expiry_days', '365', 'api', 'Thời hạn API key (ngày)', 'number', false, (SELECT id FROM auth.users LIMIT 1)),

-- Giao diện
('default_theme', '"light"', 'ui', 'Giao diện mặc định', 'string', true, (SELECT id FROM auth.users LIMIT 1)),
('items_per_page', '20', 'ui', 'Số mục hiển thị mỗi trang', 'number', true, (SELECT id FROM auth.users LIMIT 1)),
('enable_dark_mode', 'true', 'ui', 'Cho phép chế độ tối', 'boolean', true, (SELECT id FROM auth.users LIMIT 1))

ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = now();