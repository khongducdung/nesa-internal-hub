-- Insert default system settings
INSERT INTO public.system_settings (key, value, category, description, data_type, is_public, created_by) VALUES
-- Security Settings
('require_2fa', 'true', 'security', 'Yêu cầu xác thực 2 bước cho tất cả người dùng', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('account_lockout_enabled', 'true', 'security', 'Khóa tài khoản sau nhiều lần đăng nhập thất bại', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('account_lockout_attempts', '5', 'security', 'Số lần đăng nhập thất bại trước khi khóa', 'number', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('session_timeout_enabled', 'false', 'security', 'Tự động đăng xuất sau thời gian không hoạt động', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('session_timeout_minutes', '30', 'security', 'Thời gian timeout phiên làm việc (phút)', 'number', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('password_min_length', '8', 'security', 'Độ dài tối thiểu của mật khẩu', 'number', true, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('password_require_special_chars', 'true', 'security', 'Yêu cầu ký tự đặc biệt trong mật khẩu', 'boolean', true, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),

-- Notification Settings  
('email_notifications_enabled', 'true', 'notifications', 'Bật thông báo email hệ thống', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('performance_reminders_enabled', 'true', 'notifications', 'Thông báo nhắc nhở đánh giá hiệu suất', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('weekly_reports_enabled', 'false', 'notifications', 'Gửi báo cáo tổng kết hàng tuần', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('notification_digest_enabled', 'true', 'notifications', 'Gửi tóm tắt thông báo hàng ngày', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('slack_integration_enabled', 'false', 'notifications', 'Tích hợp thông báo Slack', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),

-- System Settings
('auto_backup_enabled', 'true', 'system', 'Sao lưu tự động dữ liệu hệ thống', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('backup_frequency_hours', '24', 'system', 'Tần suất sao lưu (giờ)', 'number', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('backup_retention_days', '30', 'system', 'Thời gian lưu trữ bản sao lưu (ngày)', 'number', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('detailed_logging_enabled', 'true', 'system', 'Ghi log chi tiết hoạt động người dùng', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('maintenance_mode_enabled', 'false', 'system', 'Kích hoạt chế độ bảo trì hệ thống', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('system_version', '"NESA v2.1.0"', 'system', 'Phiên bản hệ thống hiện tại', 'string', true, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('max_file_upload_size_mb', '10', 'system', 'Kích thước tối đa file upload (MB)', 'number', true, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),

-- API Settings
('api_rate_limiting_enabled', 'true', 'api', 'Bật giới hạn tốc độ API', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('api_rate_limit_per_minute', '100', 'api', 'Số request API tối đa mỗi phút', 'number', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('api_logging_enabled', 'false', 'api', 'Ghi log tất cả API requests', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('webhook_timeout_seconds', '30', 'api', 'Timeout cho webhook requests (giây)', 'number', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('api_versioning_enabled', 'true', 'api', 'Bật versioning cho API', 'boolean', false, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),

-- UI/UX Settings
('theme_mode', '"auto"', 'ui', 'Chế độ theme mặc định (light/dark/auto)', 'string', true, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('default_language', '"vi"', 'ui', 'Ngôn ngữ mặc định của hệ thống', 'string', true, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('sidebar_collapsed_default', 'false', 'ui', 'Thu gọn sidebar theo mặc định', 'boolean', true, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com')),
('items_per_page', '20', 'ui', 'Số item hiển thị mỗi trang', 'number', true, (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com'));