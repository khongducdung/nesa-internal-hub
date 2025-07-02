-- Tạo KPI Measurements và Action Plans
WITH kpi_refs AS (
  SELECT id, name, employee_id FROM kpis
)

-- Tạo KPI Measurements
INSERT INTO public.kpi_measurements (kpi_id, measured_value, measurement_date, measurement_period, notes, measured_by)
SELECT 
  kr.id,
  CASE 
    WHEN kr.name = 'Doanh thu tổng thể' THEN 420
    WHEN kr.name = 'Doanh số cá nhân' THEN 98
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN 72
    WHEN kr.name = 'Số khách hàng mới' THEN 14
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN 12
    WHEN kr.name = 'Tỷ lệ bug fix' THEN 92
    ELSE 100
  END as measured_value,
  '2024-03-31'::date as measurement_date,
  '2024-03' as measurement_period,
  CASE 
    WHEN kr.name = 'Doanh thu tổng thể' THEN 'Doanh thu tháng 3 đạt khá tốt'
    WHEN kr.name = 'Doanh số cá nhân' THEN 'Doanh số cá nhân đạt gần mục tiêu'
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN 'Tỷ lệ chốt deal cần cải thiện'
    WHEN kr.name = 'Số khách hàng mới' THEN 'Vượt mục tiêu khách hàng mới'
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN 'Thời gian phát triển vẫn chậm'
    WHEN kr.name = 'Tỷ lệ bug fix' THEN 'Tỷ lệ fix bug đạt gần mục tiêu'
    ELSE 'Đo lường tháng 3'
  END as notes,
  kr.employee_id as measured_by
FROM kpi_refs kr;