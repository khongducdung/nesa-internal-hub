-- Tạo demo data cho hệ thống KPI với UUID tự động

-- 1. Tạo KPI Categories
INSERT INTO public.kpi_categories (name, description, color, created_by, is_active) VALUES
('Kinh Doanh', 'KPI liên quan đến doanh số và khách hàng', '#2563EB', 'e1111111-1111-1111-1111-111111111111', true),
('Vận Hành', 'KPI liên quan đến hiệu quả vận hành', '#059669', 'e1111111-1111-1111-1111-111111111111', true),
('Chất Lượng', 'KPI liên quan đến chất lượng sản phẩm/dịch vụ', '#DC2626', 'e1111111-1111-1111-1111-111111111111', true),
('Nhân Sự', 'KPI liên quan đến quản lý nhân sự', '#7C2D12', 'e1111111-1111-1111-1111-111111111111', true),
('Tài Chính', 'KPI liên quan đến hiệu quả tài chính', '#0891B2', 'e1111111-1111-1111-1111-111111111111', true);

-- 2. Tạo KPI Frameworks  
INSERT INTO public.kpi_frameworks (name, description, framework_type, target_level, department_id, created_by, is_active) VALUES
('Khung KPI Kinh Doanh', 'Khung KPI cho phòng Kinh Doanh', 'department', 'operational', '96000050-fe42-4330-b6d2-7e9283b9ad1a', 'e1111111-1111-1111-1111-111111111111', true),
('Khung KPI Kỹ Thuật', 'Khung KPI cho phòng Kỹ Thuật', 'department', 'operational', '08491769-5fde-405a-bed0-0925a21b12c0', 'e1111111-1111-1111-1111-111111111111', true),
('Khung KPI Công Ty', 'Khung KPI cấp công ty', 'company', 'strategic', null, 'e1111111-1111-1111-1111-111111111111', true);