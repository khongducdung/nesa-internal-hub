-- Tạo demo KPIs với employee IDs thực tế
INSERT INTO public.kpis (
  name, description, kpi_type, unit, measurement_frequency, 
  employee_id, year, period, current_value, target_value, 
  trend_direction, status
) VALUES 
(
  'Doanh thu tổng thể',
  'Doanh thu tổng của công ty theo quý', 
  'quantitative', 'triệu VND', 'quarterly',
  (SELECT id FROM employees WHERE full_name = 'Nguyễn Văn An'),
  2024, '2024', 420, 500,
  'increase', 'active'
),
(
  'Doanh số cá nhân', 
  'Doanh số bán hàng cá nhân theo tháng',
  'quantitative', 'triệu VND', 'monthly',
  (SELECT id FROM employees WHERE full_name = 'Lê Minh Cường'),
  2024, '2024', 98, 100,
  'increase', 'active'  
),
(
  'Tỷ lệ chốt deal',
  'Tỷ lệ % chốt deal thành công từ leads',
  'quantitative', '%', 'monthly', 
  (SELECT id FROM employees WHERE full_name = 'Phạm Thị Dung'),
  2024, '2024', 72, 75,
  'increase', 'active'
),
(
  'Số khách hàng mới',
  'Số lượng khách hàng mới phát triển được',
  'quantitative', 'khách hàng', 'monthly',
  (SELECT id FROM employees WHERE full_name = 'Lê Minh Cường'),
  2024, '2024', 14, 12,
  'increase', 'active'
),
(
  'Thời gian phát triển tính năng',
  'Thời gian trung bình để hoàn thành 1 tính năng',
  'quantitative', 'ngày', 'monthly',
  (SELECT id FROM employees WHERE full_name = 'Đỗ Minh Giang'),
  2024, '2024', 12, 10,
  'decrease', 'active'
),
(
  'Tỷ lệ bug fix',
  'Tỷ lệ % bug được fix trong tháng',
  'quantitative', '%', 'monthly',
  (SELECT id FROM employees WHERE full_name = 'Bùi Thị Hạnh'),
  2024, '2024', 92, 95, 
  'increase', 'active'
);