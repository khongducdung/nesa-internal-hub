-- Tạo dữ liệu demo KPI với target level đúng
INSERT INTO kpi_categories (name, description, color, created_by) 
SELECT 'Doanh thu', 'KPI doanh thu', '#10B981', '5e6d2b60-98bc-484e-883a-abc5377b2dbb'
WHERE NOT EXISTS (SELECT 1 FROM kpi_categories WHERE name = 'Doanh thu');

INSERT INTO kpi_frameworks (name, description, framework_type, target_level, created_by) 
SELECT 'Khung KPI 2024', 'Khung đánh giá 2024', 'company', 'strategic', '5e6d2b60-98bc-484e-883a-abc5377b2dbb'
WHERE NOT EXISTS (SELECT 1 FROM kpi_frameworks WHERE name = 'Khung KPI 2024');