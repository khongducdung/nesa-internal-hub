-- Xóa user nesateams@gmail.com 
-- 1. Xóa roles của user
DELETE FROM user_system_roles WHERE user_id = '0372f6c3-1e3b-49c1-9684-50a2362bf7ef';

-- 2. Xóa profile 
DELETE FROM profiles WHERE id = '0372f6c3-1e3b-49c1-9684-50a2362bf7ef';