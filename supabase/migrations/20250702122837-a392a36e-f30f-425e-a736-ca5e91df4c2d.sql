
-- Tạo dữ liệu mẫu cho departments nếu chưa có
INSERT INTO departments (id, name, description, status) VALUES 
('d1111111-1111-1111-1111-111111111111', 'Kinh Doanh', 'Phòng phụ trách bán hàng và phát triển khách hàng', 'active'),
('d2222222-2222-2222-2222-222222222222', 'Kỹ Thuật', 'Phòng phát triển sản phẩm và công nghệ', 'active'),
('d3333333-3333-3333-3333-333333333333', 'Marketing', 'Phòng tiếp thị và truyền thông', 'active'),
('d4444444-4444-4444-4444-444444444444', 'Nhân Sự', 'Phòng quản lý nhân sự và tuyển dụng', 'active')
ON CONFLICT (id) DO NOTHING;

-- Tạo dữ liệu mẫu cho positions nếu chưa có
INSERT INTO positions (id, name, description, department_id, status) VALUES 
('p1111111-1111-1111-1111-111111111111', 'Trưởng phòng Kinh doanh', 'Quản lý phòng kinh doanh', 'd1111111-1111-1111-1111-111111111111', 'active'),
('p2222222-2222-2222-2222-222222222222', 'Trưởng phòng Kỹ thuật', 'Quản lý phòng kỹ thuật', 'd2222222-2222-2222-2222-222222222222', 'active'),
('p3333333-3333-3333-3333-333333333333', 'Nhân viên Kinh doanh', 'Nhân viên bán hàng', 'd1111111-1111-1111-1111-111111111111', 'active'),
('p4444444-4444-4444-4444-444444444444', 'Kỹ sư Phần mềm', 'Phát triển ứng dụng', 'd2222222-2222-2222-2222-222222222222', 'active')
ON CONFLICT (id) DO NOTHING;

-- Tạo dữ liệu mẫu cho employees với department assignments
INSERT INTO employees (id, employee_code, full_name, email, department_id, position_id, employee_level, work_status, hire_date) VALUES 
('e1111111-1111-1111-1111-111111111111', 'EMP001', 'Nguyễn Văn A', 'nguyenvana@company.com', 'd1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'level_1', 'active', '2023-01-15'),
('e2222222-2222-2222-2222-222222222222', 'EMP002', 'Trần Thị B', 'tranthib@company.com', 'd2222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 'level_1', 'active', '2023-02-01'),
('e3333333-3333-3333-3333-333333333333', 'EMP003', 'Lê Văn C', 'levanc@company.com', 'd1111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 'level_3', 'active', '2023-03-10'),
('e4444444-4444-4444-4444-444444444444', 'EMP004', 'Phạm Thị D', 'phamthid@company.com', 'd2222222-2222-2222-2222-222222222222', 'p4444444-4444-4444-4444-444444444444', 'level_3', 'active', '2023-04-05')
ON CONFLICT (id) DO NOTHING;

-- Tạo OKR cycle mẫu nếu chưa có
INSERT INTO okr_cycles (id, name, year, quarter, start_date, end_date, status, is_current) VALUES 
('c1111111-1111-1111-1111-111111111111', 'Q1 2024', 2024, 'Q1', '2024-01-01', '2024-03-31', 'active', true)
ON CONFLICT (id) DO NOTHING;

-- Tạo OKR mẫu cho company
INSERT INTO okr_objectives (id, title, description, cycle_id, year, quarter, progress, status, owner_id, owner_type, created_by, start_date, end_date) VALUES 
('o1111111-1111-1111-1111-111111111111', 'Tăng doanh thu công ty 50%', 'Mục tiêu tăng trưởng doanh thu toàn công ty trong Q1 2024', 'c1111111-1111-1111-1111-111111111111', 2024, 'Q1', 65, 'active', 'company', 'company', 'e1111111-1111-1111-1111-111111111111', '2024-01-01', '2024-03-31')
ON CONFLICT (id) DO NOTHING;

-- Tạo OKR mẫu cho departments
INSERT INTO okr_objectives (id, title, description, cycle_id, year, quarter, progress, status, owner_id, owner_type, department_id, created_by, start_date, end_date) VALUES 
('o2222222-2222-2222-2222-222222222222', 'Phòng Kinh doanh: Tăng khách hàng mới 30%', 'Mục tiêu phát triển 100 khách hàng mới trong Q1', 'c1111111-1111-1111-1111-111111111111', 2024, 'Q1', 45, 'active', 'd1111111-1111-1111-1111-111111111111', 'department', 'd1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '2024-01-01', '2024-03-31'),
('o3333333-3333-3333-3333-333333333333', 'Phòng Kỹ thuật: Ra mắt 3 tính năng mới', 'Phát triển và triển khai 3 tính năng quan trọng', 'c1111111-1111-1111-1111-111111111111', 2024, 'Q1', 70, 'active', 'd2222222-2222-2222-2222-222222222222', 'department', 'd2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', '2024-01-01', '2024-03-31')
ON CONFLICT (id) DO NOTHING;

-- Tạo OKR cá nhân mẫu
INSERT INTO okr_objectives (id, title, description, cycle_id, year, quarter, progress, status, owner_id, owner_type, employee_id, department_id, created_by, start_date, end_date) VALUES 
('o4444444-4444-4444-4444-444444444444', 'Hoàn thành 50 cuộc gọi sales', 'Liên hệ và chăm sóc 50 khách hàng tiềm năng', 'c1111111-1111-1111-1111-111111111111', 2024, 'Q1', 80, 'active', 'e3333333-3333-3333-3333-333333333333', 'individual', 'e3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'e3333333-3333-3333-3333-333333333333', '2024-01-01', '2024-03-31'),
('o5555555-5555-5555-5555-555555555555', 'Phát triển API module', 'Hoàn thành module API cho hệ thống mới', 'c1111111-1111-1111-1111-111111111111', 2024, 'Q1', 60, 'active', 'e4444444-4444-4444-4444-444444444444', 'individual', 'e4444444-4444-4444-4444-444444444444', 'd2222222-2222-2222-2222-222222222222', 'e4444444-4444-4444-4444-444444444444', '2024-01-01', '2024-03-31')
ON CONFLICT (id) DO NOTHING;

-- Tạo key results mẫu
INSERT INTO okr_key_results (id, okr_id, title, target_value, current_value, unit, weight, progress, status) VALUES 
('kr111111-1111-1111-1111-111111111111', 'o2222222-2222-2222-2222-222222222222', 'Tăng số khách hàng mới', 100, 45, 'khách hàng', 50, 45, 'on_track'),
('kr222222-2222-2222-2222-222222222222', 'o2222222-2222-2222-2222-222222222222', 'Tăng doanh thu từ khách hàng mới', 500000000, 200000000, 'VNĐ', 50, 40, 'on_track'),
('kr333333-3333-3333-3333-333333333333', 'o3333333-3333-3333-3333-333333333333', 'Hoàn thành tính năng thanh toán', 1, 1, 'tính năng', 40, 100, 'completed'),
('kr444444-4444-4444-4444-444444444444', 'o3333333-3333-3333-3333-333333333333', 'Hoàn thành tính năng báo cáo', 1, 0.7, 'tính năng', 30, 70, 'on_track'),
('kr555555-5555-5555-5555-555555555555', 'o3333333-3333-3333-3333-333333333333', 'Hoàn thành tính năng dashboard', 1, 0.4, 'tính năng', 30, 40, 'at_risk')
ON CONFLICT (id) DO NOTHING;

-- Cập nhật RLS policies cho department OKRs
DROP POLICY IF EXISTS "Department managers can manage their department OKRs" ON okr_objectives;

CREATE POLICY "Department managers can manage their department OKRs" 
ON okr_objectives 
FOR ALL 
TO authenticated 
USING (
  (owner_type = 'department' AND department_id IN (
    SELECT e.department_id 
    FROM employees e 
    WHERE e.auth_user_id = auth.uid() 
    AND e.employee_level IN ('level_1', 'level_2')
  ))
  OR created_by = auth.uid()
  OR owner_type = 'company'
  OR (owner_type = 'individual' AND employee_id IN (
    SELECT e.id 
    FROM employees e 
    WHERE e.auth_user_id = auth.uid()
  ))
);
