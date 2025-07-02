-- Tạo 2 tài khoản người dùng và profiles
-- Account 1: Kỹ Thuật Hệ Thống (admin)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'nesateams@gmail.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Kỹ Thuật Hệ Thống"}',
  false,
  'authenticated'
);

-- Account 2: Quản lý nhân sự (admin)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'nesatuyendung@gmail.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Quản lý nhân sự"}',
  false,
  'authenticated'
);

-- Tạo profiles tương ứng
INSERT INTO public.profiles (id, full_name, email)
SELECT 
  id,
  raw_user_meta_data ->> 'full_name',
  email
FROM auth.users 
WHERE email IN ('nesateams@gmail.com', 'nesatuyendung@gmail.com');

-- Assign admin roles
INSERT INTO public.user_system_roles (user_id, role)
SELECT id, 'admin'::system_role
FROM auth.users 
WHERE email IN ('nesateams@gmail.com', 'nesatuyendung@gmail.com');