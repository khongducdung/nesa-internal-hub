
-- Tạo 5 phòng ban demo
INSERT INTO public.departments (id, name, description, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Phòng Nhân sự', 'Quản lý nhân sự và tuyển dụng', 'active'),
('22222222-2222-2222-2222-222222222222', 'Phòng Kỹ thuật', 'Phát triển sản phẩm và công nghệ', 'active'),
('33333333-3333-3333-3333-333333333333', 'Phòng Kinh doanh', 'Bán hàng và phát triển thị trường', 'active'),
('44444444-4444-4444-4444-444444444444', 'Phòng Tài chính', 'Quản lý tài chính và kế toán', 'active'),
('55555555-5555-5555-5555-555555555555', 'Phòng Marketing', 'Truyền thông và quảng cáo', 'active')
ON CONFLICT (id) DO NOTHING;

-- Tạo các vị trí công việc cho từng phòng ban với UUID hợp lệ
INSERT INTO public.positions (id, name, description, department_id, level, status) VALUES
-- Phòng Nhân sự
('a1111111-1111-1111-1111-111111111111', 'Trưởng phòng Nhân sự', 'Quản lý toàn bộ hoạt động nhân sự', '11111111-1111-1111-1111-111111111111', 'level_1', 'active'),
('a1111111-1111-1111-1111-111111111112', 'Chuyên viên Tuyển dụng', 'Thực hiện tuyển dụng nhân sự', '11111111-1111-1111-1111-111111111111', 'level_3', 'active'),
-- Phòng Kỹ thuật
('a2222222-2222-2222-2222-222222222221', 'Trưởng phòng Kỹ thuật', 'Quản lý phát triển sản phẩm', '22222222-2222-2222-2222-222222222222', 'level_1', 'active'),
('a2222222-2222-2222-2222-222222222222', 'Team Lead Backend', 'Dẫn dắt nhóm phát triển Backend', '22222222-2222-2222-2222-222222222222', 'level_2', 'active'),
('a2222222-2222-2222-2222-222222222223', 'Senior Developer', 'Phát triển ứng dụng', '22222222-2222-2222-2222-222222222222', 'level_2', 'active'),
('a2222222-2222-2222-2222-222222222224', 'Junior Developer', 'Hỗ trợ phát triển ứng dụng', '22222222-2222-2222-2222-222222222222', 'level_3', 'active'),
-- Phòng Kinh doanh
('a3333333-3333-3333-3333-333333333331', 'Trưởng phòng Kinh doanh', 'Quản lý hoạt động kinh doanh', '33333333-3333-3333-3333-333333333333', 'level_1', 'active'),
('a3333333-3333-3333-3333-333333333332', 'Account Manager', 'Quản lý khách hàng doanh nghiệp', '33333333-3333-3333-3333-333333333333', 'level_2', 'active'),
-- Phòng Tài chính
('a4444444-4444-4444-4444-444444444441', 'Trưởng phòng Tài chính', 'Quản lý tài chính công ty', '44444444-4444-4444-4444-444444444444', 'level_1', 'active'),
-- Phòng Marketing
('a5555555-5555-5555-5555-555555555551', 'Trưởng phòng Marketing', 'Quản lý hoạt động marketing', '55555555-5555-5555-5555-555555555555', 'level_1', 'active')
ON CONFLICT (id) DO NOTHING;

-- Tạo 10 nhân viên demo với các cấp bậc khác nhau
INSERT INTO public.employees (id, employee_code, full_name, email, phone, department_id, position_id, hire_date, salary, employee_level, work_status, address) VALUES
('e1111111-1111-1111-1111-111111111111', 'EMP001', 'Nguyễn Văn An', 'nguyen.van.an@company.com', '0901234567', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '2020-01-15', 25000000, 'level_1', 'active', '123 Đường ABC, Quận 1, TP.HCM'),
('e1111111-1111-1111-1111-111111111112', 'EMP002', 'Trần Thị Bình', 'tran.thi.binh@company.com', '0901234568', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111112', '2021-03-20', 15000000, 'level_3', 'active', '456 Đường DEF, Quận 3, TP.HCM'),
('e2222222-2222-2222-2222-222222222221', 'EMP003', 'Lê Minh Cường', 'le.minh.cuong@company.com', '0901234569', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222221', '2019-05-10', 30000000, 'level_1', 'active', '789 Đường GHI, Quận 5, TP.HCM'),
('e2222222-2222-2222-2222-222222222222', 'EMP004', 'Phạm Thị Dung', 'pham.thi.dung@company.com', '0901234570', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', '2020-08-15', 22000000, 'level_2', 'active', '321 Đường JKL, Quận 7, TP.HCM'),
('e2222222-2222-2222-2222-222222222223', 'EMP005', 'Hoàng Văn Em', 'hoang.van.em@company.com', '0901234571', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222223', '2021-01-10', 20000000, 'level_2', 'active', '654 Đường MNO, Quận 9, TP.HCM'),
('e2222222-2222-2222-2222-222222222224', 'EMP006', 'Vũ Thị Phương', 'vu.thi.phuong@company.com', '0901234572', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222224', '2022-06-01', 12000000, 'level_3', 'active', '987 Đường PQR, Quận 10, TP.HCM'),
('e3333333-3333-3333-3333-333333333331', 'EMP007', 'Đỗ Minh Giang', 'do.minh.giang@company.com', '0901234573', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333331', '2018-12-05', 28000000, 'level_1', 'active', '147 Đường STU, Quận 2, TP.HCM'),
('e3333333-3333-3333-3333-333333333332', 'EMP008', 'Bùi Thị Hạnh', 'bui.thi.hanh@company.com', '0901234574', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333332', '2021-09-15', 18000000, 'level_2', 'active', '258 Đường VWX, Quận 4, TP.HCM'),
('e4444444-4444-4444-4444-444444444441', 'EMP009', 'Trịnh Văn Ích', 'trinh.van.ich@company.com', '0901234575', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444441', '2017-07-20', 32000000, 'level_1', 'active', '369 Đường YZ1, Quận 6, TP.HCM'),
('e5555555-5555-5555-5555-555555555551', 'EMP010', 'Lý Thị Kim', 'ly.thi.kim@company.com', '0901234576', '55555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555551', '2019-11-30', 26000000, 'level_1', 'active', '741 Đường ABC2, Quận 8, TP.HCM')
ON CONFLICT (id) DO NOTHING;
