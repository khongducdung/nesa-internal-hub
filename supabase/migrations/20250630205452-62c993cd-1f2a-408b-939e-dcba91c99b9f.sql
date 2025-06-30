
-- Tạo dữ liệu demo cho work_groups với UUID hợp lệ
INSERT INTO public.work_groups (id, name, description, created_by) VALUES
('12345678-1234-5678-9abc-123456789abc', 'Phát triển sản phẩm', 'Các nhiệm vụ liên quan đến phát triển và cải tiến sản phẩm', 'e2222222-2222-2222-2222-222222222221'),
('23456789-2345-6789-abcd-23456789abcd', 'Bán hàng và marketing', 'Các hoạt động bán hàng, tiếp thị và phát triển khách hàng', 'e2222222-2222-2222-2222-222222222221'),
('34567890-3456-7890-bcde-3456789abcde', 'Quản lý dự án', 'Lập kế hoạch, điều phối và giám sát các dự án', 'e2222222-2222-2222-2222-222222222221')
ON CONFLICT (id) DO NOTHING;

-- Tạo chu kỳ đánh giá demo
INSERT INTO public.performance_cycles (id, name, start_date, end_date, status, created_by) VALUES
('45678901-4567-8901-cdef-456789abcdef', 'Đánh giá Q1 2025', '2025-01-01', '2025-03-31', 'active', 'e2222222-2222-2222-2222-222222222221'),
('56789012-5678-9012-defa-56789abcdefa', 'Đánh giá tháng 1/2025', '2025-01-01', '2025-01-31', 'active', 'e2222222-2222-2222-2222-222222222221')
ON CONFLICT (id) DO NOTHING;

-- Tạo các phân công demo cho 3 nhân viên
INSERT INTO public.performance_assignments (id, performance_cycle_id, employee_id, work_group_id, kpi_target, kpi_unit, description, salary_percentage, status, created_by) VALUES
-- Phân công cho Phạm Thị Dung (Team Lead Backend)
('67890123-6789-0123-efab-6789abcdefab', '45678901-4567-8901-cdef-456789abcdef', 'e2222222-2222-2222-2222-222222222222', '12345678-1234-5678-9abc-123456789abc', 5, 'feature', 'Hoàn thành 5 tính năng mới cho hệ thống backend', 25, 'assigned', 'e2222222-2222-2222-2222-222222222221'),

-- Phân công cho Hoàng Văn Em (Senior Developer)
('78901234-7890-1234-fabc-789abcdefabc', '45678901-4567-8901-cdef-456789abcdef', 'e2222222-2222-2222-2222-222222222223', '12345678-1234-5678-9abc-123456789abc', 8, 'bug fix', 'Sửa 8 lỗi critical trong hệ thống', 20, 'assigned', 'e2222222-2222-2222-2222-222222222221'),

-- Phân công cho Vũ Thị Phương (Junior Developer)
('89012345-8901-2345-abcd-89abcdefabcd', '56789012-5678-9012-defa-56789abcdefa', 'e2222222-2222-2222-2222-222222222224', '34567890-3456-7890-bcde-3456789abcde', 3, 'task', 'Hoàn thành 3 task documentation và testing', 15, 'assigned', 'e2222222-2222-2222-2222-222222222221')
ON CONFLICT (id) DO NOTHING;
