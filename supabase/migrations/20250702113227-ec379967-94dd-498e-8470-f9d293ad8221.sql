-- Tạo dữ liệu mẫu cho OKR cycles
INSERT INTO public.okr_cycles (name, year, quarter, start_date, end_date, status, is_current, description)
VALUES 
  ('Q4 2024', 2024, 'Q4', '2024-10-01', '2024-12-31', 'active', true, 'Quý 4 năm 2024'),
  ('Q1 2025', 2025, 'Q1', '2025-01-01', '2025-03-31', 'planning', false, 'Quý 1 năm 2025');

-- Tạo dữ liệu OKR mẫu cho công ty
INSERT INTO public.okr_objectives (
  title, description, cycle_id, year, quarter, progress, status, 
  owner_type, owner_id, start_date, end_date, created_by
)
SELECT 
  'Tăng doanh thu 25% so với Q3', 
  'Mục tiêu tăng trưởng doanh thu cho quý 4', 
  c.id, 
  2024, 
  'Q4', 
  75, 
  'active', 
  'company', 
  gen_random_uuid()::text, 
  '2024-10-01', 
  '2024-12-31',
  p.id
FROM okr_cycles c, profiles p 
WHERE c.name = 'Q4 2024' AND p.email IS NOT NULL 
LIMIT 1;

-- Tạo key results cho OKR công ty
INSERT INTO public.okr_key_results (
  okr_id, title, target_value, current_value, unit, weight, progress, status
)
SELECT 
  o.id,
  'Đạt 500 triệu VND doanh thu',
  500000000,
  375000000,
  'VND',
  50,
  75,
  'on_track'
FROM okr_objectives o 
WHERE o.title = 'Tăng doanh thu 25% so với Q3';

INSERT INTO public.okr_key_results (
  okr_id, title, target_value, current_value, unit, weight, progress, status
)
SELECT 
  o.id,
  'Có 50 khách hàng mới',
  50,
  38,
  'khách hàng',
  30,
  76,
  'on_track'
FROM okr_objectives o 
WHERE o.title = 'Tăng doanh thu 25% so với Q3';

INSERT INTO public.okr_key_results (
  okr_id, title, target_value, current_value, unit, weight, progress, status
)
SELECT 
  o.id,
  'Tỷ lệ giữ chân khách hàng 90%',
  90,
  85,
  '%',
  20,
  94,
  'on_track'
FROM okr_objectives o 
WHERE o.title = 'Tăng doanh thu 25% so với Q3';