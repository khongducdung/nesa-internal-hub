-- Tạo profile nếu chưa có và cập nhật tên
INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, 'Triển Khai Kỹ Thuật'
FROM auth.users 
WHERE email = 'nesateams@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
    full_name = 'Triển Khai Kỹ Thuật',
    email = 'nesateams@gmail.com';