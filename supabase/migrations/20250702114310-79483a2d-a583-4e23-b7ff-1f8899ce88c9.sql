-- Tạo dữ liệu demo KPI thực tế gắn với nhân sự
DO $$
DECLARE
    sales_dept_id UUID;
    tech_dept_id UUID;
    marketing_dept_id UUID;
    hr_dept_id UUID;
    sales_manager_id UUID;
    tech_lead_id UUID;
    sales_staff_id UUID;
    developer_id UUID;
    marketing_staff_id UUID;
    hr_staff_id UUID;
    category_sales_id UUID;
    category_tech_id UUID;
    category_marketing_id UUID;
    category_hr_id UUID;
    framework_sales_id UUID;
    framework_tech_id UUID;
    kpi_revenue_id UUID;
    kpi_customer_id UUID;
    kpi_code_quality_id UUID;
    kpi_lead_conversion_id UUID;
    kpi_employee_satisfaction_id UUID;
    admin_user_id UUID;
BEGIN
    -- Lấy ID các phòng ban
    SELECT id INTO sales_dept_id FROM departments WHERE name ILIKE '%kinh doanh%' OR name ILIKE '%sales%' LIMIT 1;
    SELECT id INTO tech_dept_id FROM departments WHERE name ILIKE '%kỹ thuật%' OR name ILIKE '%tech%' LIMIT 1;
    SELECT id INTO marketing_dept_id FROM departments WHERE name ILIKE '%marketing%' LIMIT 1;
    SELECT id INTO hr_dept_id FROM departments WHERE name ILIKE '%nhân sự%' OR name ILIKE '%hr%' LIMIT 1;
    
    -- Lấy ID nhân viên theo phòng ban
    SELECT id INTO sales_manager_id FROM employees WHERE department_id = sales_dept_id AND employee_level = 'manager' LIMIT 1;
    SELECT id INTO tech_lead_id FROM employees WHERE department_id = tech_dept_id AND employee_level = 'manager' LIMIT 1;
    SELECT id INTO sales_staff_id FROM employees WHERE department_id = sales_dept_id AND employee_level = 'level_3' LIMIT 1;
    SELECT id INTO developer_id FROM employees WHERE department_id = tech_dept_id AND employee_level = 'level_3' LIMIT 1;
    SELECT id INTO marketing_staff_id FROM employees WHERE department_id = marketing_dept_id LIMIT 1;
    SELECT id INTO hr_staff_id FROM employees WHERE department_id = hr_dept_id LIMIT 1;
    
    -- Lấy admin user
    SELECT id INTO admin_user_id FROM profiles LIMIT 1;
    
    -- Tạo danh mục KPI
    INSERT INTO kpi_categories (name, description, color, created_by) VALUES
    ('Doanh thu & Bán hàng', 'KPI liên quan đến doanh thu và hiệu quả bán hàng', '#10B981', admin_user_id),
    ('Chất lượng sản phẩm', 'KPI đánh giá chất lượng phát triển sản phẩm', '#3B82F6', admin_user_id),
    ('Marketing & Brand', 'KPI về marketing và xây dựng thương hiệu', '#F59E0B', admin_user_id),
    ('Nhân sự & Đào tạo', 'KPI về quản lý nhân sự và phát triển', '#EF4444', admin_user_id)
    ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;
    
    SELECT id INTO category_sales_id FROM kpi_categories WHERE name = 'Doanh thu & Bán hàng';
    SELECT id INTO category_tech_id FROM kpi_categories WHERE name = 'Chất lượng sản phẩm';
    SELECT id INTO category_marketing_id FROM kpi_categories WHERE name = 'Marketing & Brand';
    SELECT id INTO category_hr_id FROM kpi_categories WHERE name = 'Nhân sự & Đào tạo';
    
    -- Tạo khung KPI
    INSERT INTO kpi_frameworks (name, description, framework_type, target_level, department_id, created_by) VALUES
    ('Khung KPI Kinh doanh Q4 2024', 'Khung đánh giá hiệu suất bán hàng quý 4', 'performance', 'department', sales_dept_id, admin_user_id),
    ('Khung KPI Kỹ thuật Q4 2024', 'Khung đánh giá chất lượng phát triển sản phẩm', 'quality', 'department', tech_dept_id, admin_user_id)
    ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;
    
    SELECT id INTO framework_sales_id FROM kpi_frameworks WHERE name = 'Khung KPI Kinh doanh Q4 2024';
    SELECT id INTO framework_tech_id FROM kpi_frameworks WHERE name = 'Khung KPI Kỹ thuật Q4 2024';
    
    -- Tạo KPI thực tế cho nhân viên
    -- KPI cho Sales Manager
    INSERT INTO kpis (name, description, employee_id, kpi_category_id, kpi_framework_id, year, period, unit, target_value, current_value, baseline_value, weight, kpi_type, measurement_frequency, trend_direction, data_source, calculation_method) VALUES
    ('Doanh thu tháng', 'Doanh thu bán hàng đạt được trong tháng', sales_manager_id, category_sales_id, framework_sales_id, 2024, 'monthly', 'triệu VND', 500, 375, 300, 100, 'quantitative', 'monthly', 'increase', 'Hệ thống CRM', 'Tổng giá trị đơn hàng thành công'),
    ('Số khách hàng mới', 'Số lượng khách hàng mới thu hút được', sales_manager_id, category_sales_id, framework_sales_id, 2024, 'monthly', 'khách hàng', 50, 38, 25, 80, 'quantitative', 'monthly', 'increase', 'CRM Database', 'Đếm khách hàng đăng ký mới')
    ON CONFLICT (name, employee_id, year) DO UPDATE SET target_value = EXCLUDED.target_value;
    
    -- KPI cho Sales Staff
    INSERT INTO kpis (name, description, employee_id, kpi_category_id, kpi_framework_id, year, period, unit, target_value, current_value, baseline_value, weight, kpi_type, measurement_frequency, trend_direction, data_source, calculation_method) VALUES
    ('Tỷ lệ chốt deal', 'Tỷ lệ chuyển đổi từ lead thành khách hàng', sales_staff_id, category_sales_id, framework_sales_id, 2024, 'monthly', '%', 25, 22, 15, 90, 'quantitative', 'monthly', 'increase', 'CRM Pipeline', 'Số deal thành công / Tổng số lead'),
    ('Số cuộc gọi bán hàng', 'Số lượng cuộc gọi bán hàng thực hiện', sales_staff_id, category_sales_id, framework_sales_id, 2024, 'daily', 'cuộc gọi', 50, 45, 30, 70, 'quantitative', 'daily', 'increase', 'Call Center System', 'Đếm số cuộc gọi outbound')
    ON CONFLICT (name, employee_id, year) DO UPDATE SET target_value = EXCLUDED.target_value;
    
    -- KPI cho Tech Lead
    INSERT INTO kpis (name, description, employee_id, kpi_category_id, kpi_framework_id, year, period, unit, target_value, current_value, baseline_value, weight, kpi_type, measurement_frequency, trend_direction, data_source, calculation_method) VALUES
    ('Code Coverage', 'Tỷ lệ code được cover bởi unit tests', tech_lead_id, category_tech_id, framework_tech_id, 2024, 'monthly', '%', 85, 78, 60, 100, 'quantitative', 'weekly', 'increase', 'SonarQube', 'Lines covered / Total lines'),
    ('Bug Rate', 'Số lượng bug trên 1000 dòng code', tech_lead_id, category_tech_id, framework_tech_id, 2024, 'monthly', 'bugs/1000LOC', 2, 2.5, 5, 90, 'quantitative', 'weekly', 'decrease', 'Jira + Git', 'Bug count / (LOC/1000)')
    ON CONFLICT (name, employee_id, year) DO UPDATE SET target_value = EXCLUDED.target_value;
    
    -- KPI cho Developer
    INSERT INTO kpis (name, description, employee_id, kpi_category_id, kpi_framework_id, year, period, unit, target_value, current_value, baseline_value, weight, kpi_type, measurement_frequency, trend_direction, data_source, calculation_method) VALUES
    ('Sprint Completion Rate', 'Tỷ lệ hoàn thành tasks trong sprint', developer_id, category_tech_id, framework_tech_id, 2024, 'sprint', '%', 90, 85, 70, 85, 'quantitative', 'sprint', 'increase', 'Jira', 'Completed story points / Committed story points'),
    ('Code Review Quality', 'Điểm chất lượng code review', developer_id, category_tech_id, framework_tech_id, 2024, 'monthly', 'điểm', 8.5, 8.2, 7.0, 75, 'quantitative', 'monthly', 'increase', 'GitHub/GitLab', 'Avg rating from peer reviews')
    ON CONFLICT (name, employee_id, year) DO UPDATE SET target_value = EXCLUDED.target_value;
    
    -- Lấy ID của các KPI vừa tạo
    SELECT id INTO kpi_revenue_id FROM kpis WHERE name = 'Doanh thu tháng' AND employee_id = sales_manager_id;
    SELECT id INTO kpi_customer_id FROM kpis WHERE name = 'Số khách hàng mới' AND employee_id = sales_manager_id;
    SELECT id INTO kpi_code_quality_id FROM kpis WHERE name = 'Code Coverage' AND employee_id = tech_lead_id;
    
    -- Tạo targets cho KPI
    INSERT INTO kpi_targets (kpi_id, target_period, target_value, target_type, minimum_acceptable, excellent_threshold, set_by, notes) VALUES
    (kpi_revenue_id, '2024-Q4', 500, 'absolute', 400, 600, admin_user_id, 'Mục tiêu doanh thu quý 4 dựa trên kế hoạch kinh doanh'),
    (kpi_customer_id, '2024-Q4', 50, 'absolute', 40, 60, admin_user_id, 'Thu hút khách hàng mới để mở rộng thị trường'),
    (kpi_code_quality_id, '2024-Q4', 85, 'percentage', 80, 90, admin_user_id, 'Đảm bảo chất lượng code theo chuẩn industry')
    ON CONFLICT DO NOTHING;
    
    -- Tạo measurements mẫu
    INSERT INTO kpi_measurements (kpi_id, measured_value, measurement_date, measurement_period, measured_by, notes) VALUES
    (kpi_revenue_id, 375, '2024-11-30', '2024-11', sales_manager_id, 'Doanh thu tháng 11 đạt 75% mục tiêu'),
    (kpi_revenue_id, 420, '2024-10-31', '2024-10', sales_manager_id, 'Doanh thu tháng 10 vượt mục tiêu'),
    (kpi_customer_id, 38, '2024-11-30', '2024-11', sales_manager_id, '38 khách hàng mới được chốt thành công'),
    (kpi_code_quality_id, 78, '2024-11-30', '2024-11', tech_lead_id, 'Code coverage cần cải thiện thêm')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Created demo KPI data successfully';
END $$;