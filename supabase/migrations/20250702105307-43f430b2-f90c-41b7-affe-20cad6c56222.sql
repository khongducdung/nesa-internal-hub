-- Tạo dữ liệu demo cho hệ thống OKR (Phần 1)

-- 1. Tạo chu kỳ OKR demo
INSERT INTO public.okr_cycles (name, year, quarter, start_date, end_date, status, is_current, description, created_by) VALUES
('Q1 2024', 2024, 'Q1', '2024-01-01', '2024-03-31', 'active', true, 'Chu kỳ OKR quý 1 năm 2024', (SELECT id FROM auth.users LIMIT 1)),
('Q2 2024', 2024, 'Q2', '2024-04-01', '2024-06-30', 'planning', false, 'Chu kỳ OKR quý 2 năm 2024', (SELECT id FROM auth.users LIMIT 1)),
('Q3 2024', 2024, 'Q3', '2024-07-01', '2024-09-30', 'planning', false, 'Chu kỳ OKR quý 3 năm 2024', (SELECT id FROM auth.users LIMIT 1)),
('Q4 2024', 2024, 'Q4', '2024-10-01', '2024-12-31', 'planning', false, 'Chu kỳ OKR quý 4 năm 2024', (SELECT id FROM auth.users LIMIT 1));

-- 2. Tạo OKR công ty
INSERT INTO public.okr_objectives (
    title, description, cycle_id, year, quarter, progress, status, 
    owner_id, owner_type, created_by, start_date, end_date
) VALUES
(
    'Tăng trưởng doanh thu 50% trong năm 2024',
    'Đẩy mạnh hoạt động kinh doanh và mở rộng thị trường để đạt mục tiêu tăng trưởng doanh thu 50%',
    (SELECT id FROM okr_cycles WHERE is_current = true LIMIT 1),
    2024,
    'Q1',
    68.0,
    'active',
    'company',
    'company',
    (SELECT id FROM auth.users LIMIT 1),
    '2024-01-01',
    '2024-03-31'
),
(
    'Nâng cao chất lượng dịch vụ khách hàng',
    'Cải thiện trải nghiệm và độ hài lòng của khách hàng thông qua các giải pháp tối ưu hóa dịch vụ',
    (SELECT id FROM okr_cycles WHERE is_current = true LIMIT 1),
    2024,
    'Q1',
    82.0,
    'active',
    'company',
    'company',
    (SELECT id FROM auth.users LIMIT 1),
    '2024-01-01',
    '2024-03-31'
),
(
    'Phát triển năng lực nhân sự và văn hóa doanh nghiệp',
    'Xây dựng đội ngũ nhân sự chất lượng cao và văn hóa doanh nghiệp tích cực',
    (SELECT id FROM okr_cycles WHERE is_current = true LIMIT 1),
    2024,
    'Q1',
    75.0,
    'active',
    'company',
    'company',
    (SELECT id FROM auth.users LIMIT 1),
    '2024-01-01',
    '2024-03-31'
);