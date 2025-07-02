-- Tạo KPI Action Plans
WITH kpi_refs AS (
  SELECT id, name, employee_id FROM kpis WHERE name IN ('Tỷ lệ chốt deal', 'Thời gian phát triển tính năng', 'Doanh thu tổng thể')
)

INSERT INTO public.kpi_action_plans (kpi_id, title, description, priority, action_type, assigned_to, due_date, expected_impact, created_by, status, progress_percentage)
SELECT 
  kr.id,
  CASE 
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN 'Cải thiện kỹ năng bán hàng'
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN 'Tối ưu quy trình phát triển'
    WHEN kr.name = 'Doanh thu tổng thể' THEN 'Chiến lược tăng doanh thu Q2'
    ELSE 'Kế hoạch cải tiến'
  END as title,
  CASE 
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN 'Tổ chức khóa đào tạo kỹ năng bán hàng và đàm phán cho team sales'
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN 'Áp dụng phương pháp Agile/Scrum để tối ưu hóa quy trình phát triển'
    WHEN kr.name = 'Doanh thu tổng thể' THEN 'Đẩy mạnh marketing và mở rộng thị trường để đạt mục tiêu doanh thu Q2'
    ELSE 'Mô tả kế hoạch cải tiến'
  END as description,
  CASE 
    WHEN kr.name = 'Doanh thu tổng thể' THEN 'high'
    ELSE 'medium'
  END as priority,
  'improvement' as action_type,
  kr.employee_id as assigned_to,
  CASE 
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN '2024-04-15'::date
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN '2024-06-30'::date
    WHEN kr.name = 'Doanh thu tổng thể' THEN '2024-05-31'::date
    ELSE '2024-04-30'::date
  END as due_date,
  CASE 
    WHEN kr.name = 'Tỷ lệ chốt deal' THEN 'Tăng tỷ lệ chốt deal lên 80%'
    WHEN kr.name = 'Thời gian phát triển tính năng' THEN 'Giảm thời gian phát triển xuống 8 ngày/tính năng'
    WHEN kr.name = 'Doanh thu tổng thể' THEN 'Đạt 500 triệu VND doanh thu Q2'
    ELSE 'Cải thiện hiệu suất'
  END as expected_impact,
  (SELECT id FROM employees WHERE full_name = 'Nguyễn Văn An') as created_by,
  CASE 
    WHEN kr.name = 'Doanh thu tổng thể' THEN 'in_progress'
    ELSE 'pending'
  END as status,
  CASE 
    WHEN kr.name = 'Doanh thu tổng thể' THEN 25
    ELSE 0
  END as progress_percentage
FROM kpi_refs kr;