-- Tạo demo data cho hệ thống KPI

-- 1. Tạo KPI Categories
INSERT INTO public.kpi_categories (id, name, description, color, created_by, is_active) VALUES
('c1111111-1111-1111-1111-111111111111', 'Kinh Doanh', 'KPI liên quan đến doanh số và khách hàng', '#2563EB', 'e1111111-1111-1111-1111-111111111111', true),
('c2222222-2222-2222-2222-222222222222', 'Vận Hành', 'KPI liên quan đến hiệu quả vận hành', '#059669', 'e1111111-1111-1111-1111-111111111111', true),
('c3333333-3333-3333-3333-333333333333', 'Chất Lượng', 'KPI liên quan đến chất lượng sản phẩm/dịch vụ', '#DC2626', 'e1111111-1111-1111-1111-111111111111', true),
('c4444444-4444-4444-4444-444444444444', 'Nhân Sự', 'KPI liên quan đến quản lý nhân sự', '#7C2D12', 'e1111111-1111-1111-1111-111111111111', true),
('c5555555-5555-5555-5555-555555555555', 'Tài Chính', 'KPI liên quan đến hiệu quả tài chính', '#0891B2', 'e1111111-1111-1111-1111-111111111111', true);

-- 2. Tạo KPI Frameworks
INSERT INTO public.kpi_frameworks (id, name, description, framework_type, target_level, department_id, created_by, is_active) VALUES
('f1111111-1111-1111-1111-111111111111', 'Khung KPI Kinh Doanh', 'Khung KPI cho phòng Kinh Doanh', 'department', 'operational', '96000050-fe42-4330-b6d2-7e9283b9ad1a', 'e1111111-1111-1111-1111-111111111111', true),
('f2222222-2222-2222-2222-222222222222', 'Khung KPI Kỹ Thuật', 'Khung KPI cho phòng Kỹ Thuật', 'department', 'operational', '08491769-5fde-405a-bed0-0925a21b12c0', 'e1111111-1111-1111-1111-111111111111', true),
('f3333333-3333-3333-3333-333333333333', 'Khung KPI Công Ty', 'Khung KPI cấp công ty', 'company', 'strategic', null, 'e1111111-1111-1111-1111-111111111111', true);

-- 3. Tạo KPIs cho các nhân viên
INSERT INTO public.kpis (id, name, description, kpi_type, unit, measurement_frequency, employee_id, kpi_category_id, kpi_framework_id, responsible_person_id, year, period, current_value, target_value, baseline_value, weight, trend_direction, data_source, calculation_method, start_date, end_date, status) VALUES
-- KPI cho Nguyễn Văn An (Giám đốc)
('k1111111-1111-1111-1111-111111111111', 'Doanh thu tổng thể', 'Doanh thu tổng của công ty theo quý', 'quantitative', 'triệu VND', 'quarterly', 'e1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'f3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111111', 2024, '2024', 1200, 1500, 1000, 100, 'increase', 'Hệ thống ERP', 'Tổng doanh thu các phòng ban', '2024-01-01', '2024-12-31', 'active'),

('k1111111-1111-1111-1111-111111111112', 'Tỷ lệ hài lòng khách hàng', 'Tỷ lệ % khách hàng hài lòng với dịch vụ', 'quantitative', '%', 'monthly', 'e1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', 'e2222222-2222-2222-2222-222222222221', 2024, '2024', 85, 90, 80, 80, 'increase', 'Khảo sát khách hàng', 'Tổng điểm hài lòng / Tổng khách hàng khảo sát * 100', '2024-01-01', '2024-12-31', 'active'),

-- KPI cho Trần Thị Bình (HR)
('k1111111-1111-1111-1111-111111111113', 'Tỷ lệ nhân viên được đào tạo', 'Tỷ lệ % nhân viên hoàn thành chương trình đào tạo', 'quantitative', '%', 'quarterly', 'e1111111-1111-1111-1111-111111111112', 'c4444444-4444-4444-4444-444444444444', 'f3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111112', 2024, '2024', 75, 95, 60, 90, 'increase', 'Hệ thống LMS', 'Số nhân viên hoàn thành đào tạo / Tổng số nhân viên * 100', '2024-01-01', '2024-12-31', 'active'),

-- KPI cho Lê Minh Cường (Kinh doanh)
('k2222222-2222-2222-2222-222222222221', 'Doanh số cá nhân', 'Doanh số bán hàng cá nhân theo tháng', 'quantitative', 'triệu VND', 'monthly', 'e2222222-2222-2222-2222-222222222221', 'c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'e2222222-2222-2222-2222-222222222221', 2024, '2024', 80, 100, 60, 100, 'increase', 'CRM System', 'Tổng giá trị đơn hàng đã ký', '2024-01-01', '2024-12-31', 'active'),

('k2222222-2222-2222-2222-222222222222', 'Số khách hàng mới', 'Số lượng khách hàng mới phát triển được', 'quantitative', 'khách hàng', 'monthly', 'e2222222-2222-2222-2222-222222222221', 'c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'e2222222-2222-2222-2222-222222222221', 2024, '2024', 8, 12, 5, 70, 'increase', 'CRM System', 'Đếm số khách hàng mới trong tháng', '2024-01-01', '2024-12-31', 'active'),

-- KPI cho Phạm Thị Dung (Kinh doanh)
('k2222222-2222-2222-2222-222222222223', 'Tỷ lệ chốt deal', 'Tỷ lệ % chốt deal thành công từ leads', 'quantitative', '%', 'monthly', 'e2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'e2222222-2222-2222-2222-222222222222', 2024, '2024', 65, 75, 50, 80, 'increase', 'CRM System', 'Số deal thành công / Tổng số leads * 100', '2024-01-01', '2024-12-31', 'active'),

-- KPI cho Đỗ Minh Giang (Kỹ thuật)
('k3333333-3333-3333-3333-333333333331', 'Thời gian phát triển tính năng', 'Thời gian trung bình để hoàn thành 1 tính năng', 'quantitative', 'ngày', 'monthly', 'e3333333-3333-3333-3333-333333333331', 'c2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 'e3333333-3333-3333-3333-333333333331', 2024, '2024', 15, 10, 20, 90, 'decrease', 'Jira/Project Management', 'Tổng thời gian / Số tính năng hoàn thành', '2024-01-01', '2024-12-31', 'active'),

('k3333333-3333-3333-3333-333333333332', 'Tỷ lệ bug fix', 'Tỷ lệ % bug được fix trong tháng', 'quantitative', '%', 'monthly', 'e3333333-3333-3333-3333-333333333332', 'c3333333-3333-3333-3333-333333333333', 'f2222222-2222-2222-2222-222222222222', 'e3333333-3333-3333-3333-333333333332', 2024, '2024', 90, 95, 85, 85, 'increase', 'Bug tracking system', 'Số bug fixed / Tổng số bug reported * 100', '2024-01-01', '2024-12-31', 'active');

-- 4. Tạo KPI Targets cho từng kỳ
INSERT INTO public.kpi_targets (id, kpi_id, target_period, target_value, minimum_acceptable, excellent_threshold, target_type, notes) VALUES
-- Targets cho Q1 2024
('t1111111-1111-1111-1111-111111111111', 'k1111111-1111-1111-1111-111111111111', '2024-Q1', 350, 300, 400, 'absolute', 'Mục tiêu doanh thu quý 1'),
('t1111111-1111-1111-1111-111111111112', 'k1111111-1111-1111-1111-111111111112', '2024-03', 85, 80, 90, 'percentage', 'Mục tiêu hài lòng khách hàng tháng 3'),
('t2222222-2222-2222-2222-222222222221', 'k2222222-2222-2222-2222-222222222221', '2024-03', 100, 80, 120, 'absolute', 'Mục tiêu doanh số tháng 3'),
('t2222222-2222-2222-2222-222222222222', 'k2222222-2222-2222-2222-222222222222', '2024-03', 12, 8, 15, 'absolute', 'Mục tiêu khách hàng mới tháng 3'),
('t2222222-2222-2222-2222-222222222223', 'k2222222-2222-2222-2222-222222222223', '2024-03', 75, 65, 85, 'percentage', 'Mục tiêu tỷ lệ chốt deal tháng 3'),

-- Targets cho Q2 2024
('t1111111-1111-1111-1111-111111111121', 'k1111111-1111-1111-1111-111111111111', '2024-Q2', 400, 350, 450, 'absolute', 'Mục tiêu doanh thu quý 2'),
('t1111111-1111-1111-1111-111111111131', 'k1111111-1111-1111-1111-111111111113', '2024-Q2', 95, 85, 100, 'percentage', 'Mục tiêu đào tạo nhân viên quý 2');

-- 5. Tạo KPI Measurements (dữ liệu đo lường thực tế)
INSERT INTO public.kpi_measurements (id, kpi_id, measured_value, measurement_date, measurement_period, notes, measured_by) VALUES
-- Measurements cho tháng 1
('m1111111-1111-1111-1111-111111111111', 'k1111111-1111-1111-1111-111111111111', 320, '2024-01-31', '2024-01', 'Doanh thu tháng 1 đạt khá tốt', 'e1111111-1111-1111-1111-111111111111'),
('m1111111-1111-1111-1111-111111111112', 'k1111111-1111-1111-1111-111111111112', 83, '2024-01-31', '2024-01', 'Khảo sát 200 khách hàng', 'e2222222-2222-2222-2222-222222222221'),
('m2222222-2222-2222-2222-222222222221', 'k2222222-2222-2222-2222-222222222221', 95, '2024-01-31', '2024-01', 'Doanh số tháng 1 vượt kỳ vọng', 'e2222222-2222-2222-2222-222222222221'),
('m2222222-2222-2222-2222-222222222222', 'k2222222-2222-2222-2222-222222222222', 10, '2024-01-31', '2024-01', 'Phát triển được 10 khách hàng mới', 'e2222222-2222-2222-2222-222222222221'),

-- Measurements cho tháng 2
('m1111111-1111-1111-1111-111111111121', 'k1111111-1111-1111-1111-111111111111', 380, '2024-02-29', '2024-02', 'Doanh thu tháng 2 tăng trưởng mạnh', 'e1111111-1111-1111-1111-111111111111'),
('m1111111-1111-1111-1111-111111111122', 'k1111111-1111-1111-1111-111111111112', 87, '2024-02-29', '2024-02', 'Khảo sát 250 khách hàng, cải thiện dịch vụ', 'e2222222-2222-2222-2222-222222222221'),
('m2222222-2222-2222-2222-222222222231', 'k2222222-2222-2222-2222-222222222221', 105, '2024-02-29', '2024-02', 'Doanh số tháng 2 đạt rất tốt', 'e2222222-2222-2222-2222-222222222221'),
('m2222222-2222-2222-2222-222222222232', 'k2222222-2222-2222-2222-222222222222', 14, '2024-02-29', '2024-02', 'Tháng 2 phát triển được 14 khách hàng mới', 'e2222222-2222-2222-2222-222222222221'),
('m2222222-2222-2222-2222-222222222233', 'k2222222-2222-2222-2222-222222222223', 72, '2024-02-29', '2024-02', 'Tỷ lệ chốt deal cải thiện đáng kể', 'e2222222-2222-2222-2222-222222222222'),

-- Measurements cho tháng 3
('m1111111-1111-1111-1111-111111111131', 'k1111111-1111-1111-1111-111111111111', 420, '2024-03-31', '2024-03', 'Doanh thu tháng 3 đạt đỉnh', 'e1111111-1111-1111-1111-111111111111'),
('m1111111-1111-1111-1111-111111111132', 'k1111111-1111-1111-1111-111111111112', 89, '2024-03-31', '2024-03', 'Khảo sát 300 khách hàng, chất lượng dịch vụ tốt', 'e2222222-2222-2222-2222-222222222221'),
('m2222222-2222-2222-2222-222222222241', 'k2222222-2222-2222-2222-222222222221', 98, '2024-03-31', '2024-03', 'Doanh số tháng 3 đạt mục tiêu', 'e2222222-2222-2222-2222-222222222221'),
('m3333333-3333-3333-3333-333333333331', 'k3333333-3333-3333-3333-333333333331', 12, '2024-03-31', '2024-03', 'Thời gian phát triển được cải thiện', 'e3333333-3333-3333-3333-333333333331'),
('m3333333-3333-3333-3333-333333333332', 'k3333333-3333-3333-3333-333333333332', 92, '2024-03-31', '2024-03', 'Tỷ lệ fix bug đạt gần mục tiêu', 'e3333333-3333-3333-3333-333333333332');

-- 6. Tạo KPI Action Plans
INSERT INTO public.kpi_action_plans (id, kpi_id, title, description, priority, action_type, assigned_to, due_date, expected_impact, created_by, status, progress_percentage) VALUES
('a1111111-1111-1111-1111-111111111111', 'k1111111-1111-1111-1111-111111111112', 'Cải thiện quy trình chăm sóc khách hàng', 'Xây dựng quy trình chăm sóc khách hàng chuyên nghiệp, tăng cường đào tạo nhân viên customer service', 'high', 'improvement', 'e2222222-2222-2222-2222-222222222221', '2024-04-30', 'Tăng tỷ lệ hài lòng khách hàng lên 92%', 'e1111111-1111-1111-1111-111111111111', 'in_progress', 65),

('a2222222-2222-2222-2222-222222222221', 'k2222222-2222-2222-2222-222222222221', 'Chiến lược mở rộng khách hàng B2B', 'Phát triển kênh bán hàng B2B, tập trung vào các doanh nghiệp vừa và nhỏ', 'high', 'improvement', 'e2222222-2222-2222-2222-222222222221', '2024-05-15', 'Tăng doanh số lên 120 triệu VND/tháng', 'e2222222-2222-2222-2222-222222222221', 'in_progress', 40),

('a2222222-2222-2222-2222-222222222222', 'k2222222-2222-2222-2222-222222222223', 'Cải thiện kỹ năng bán hàng', 'Tổ chức khóa đào tạo kỹ năng bán hàng và đàm phán cho team sales', 'medium', 'improvement', 'e2222222-2222-2222-2222-222222222222', '2024-04-15', 'Tăng tỷ lệ chốt deal lên 80%', 'e1111111-1111-1111-1111-111111111112', 'pending', 0),

('a3333333-3333-3333-3333-333333333331', 'k3333333-3333-3333-3333-333333333331', 'Tối ưu quy trình phát triển', 'Áp dụng phương pháp Agile/Scrum để tối ưu hóa quy trình phát triển sản phẩm', 'high', 'improvement', 'e3333333-3333-3333-3333-333333333331', '2024-06-30', 'Giảm thời gian phát triển xuống 8 ngày/tính năng', 'e3333333-3333-3333-3333-333333333331', 'in_progress', 30);

-- 7. Tạo KPI Reviews  
INSERT INTO public.kpi_reviews (id, kpi_id, review_period, achievement_percentage, performance_rating, variance_analysis, root_cause_analysis, corrective_actions, recommendations, review_type, reviewed_by, status) VALUES
('r1111111-1111-1111-1111-111111111111', 'k1111111-1111-1111-1111-111111111111', '2024-Q1', 95, 'good', 'Doanh thu Q1 đạt 95% mục tiêu, chênh lệch 50 triệu so với kế hoạch', 'Thị trường chậm phục hồi sau Tết, một số khách hàng lớn hoãn dự án', 'Tăng cường marketing online, đẩy mạnh kênh bán hàng trực tuyến', 'Cần điều chỉnh chiến lược cho Q2, tập trung vào segment khách hàng SME', 'regular', 'e1111111-1111-1111-1111-111111111111', 'approved'),

('r2222222-2222-2222-2222-222222222221', 'k2222222-2222-2222-2222-222222222221', '2024-Q1', 99, 'good', 'Doanh số cá nhân đạt 99% mục tiêu, rất gần với kế hoạch đề ra', 'Tháng 1 bị ảnh hưởng bởi nghỉ Tết, tháng 2-3 bù đắp tốt', 'Tiếp tục duy trì momentum, tăng cường chăm sóc khách hàng cũ', 'Đề xuất tăng mục tiêu Q2 lên 110 triệu do xu hướng tích cực', 'regular', 'e1111111-1111-1111-1111-111111111111', 'approved'),

('r2222222-2222-2222-2222-222222222222', 'k2222222-2222-2222-2222-222222222223', '2024-Q1', 72, 'acceptable', 'Tỷ lệ chốt deal đạt 72% so với mục tiêu 75%', 'Kỹ năng đàm phán chưa thành thạo, thiếu kinh nghiệm xử lý từ chối', 'Tham gia khóa đào tạo sales skills, học hỏi từ đồng nghiệp senior', 'Cần mentor 1-1 với sales manager trong 2 tháng tới', 'regular', 'e1111111-1111-1111-1111-111111111112', 'draft');

-- Cập nhật current_value cho các KPI dựa trên measurement mới nhất
UPDATE public.kpis SET current_value = 420 WHERE id = 'k1111111-1111-1111-1111-111111111111';
UPDATE public.kpis SET current_value = 89 WHERE id = 'k1111111-1111-1111-1111-111111111112';
UPDATE public.kpis SET current_value = 98 WHERE id = 'k2222222-2222-2222-2222-222222222221';
UPDATE public.kpis SET current_value = 14 WHERE id = 'k2222222-2222-2222-2222-222222222222';
UPDATE public.kpis SET current_value = 72 WHERE id = 'k2222222-2222-2222-2222-222222222223';
UPDATE public.kpis SET current_value = 12 WHERE id = 'k3333333-3333-3333-3333-333333333331';
UPDATE public.kpis SET current_value = 92 WHERE id = 'k3333333-3333-3333-3333-333333333332';