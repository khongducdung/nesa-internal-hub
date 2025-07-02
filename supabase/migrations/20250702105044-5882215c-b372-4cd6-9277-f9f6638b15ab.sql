-- Tạo dữ liệu demo cho hệ thống OKR

-- 1. Tạo chu kỳ OKR demo
INSERT INTO public.okr_cycles (name, year, quarter, start_date, end_date, status, is_current, description, created_by) VALUES
('Q1 2024', 2024, 'Q1', '2024-01-01', '2024-03-31', 'active', true, 'Chu kỳ OKR quý 1 năm 2024', (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('Q2 2024', 2024, 'Q2', '2024-04-01', '2024-06-30', 'planning', false, 'Chu kỳ OKR quý 2 năm 2024', (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('Q3 2024', 2024, 'Q3', '2024-07-01', '2024-09-30', 'planning', false, 'Chu kỳ OKR quý 3 năm 2024', (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('Q4 2024', 2024, 'Q4', '2024-10-01', '2024-12-31', 'planning', false, 'Chu kỳ OKR quý 4 năm 2024', (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1));

-- 2. Tạo OKR công ty (Company OKRs)
WITH current_cycle AS (
    SELECT id as cycle_id FROM okr_cycles WHERE is_current = true LIMIT 1
),
admin_user AS (
    SELECT id as user_id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1
)
INSERT INTO public.okr_objectives (
    title, description, cycle_id, year, quarter, progress, status, 
    owner_id, owner_type, created_by, start_date, end_date
) 
SELECT 
    'Tăng trưởng doanh thu 50% trong năm 2024',
    'Đẩy mạnh hoạt động kinh doanh và mở rộng thị trường để đạt mục tiêu tăng trưởng doanh thu 50%',
    c.cycle_id,
    2024,
    'Q1',
    68.0,
    'active',
    'company',
    'company',
    a.user_id,
    '2024-01-01',
    '2024-03-31'
FROM current_cycle c, admin_user a
UNION ALL
SELECT 
    'Nâng cao chất lượng dịch vụ khách hàng',
    'Cải thiện trải nghiệm và độ hài lòng của khách hàng thông qua các giải pháp tối ưu hóa dịch vụ',
    c.cycle_id,
    2024,
    'Q1',
    82.0,
    'active',
    'company',
    'company',
    a.user_id,
    '2024-01-01',
    '2024-03-31'
FROM current_cycle c, admin_user a
UNION ALL
SELECT 
    'Phát triển năng lực nhân sự và văn hóa doanh nghiệp',
    'Xây dựng đội ngũ nhân sự chất lượng cao và văn hóa doanh nghiệp tích cực',
    c.cycle_id,
    2024,
    'Q1',
    75.0,
    'active',
    'company',
    'company',
    a.user_id,
    '2024-01-01',
    '2024-03-31'
FROM current_cycle c, admin_user a;

-- 3. Tạo Key Results cho OKR công ty
WITH company_okr_1 AS (
    SELECT id FROM okr_objectives WHERE title = 'Tăng trưởng doanh thu 50% trong năm 2024' LIMIT 1
),
company_okr_2 AS (
    SELECT id FROM okr_objectives WHERE title = 'Nâng cao chất lượng dịch vụ khách hàng' LIMIT 1
),
company_okr_3 AS (
    SELECT id FROM okr_objectives WHERE title = 'Phát triển năng lực nhân sự và văn hóa doanh nghiệp' LIMIT 1
)
INSERT INTO public.okr_key_results (okr_id, title, target_value, current_value, unit, weight, progress, status, due_date)
SELECT o1.id, 'Thu hút 1000 khách hàng mới', 1000, 680, 'khách hàng', 40, 68, 'on_track', '2024-03-31' FROM company_okr_1 o1
UNION ALL
SELECT o1.id, 'Tăng doanh thu 30% so với Q4/2023', 30, 22, '%', 35, 73, 'on_track', '2024-03-31' FROM company_okr_1 o1
UNION ALL
SELECT o1.id, 'Ra mắt 3 sản phẩm mới', 3, 2, 'sản phẩm', 25, 67, 'on_track', '2024-03-31' FROM company_okr_1 o1
UNION ALL
SELECT o2.id, 'Đạt 95% độ hài lòng khách hàng', 95, 91, '%', 50, 96, 'on_track', '2024-03-31' FROM company_okr_2 o2
UNION ALL
SELECT o2.id, 'Giảm thời gian phản hồi xuống 2 giờ', 2, 2.2, 'giờ', 30, 90, 'on_track', '2024-03-31' FROM company_okr_2 o2
UNION ALL
SELECT o2.id, 'Xử lý 100% khiếu nại trong 24h', 100, 85, '%', 20, 85, 'at_risk', '2024-03-31' FROM company_okr_2 o2
UNION ALL
SELECT o3.id, 'Đào tạo 100% nhân viên về văn hóa công ty', 100, 78, '%', 30, 78, 'on_track', '2024-03-31' FROM company_okr_3 o3
UNION ALL
SELECT o3.id, 'Tăng 25% điểm hài lòng nhân viên', 25, 18, '%', 40, 72, 'on_track', '2024-03-31' FROM company_okr_3 o3
UNION ALL
SELECT o3.id, 'Tuyển dụng 50 nhân viên chất lượng cao', 50, 38, 'nhân viên', 30, 76, 'on_track', '2024-03-31' FROM company_okr_3 o3;

-- 4. Tạo OKR phòng ban (Department OKRs)
WITH current_cycle AS (
    SELECT id as cycle_id FROM okr_cycles WHERE is_current = true LIMIT 1
),
sales_dept AS (
    SELECT id as dept_id FROM departments WHERE name LIKE '%Kinh Doanh%' OR name LIKE '%Sales%' LIMIT 1
),
tech_dept AS (
    SELECT id as dept_id FROM departments WHERE name LIKE '%Kỹ Thuật%' OR name LIKE '%Tech%' LIMIT 1
),
marketing_dept AS (
    SELECT id as dept_id FROM departments WHERE name LIKE '%Marketing%' LIMIT 1
),
company_okr_1 AS (
    SELECT id FROM okr_objectives WHERE title = 'Tăng trưởng doanh thu 50% trong năm 2024' LIMIT 1
),
admin_user AS (
    SELECT id as user_id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1
)
INSERT INTO public.okr_objectives (
    title, description, cycle_id, year, quarter, progress, status, 
    owner_id, owner_type, department_id, parent_okr_id, created_by, start_date, end_date
)
SELECT 
    'Tăng 40% doanh số phòng Kinh Doanh Q1',
    'Mục tiêu phòng Kinh Doanh hỗ trợ mục tiêu tăng trưởng doanh thu của công ty',
    c.cycle_id,
    2024,
    'Q1',
    75.0,
    'active',
    sd.dept_id,
    'department',
    sd.dept_id,
    co1.id,
    a.user_id,
    '2024-01-01',
    '2024-03-31'
FROM current_cycle c, sales_dept sd, company_okr_1 co1, admin_user a
UNION ALL
SELECT 
    'Phát triển 2 sản phẩm công nghệ mới',
    'Phòng Kỹ Thuật phát triển các sản phẩm công nghệ để hỗ trợ mục tiêu công ty',
    c.cycle_id,
    2024,
    'Q1',
    60.0,
    'active',
    td.dept_id,
    'department',
    td.dept_id,
    co1.id,
    a.user_id,
    '2024-01-01',
    '2024-03-31'
FROM current_cycle c, tech_dept td, company_okr_1 co1, admin_user a
UNION ALL
SELECT 
    'Tăng 30% nhận diện thương hiệu',
    'Phòng Marketing thực hiện các chiến dịch để tăng nhận diện thương hiệu',
    c.cycle_id,
    2024,
    'Q1',
    85.0,
    'active',
    md.dept_id,
    'department',
    md.dept_id,
    co1.id,
    a.user_id,
    '2024-01-01',
    '2024-03-31'
FROM current_cycle c, marketing_dept md, company_okr_1 co1, admin_user a;

-- 5. Tạo Key Results cho OKR phòng ban
WITH dept_okr_sales AS (
    SELECT id FROM okr_objectives WHERE title = 'Tăng 40% doanh số phòng Kinh Doanh Q1' LIMIT 1
),
dept_okr_tech AS (
    SELECT id FROM okr_objectives WHERE title = 'Phát triển 2 sản phẩm công nghệ mới' LIMIT 1
),
dept_okr_marketing AS (
    SELECT id FROM okr_objectives WHERE title = 'Tăng 30% nhận diện thương hiệu' LIMIT 1
)
INSERT INTO public.okr_key_results (okr_id, title, target_value, current_value, unit, weight, progress, status, due_date)
SELECT os.id, 'Tăng số lượng khách hàng mới 35%', 350, 240, 'khách hàng', 60, 69, 'on_track', '2024-03-31' FROM dept_okr_sales os
UNION ALL
SELECT os.id, 'Đạt doanh số 15 tỷ VND', 15000000000, 11500000000, 'VND', 40, 77, 'on_track', '2024-03-31' FROM dept_okr_sales os
UNION ALL
SELECT ot.id, 'Hoàn thiện sản phẩm A', 1, 0.8, 'sản phẩm', 50, 80, 'on_track', '2024-03-31' FROM dept_okr_tech ot
UNION ALL
SELECT ot.id, 'Hoàn thiện sản phẩm B', 1, 0.4, 'sản phẩm', 50, 40, 'at_risk', '2024-03-31' FROM dept_okr_tech ot
UNION ALL
SELECT om.id, 'Tăng 50% lượt tương tác social media', 50, 42, '%', 40, 84, 'on_track', '2024-03-31' FROM dept_okr_marketing om
UNION ALL
SELECT om.id, 'Tổ chức 5 sự kiện marketing', 5, 4, 'sự kiện', 35, 80, 'on_track', '2024-03-31' FROM dept_okr_marketing om
UNION ALL
SELECT om.id, 'Đạt 10M lượt view website', 10000000, 9200000, 'view', 25, 92, 'on_track', '2024-03-31' FROM dept_okr_marketing om;

-- 6. Tạo OKR cá nhân (Individual OKRs) cho một số employees
WITH current_cycle AS (
    SELECT id as cycle_id FROM okr_cycles WHERE is_current = true LIMIT 1
),
dept_okr_sales AS (
    SELECT id FROM okr_objectives WHERE title = 'Tăng 40% doanh số phòng Kinh Doanh Q1' LIMIT 1
),
sales_employees AS (
    SELECT e.id as emp_id, e.auth_user_id, e.department_id, e.full_name
    FROM employees e 
    JOIN departments d ON e.department_id = d.id 
    WHERE d.name LIKE '%Kinh Doanh%' OR d.name LIKE '%Sales%' 
    LIMIT 3
),
tech_employees AS (
    SELECT e.id as emp_id, e.auth_user_id, e.department_id, e.full_name
    FROM employees e 
    JOIN departments d ON e.department_id = d.id 
    WHERE d.name LIKE '%Kỹ Thuật%' OR d.name LIKE '%Tech%' 
    LIMIT 2
)
INSERT INTO public.okr_objectives (
    title, description, cycle_id, year, quarter, progress, status, 
    owner_id, owner_type, employee_id, department_id, parent_okr_id, created_by, start_date, end_date
)
SELECT 
    se.full_name || ' - Tăng hiệu suất bán hàng cá nhân 40%',
    'Cải thiện kỹ năng bán hàng và chăm sóc khách hàng để đạt mục tiêu cá nhân',
    c.cycle_id,
    2024,
    'Q1',
    75.0,
    'active',
    se.emp_id,
    'individual',
    se.emp_id,
    se.department_id,
    dos.id,
    se.auth_user_id,
    '2024-01-01',
    '2024-03-31'
FROM current_cycle c, sales_employees se, dept_okr_sales dos
LIMIT 2
UNION ALL
SELECT 
    te.full_name || ' - Phát triển kỹ năng chuyên môn',
    'Nâng cao năng lực cá nhân thông qua học tập và thực hành',
    c.cycle_id,
    2024,
    'Q1',
    60.0,
    'active',
    te.emp_id,
    'individual',
    te.emp_id,
    te.department_id,
    NULL,
    te.auth_user_id,
    '2024-01-01',
    '2024-03-31'
FROM current_cycle c, tech_employees te
LIMIT 1;

-- 7. Tạo Key Results cho OKR cá nhân
WITH individual_okrs AS (
    SELECT id, title, employee_id FROM okr_objectives WHERE owner_type = 'individual'
)
INSERT INTO public.okr_key_results (okr_id, title, target_value, current_value, unit, weight, progress, status, due_date)
SELECT 
    io.id, 
    'Đạt doanh số 500 triệu VND', 
    500000000, 
    375000000, 
    'VND', 
    60, 
    75, 
    'on_track', 
    '2024-03-31'
FROM individual_okrs io 
WHERE io.title LIKE '%hiệu suất bán hàng%'
LIMIT 1
UNION ALL
SELECT 
    io.id, 
    'Chốt 50 deal mới', 
    50, 
    35, 
    'deal', 
    40, 
    70, 
    'on_track', 
    '2024-03-31'
FROM individual_okrs io 
WHERE io.title LIKE '%hiệu suất bán hàng%'
LIMIT 1
UNION ALL
SELECT 
    io.id, 
    'Hoàn thành 3 khóa học online', 
    3, 
    2, 
    'khóa học', 
    50, 
    67, 
    'on_track', 
    '2024-03-31'
FROM individual_okrs io 
WHERE io.title LIKE '%kỹ năng chuyên môn%'
LIMIT 1
UNION ALL
SELECT 
    io.id, 
    'Đạt chứng chỉ chuyên môn', 
    1, 
    0, 
    'chứng chỉ', 
    50, 
    30, 
    'at_risk', 
    '2024-03-31'
FROM individual_okrs io 
WHERE io.title LIKE '%kỹ năng chuyên môn%'
LIMIT 1;

-- 8. Tạo OKR Rewards cho một số users
INSERT INTO public.okr_rewards (user_id, okr_coins, trust_points, dedication_points, total_rewards, current_rank)
SELECT 
    auth_user_id,
    FLOOR(RANDOM() * 2000 + 500)::INTEGER,
    FLOOR(RANDOM() * 50 + 20)::INTEGER,
    FLOOR(RANDOM() * 30 + 10)::INTEGER,
    0,
    NULL
FROM employees 
WHERE auth_user_id IS NOT NULL
LIMIT 10;

-- Update total_rewards
UPDATE public.okr_rewards 
SET total_rewards = okr_coins + (trust_points * 10) + (dedication_points * 20);

-- Update rankings
WITH ranked_users AS (
    SELECT 
        user_id,
        total_rewards,
        ROW_NUMBER() OVER (ORDER BY total_rewards DESC) as rank
    FROM okr_rewards
)
UPDATE okr_rewards 
SET current_rank = r.rank
FROM ranked_users r
WHERE okr_rewards.user_id = r.user_id;

-- 9. Tạo một số OKR reward transactions demo
WITH users_with_rewards AS (
    SELECT user_id FROM okr_rewards LIMIT 5
),
okr_ids AS (
    SELECT id FROM okr_objectives LIMIT 3
)
INSERT INTO public.okr_reward_transactions (
    user_id, transaction_type, reward_type, amount, reason, reference_type, created_by
)
SELECT 
    uwr.user_id,
    'earn',
    'okr_coins',
    100,
    'Hoàn thành Key Result',
    'key_result_completion',
    uwr.user_id
FROM users_with_rewards uwr
UNION ALL
SELECT 
    uwr.user_id,
    'earn',
    'trust_points',
    10,
    'Nhận trust point từ đồng nghiệp',
    'peer_recognition',
    uwr.user_id
FROM users_with_rewards uwr;

-- 10. Grant một số achievements cho users
WITH users_with_rewards AS (
    SELECT user_id FROM okr_rewards LIMIT 3
),
achievements AS (
    SELECT id FROM okr_achievements WHERE name IN ('First Goal', 'Team Player') LIMIT 2
)
INSERT INTO public.okr_user_achievements (user_id, achievement_id, earned_at, progress)
SELECT 
    uwr.user_id,
    a.id,
    NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30),
    100
FROM users_with_rewards uwr
CROSS JOIN achievements a;