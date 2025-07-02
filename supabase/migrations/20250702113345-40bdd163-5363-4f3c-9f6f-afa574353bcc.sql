-- Tạo dữ liệu mẫu cho OKR cycles
INSERT INTO public.okr_cycles (name, year, quarter, start_date, end_date, status, is_current, description)
VALUES 
  ('Q4 2024', 2024, 'Q4', '2024-10-01', '2024-12-31', 'active', true, 'Quý 4 năm 2024'),
  ('Q1 2025', 2025, 'Q1', '2025-01-01', '2025-03-31', 'planning', false, 'Quý 1 năm 2025');

-- Lấy cycle_id và user_id để tạo OKR
DO $$
DECLARE
    cycle_id_q4 UUID;
    user_id UUID;
    okr_id UUID;
BEGIN
    -- Lấy cycle ID của Q4 2024
    SELECT id INTO cycle_id_q4 FROM okr_cycles WHERE name = 'Q4 2024' LIMIT 1;
    
    -- Lấy user ID đầu tiên từ profiles
    SELECT id INTO user_id FROM profiles LIMIT 1;
    
    -- Tạo OKR công ty nếu chưa có
    INSERT INTO public.okr_objectives (
      title, description, cycle_id, year, quarter, progress, status, 
      owner_type, owner_id, start_date, end_date, created_by
    ) VALUES (
      'Tăng doanh thu 25% so với Q3', 
      'Mục tiêu tăng trưởng doanh thu cho quý 4', 
      cycle_id_q4, 
      2024, 
      'Q4', 
      75, 
      'active', 
      'company', 
      gen_random_uuid(), 
      '2024-10-01', 
      '2024-12-31',
      user_id
    ) RETURNING id INTO okr_id;
    
    -- Tạo key results
    INSERT INTO public.okr_key_results (okr_id, title, target_value, current_value, unit, weight, progress, status)
    VALUES 
      (okr_id, 'Đạt 500 triệu VND doanh thu', 500000000, 375000000, 'VND', 50, 75, 'on_track'),
      (okr_id, 'Có 50 khách hàng mới', 50, 38, 'khách hàng', 30, 76, 'on_track'),
      (okr_id, 'Tỷ lệ giữ chân khách hàng 90%', 90, 85, '%', 20, 94, 'on_track');
END $$;