-- Tạo dữ liệu demo KPI đơn giản hơn
DO $$
DECLARE
    admin_user_id UUID;
    emp_id UUID;
    category_id UUID;
    framework_id UUID;
BEGIN
    -- Lấy admin user và employee đầu tiên
    SELECT id INTO admin_user_id FROM profiles LIMIT 1;
    SELECT id INTO emp_id FROM employees LIMIT 1;
    
    -- Tạo danh mục KPI
    INSERT INTO kpi_categories (name, description, color, created_by) 
    SELECT 'Doanh thu & Bán hàng', 'KPI liên quan đến doanh thu và hiệu quả bán hàng', '#10B981', admin_user_id
    WHERE NOT EXISTS (SELECT 1 FROM kpi_categories WHERE name = 'Doanh thu & Bán hàng');
    
    INSERT INTO kpi_categories (name, description, color, created_by) 
    SELECT 'Chất lượng sản phẩm', 'KPI đánh giá chất lượng phát triển sản phẩm', '#3B82F6', admin_user_id
    WHERE NOT EXISTS (SELECT 1 FROM kpi_categories WHERE name = 'Chất lượng sản phẩm');
    
    SELECT id INTO category_id FROM kpi_categories WHERE name = 'Doanh thu & Bán hàng' LIMIT 1;
    
    -- Tạo khung KPI
    INSERT INTO kpi_frameworks (name, description, framework_type, target_level, created_by) 
    SELECT 'Khung KPI Q4 2024', 'Khung đánh giá hiệu suất quý 4', 'performance', 'individual', admin_user_id
    WHERE NOT EXISTS (SELECT 1 FROM kpi_frameworks WHERE name = 'Khung KPI Q4 2024');
    
    SELECT id INTO framework_id FROM kpi_frameworks WHERE name = 'Khung KPI Q4 2024' LIMIT 1;
    
    -- Tạo KPI mẫu
    INSERT INTO kpis (name, description, employee_id, kpi_category_id, kpi_framework_id, year, period, unit, target_value, current_value, weight, kpi_type, measurement_frequency, trend_direction) 
    SELECT 'Doanh thu tháng', 'Doanh thu bán hàng đạt được trong tháng', emp_id, category_id, framework_id, 2024, 'monthly', 'triệu VND', 500, 375, 100, 'quantitative', 'monthly', 'increase'
    WHERE emp_id IS NOT NULL AND category_id IS NOT NULL AND framework_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM kpis WHERE name = 'Doanh thu tháng' AND employee_id = emp_id);
    
    RAISE NOTICE 'Created demo KPI data successfully';
END $$;