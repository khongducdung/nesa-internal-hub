-- Xóa user nesateams@gmail.com và fix reset password configuration

-- 1. Xóa roles của user
DELETE FROM user_system_roles WHERE user_id = '0372f6c3-1e3b-49c1-9684-50a2362bf7ef';

-- 2. Xóa profile 
DELETE FROM profiles WHERE id = '0372f6c3-1e3b-49c1-9684-50a2362bf7ef';

-- 3. Cập nhật lại auth config với thời gian hết hạn dài hơn và custom webhook
UPDATE auth.config 
SET 
  mailer_secure_email_change_enabled = true,
  security_captcha_enabled = false,
  external_email_enabled = true,
  mailer_autoconfirm = false,
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
  jwt_exp = 1800,
  mailer_urlpaths = jsonb_set(
    COALESCE(mailer_urlpaths, '{}'),
    '{recovery}',
    '"/reset-password"'
  )
WHERE instance_id = '00000000-0000-0000-0000-000000000000';

-- 4. Thiết lập webhook cho custom email
INSERT INTO auth.hooks (id, hook_table_id, hook_name, created_at, request_id)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.hook_table_names WHERE table_name = 'auth.users'),
  'send-custom-email',
  now(),
  gen_random_uuid()
)
ON CONFLICT DO NOTHING;