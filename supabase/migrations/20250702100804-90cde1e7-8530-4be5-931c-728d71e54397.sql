-- Cập nhật cấu hình auth để sử dụng custom email và thời gian hết hạn 30 phút
UPDATE auth.config 
SET 
  mailer_secure_email_change_enabled = true,
  security_captcha_enabled = false,
  external_email_enabled = true,
  mailer_templates = jsonb_set(
    COALESCE(mailer_templates, '{}'),
    '{recovery}',
    '{
      "subject": "NESA Groups - Đặt lại mật khẩu",
      "body": "Nhấn vào liên kết để đặt lại mật khẩu: {{ .ConfirmationURL }}",
      "template": "recovery"
    }'
  ),
  password_min_length = 6,
  jwt_exp = 1800
WHERE instance_id = '00000000-0000-0000-0000-000000000000';