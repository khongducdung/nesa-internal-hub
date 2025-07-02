-- Thêm các cài đặt hệ thống cơ bản
INSERT INTO public.system_settings (key, value, category, description, data_type, is_public, created_by) VALUES
-- Security Settings
('session_timeout_minutes', '30', 'security', 'Thời gian timeout của phiên đăng nhập (phút)', 'number', false, (SELECT id FROM auth.users LIMIT 1)),
('max_login_attempts', '5', 'security', 'Số lần đăng nhập sai tối đa', 'number', false, (SELECT id FROM auth.users LIMIT 1)),
('require_2fa', 'false', 'security', 'Bắt buộc xác thực 2 bước', 'boolean', false, (SELECT id FROM auth.users LIMIT 1)),
('password_min_length', '8', 'security', 'Độ dài mật khẩu tối thiểu', 'number', false, (SELECT id FROM auth.users LIMIT 1)),

-- System Settings  
('system_maintenance_mode', 'false', 'system', 'Chế độ bảo trì hệ thống', 'boolean', true, (SELECT id FROM auth.users LIMIT 1)),
('backup_frequency_hours', '24', 'system', 'Tần suất sao lưu (giờ)', 'number', false, (SELECT id FROM auth.users LIMIT 1)),
('max_file_size_mb', '10', 'system', 'Kích thước file tối đa (MB)', 'number', true, (SELECT id FROM auth.users LIMIT 1)),
('system_timezone', '"Asia/Ho_Chi_Minh"', 'system', 'Múi giờ hệ thống', 'string', true, (SELECT id FROM auth.users LIMIT 1)),

-- Notification Settings
('email_notifications', 'true', 'notifications', 'Bật thông báo email', 'boolean', true, (SELECT id FROM auth.users LIMIT 1)),
('sms_notifications', 'false', 'notifications', 'Bật thông báo SMS', 'boolean', true, (SELECT id FROM auth.users LIMIT 1)),
('notification_retention_days', '30', 'notifications', 'Lưu giữ thông báo (ngày)', 'number', false, (SELECT id FROM auth.users LIMIT 1)),

-- API Settings
('api_rate_limit_per_minute', '100', 'api', 'Giới hạn API mỗi phút', 'number', false, (SELECT id FROM auth.users LIMIT 1)),
('api_key_expiry_days', '365', 'api', 'Thời hạn API key (ngày)', 'number', false, (SELECT id FROM auth.users LIMIT 1)),

-- UI Settings
('default_theme', '"light"', 'ui', 'Giao diện mặc định', 'string', true, (SELECT id FROM auth.users LIMIT 1)),
('items_per_page', '20', 'ui', 'Số mục trên mỗi trang', 'number', true, (SELECT id FROM auth.users LIMIT 1)),
('enable_dark_mode', 'true', 'ui', 'Cho phép chế độ tối', 'boolean', true, (SELECT id FROM auth.users LIMIT 1))

ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = now();