-- Tạo profiles cho employees trước khi tạo KPIs
INSERT INTO public.profiles (id, employee_id, full_name, email, employee_code, department_id, position_id) 
SELECT 
  id, id, full_name, email, employee_code, department_id, position_id
FROM employees 
WHERE full_name IN ('Nguyễn Văn An', 'Lê Minh Cường', 'Phạm Thị Dung', 'Đỗ Minh Giang', 'Bùi Thị Hạnh', 'Trần Thị Bình')
ON CONFLICT (id) DO NOTHING;