-- Tạo KPIs cho các nhân viên với references chính xác

-- Lấy ID của categories và frameworks
WITH category_refs AS (
  SELECT id as cat_id, name as cat_name FROM kpi_categories WHERE name = 'Kinh Doanh'
), 
framework_refs AS (
  SELECT id as fw_id, name as fw_name FROM kpi_frameworks WHERE name = 'Khung KPI Công Ty'
),
quality_cat AS (
  SELECT id as cat_id FROM kpi_categories WHERE name = 'Chất Lượng'  
),
hr_cat AS (
  SELECT id as cat_id FROM kpi_categories WHERE name = 'Nhân Sự'
),
operation_cat AS (
  SELECT id as cat_id FROM kpi_categories WHERE name = 'Vận Hành'
),
sales_fw AS (
  SELECT id as fw_id FROM kpi_frameworks WHERE name = 'Khung KPI Kinh Doanh'
),
tech_fw AS (
  SELECT id as fw_id FROM kpi_frameworks WHERE name = 'Khung KPI Kỹ Thuật'
)

-- Tạo KPIs
INSERT INTO public.kpis (
  name, description, kpi_type, unit, measurement_frequency, 
  employee_id, kpi_category_id, kpi_framework_id, responsible_person_id, 
  year, period, current_value, target_value, baseline_value, weight, 
  trend_direction, data_source, calculation_method, start_date, end_date, status
) 
SELECT * FROM (
  -- KPI cho Nguyễn Văn An (Giám đốc)
  SELECT 
    'Doanh thu tổng thể' as name,
    'Doanh thu tổng của công ty theo quý' as description,
    'quantitative' as kpi_type, 'triệu VND' as unit, 'quarterly' as measurement_frequency,
    'e1111111-1111-1111-1111-111111111111' as employee_id,
    cr.cat_id as kpi_category_id, fr.fw_id as kpi_framework_id,
    'e1111111-1111-1111-1111-111111111111' as responsible_person_id,
    2024 as year, '2024' as period, 420 as current_value, 500 as target_value, 300 as baseline_value,
    100 as weight, 'increase' as trend_direction,
    'Hệ thống ERP' as data_source, 'Tổng doanh thu các phòng ban' as calculation_method,
    '2024-01-01'::date as start_date, '2024-12-31'::date as end_date, 'active' as status
  FROM category_refs cr, framework_refs fr
  
  UNION ALL
  
  -- KPI hài lòng khách hàng
  SELECT 
    'Tỷ lệ hài lòng khách hàng',
    'Tỷ lệ % khách hàng hài lòng với dịch vụ',
    'quantitative', '%', 'monthly',
    'e1111111-1111-1111-1111-111111111111',
    qc.cat_id, fr.fw_id,
    'e2222222-2222-2222-2222-222222222221',
    2024, '2024', 89, 90, 80,
    80, 'increase',
    'Khảo sát khách hàng', 'Tổng điểm hài lòng / Tổng khách hàng khảo sát * 100',
    '2024-01-01'::date, '2024-12-31'::date, 'active'
  FROM quality_cat qc, framework_refs fr
  
  UNION ALL
  
  -- KPI cho Trần Thị Bình (HR)
  SELECT 
    'Tỷ lệ nhân viên được đào tạo',
    'Tỷ lệ % nhân viên hoàn thành chương trình đào tạo',
    'quantitative', '%', 'quarterly',
    'e1111111-1111-1111-1111-111111111112',
    hc.cat_id, fr.fw_id,
    'e1111111-1111-1111-1111-111111111112',
    2024, '2024', 75, 95, 60,
    90, 'increase',
    'Hệ thống LMS', 'Số nhân viên hoàn thành đào tạo / Tổng số nhân viên * 100',
    '2024-01-01'::date, '2024-12-31'::date, 'active'
  FROM hr_cat hc, framework_refs fr
  
  UNION ALL
  
  -- KPI cho Lê Minh Cường (Sales)
  SELECT 
    'Doanh số cá nhân',
    'Doanh số bán hàng cá nhân theo tháng',
    'quantitative', 'triệu VND', 'monthly',
    'e2222222-2222-2222-2222-222222222221',
    cr.cat_id, sf.fw_id,
    'e2222222-2222-2222-2222-222222222221',
    2024, '2024', 98, 100, 60,
    100, 'increase',
    'CRM System', 'Tổng giá trị đơn hàng đã ký',
    '2024-01-01'::date, '2024-12-31'::date, 'active'
  FROM category_refs cr, sales_fw sf
  
  UNION ALL
  
  -- KPI số khách hàng mới cho Lê Minh Cường
  SELECT 
    'Số khách hàng mới',
    'Số lượng khách hàng mới phát triển được',
    'quantitative', 'khách hàng', 'monthly',
    'e2222222-2222-2222-2222-222222222221',
    cr.cat_id, sf.fw_id,
    'e2222222-2222-2222-2222-222222222221',
    2024, '2024', 14, 12, 5,
    70, 'increase',
    'CRM System', 'Đếm số khách hàng mới trong tháng',
    '2024-01-01'::date, '2024-12-31'::date, 'active'
  FROM category_refs cr, sales_fw sf
  
  UNION ALL
  
  -- KPI cho Phạm Thị Dung (Sales)
  SELECT 
    'Tỷ lệ chốt deal',
    'Tỷ lệ % chốt deal thành công từ leads',
    'quantitative', '%', 'monthly',
    'e2222222-2222-2222-2222-222222222222',
    cr.cat_id, sf.fw_id,
    'e2222222-2222-2222-2222-222222222222',
    2024, '2024', 72, 75, 50,
    80, 'increase',
    'CRM System', 'Số deal thành công / Tổng số leads * 100',
    '2024-01-01'::date, '2024-12-31'::date, 'active'
  FROM category_refs cr, sales_fw sf
  
  UNION ALL
  
  -- KPI cho Đỗ Minh Giang (Dev)
  SELECT 
    'Thời gian phát triển tính năng',
    'Thời gian trung bình để hoàn thành 1 tính năng',
    'quantitative', 'ngày', 'monthly',
    'e3333333-3333-3333-3333-333333333331',
    oc.cat_id, tf.fw_id,
    'e3333333-3333-3333-3333-333333333331',
    2024, '2024', 12, 10, 20,
    90, 'decrease',
    'Jira/Project Management', 'Tổng thời gian / Số tính năng hoàn thành',
    '2024-01-01'::date, '2024-12-31'::date, 'active'
  FROM operation_cat oc, tech_fw tf
  
  UNION ALL
  
  -- KPI tỷ lệ bug fix cho Bùi Thị Hạnh
  SELECT 
    'Tỷ lệ bug fix',
    'Tỷ lệ % bug được fix trong tháng',
    'quantitative', '%', 'monthly',
    'e3333333-3333-3333-3333-333333333332',
    qc.cat_id, tf.fw_id,
    'e3333333-3333-3333-3333-333333333332',
    2024, '2024', 92, 95, 85,
    85, 'increase',
    'Bug tracking system', 'Số bug fixed / Tổng số bug reported * 100',
    '2024-01-01'::date, '2024-12-31'::date, 'active'
  FROM quality_cat qc, tech_fw tf
) kpi_data;