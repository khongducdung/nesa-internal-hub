-- Tạo KPI Targets và Measurements
WITH kpi_refs AS (
  SELECT id, name, employee_id FROM kpis
)

-- Tạo KPI Targets
INSERT INTO public.kpi_targets (kpi_id, target_period, target_value, minimum_acceptable, excellent_threshold, target_type, notes)
SELECT 
  kr.id,
  '2024-Q1' as target_period,
  CASE 
    WHEN kr.name = 'Doanh thu tổng thể' THEN 450
    WHEN kr.name = 'Doanh số cá nhân' THEN 100
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN 75
    WHEN kr.name = 'Số khách hàng mới' THEN 12
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN 10
    WHEN kr.name = 'Tỷ lệ bug fix' THEN 95
    ELSE 100
  END as target_value,
  CASE 
    WHEN kr.name = 'Doanh thu tổng thể' THEN 350
    WHEN kr.name = 'Doanh số cá nhân' THEN 80
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN 65
    WHEN kr.name = 'Số khách hàng mới' THEN 8
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN 15
    WHEN kr.name = 'Tỷ lệ bug fix' THEN 85
    ELSE 80
  END as minimum_acceptable,
  CASE 
    WHEN kr.name = 'Doanh thu tổng thể' THEN 500
    WHEN kr.name = 'Doanh số cá nhân' THEN 120
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN 85
    WHEN kr.name = 'Số khách hàng mới' THEN 15
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN 8
    WHEN kr.name = 'Tỷ lệ bug fix' THEN 100
    ELSE 120
  END as excellent_threshold,
  'absolute' as target_type,
  'Mục tiêu quý 1 năm 2024' as notes
FROM kpi_refs kr;