-- Tạo demo KPIs với cast UUID đúng cách

-- Tạo 3 KPIs đơn giản trước
INSERT INTO public.kpis (
  name, description, kpi_type, unit, measurement_frequency, 
  employee_id, year, period, current_value, target_value, 
  trend_direction, status
) VALUES 
(
  'Doanh thu tổng thể',
  'Doanh thu tổng của công ty theo quý', 
  'quantitative', 'triệu VND', 'quarterly',
  'e1111111-1111-1111-1111-111111111111'::uuid,
  2024, '2024', 420, 500,
  'increase', 'active'
),
(
  'Doanh số cá nhân', 
  'Doanh số bán hàng cá nhân theo tháng',
  'quantitative', 'triệu VND', 'monthly',
  'e2222222-2222-2222-2222-222222222221'::uuid,
  2024, '2024', 98, 100,
  'increase', 'active'  
),
(
  'Tỷ lệ chốt deal',
  'Tỷ lệ % chốt deal thành công từ leads',
  'quantitative', '%', 'monthly', 
  'e2222222-2222-2222-2222-222222222222'::uuid,
  2024, '2024', 72, 75,
  'increase', 'active'
),
(
  'Thời gian phát triển tính năng',
  'Thời gian trung bình để hoàn thành 1 tính năng',
  'quantitative', 'ngày', 'monthly',
  'e3333333-3333-3333-3333-333333333331'::uuid, 
  2024, '2024', 12, 10,
  'decrease', 'active'
),
(
  'Tỷ lệ bug fix',
  'Tỷ lệ % bug được fix trong tháng',
  'quantitative', '%', 'monthly',
  'e3333333-3333-3333-3333-333333333332'::uuid,
  2024, '2024', 92, 95, 
  'increase', 'active'
);