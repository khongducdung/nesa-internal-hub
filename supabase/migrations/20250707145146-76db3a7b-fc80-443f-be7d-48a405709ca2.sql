-- Xóa module Performance vì không nằm trong 6 module chính
DELETE FROM public.permissions WHERE module = 'performance';
DELETE FROM public.module_categories WHERE name = 'Performance';

-- Cập nhật lại 6 module chính
UPDATE public.module_categories SET 
  name = 'HRM',
  description = 'Quản lý nhân sự',
  icon = 'users',
  sort_order = 1
WHERE name = 'HRM';

UPDATE public.module_categories SET 
  name = 'Attendance', 
  description = 'Chấm công',
  icon = 'clock',
  sort_order = 2
WHERE name = 'Attendance';

UPDATE public.module_categories SET 
  name = 'Processes',
  description = 'Quản lý quy trình', 
  icon = 'workflow',
  sort_order = 3
WHERE name = 'Processes';

UPDATE public.module_categories SET 
  name = 'KPI',
  description = 'Quản lý KPI',
  icon = 'trending-up', 
  sort_order = 4
WHERE name = 'KPI';

UPDATE public.module_categories SET 
  name = 'OKR',
  description = 'Quản lý OKR',
  icon = 'target',
  sort_order = 5 
WHERE name = 'OKR';

UPDATE public.module_categories SET 
  name = 'System',
  description = 'Cài đặt hệ thống',
  icon = 'settings',
  sort_order = 6
WHERE name = 'System';

-- Xóa tất cả permissions hiện tại để tạo lại
DELETE FROM public.role_permissions;
DELETE FROM public.user_permissions;
DELETE FROM public.permissions;

-- Tạo lại permissions chi tiết cho từng module

-- 1. Module HRM (Quản lý nhân sự)
INSERT INTO public.permissions (name, description, module, action, category_id, sort_order) VALUES
('hrm_view_dashboard', 'Xem dashboard nhân sự', 'hrm', 'view', 
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 1),
('hrm_manage_departments', 'Quản lý phòng ban', 'hrm', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 2),
('hrm_view_departments', 'Xem phòng ban', 'hrm', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 3),
('hrm_manage_positions', 'Quản lý vị trí công việc', 'hrm', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 4),
('hrm_view_positions', 'Xem vị trí công việc', 'hrm', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 5),
('hrm_manage_employees', 'Quản lý nhân viên', 'hrm', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 6),
('hrm_view_employees', 'Xem thông tin nhân viên', 'hrm', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 7),
('hrm_manage_training', 'Quản lý đào tạo', 'hrm', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 8),
('hrm_view_training', 'Xem chương trình đào tạo', 'hrm', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 9),
('hrm_manage_competency', 'Quản lý khung năng lực', 'hrm', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 10),
('hrm_view_competency', 'Xem khung năng lực', 'hrm', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 11),
('hrm_manage_policies', 'Quản lý chính sách công ty', 'hrm', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 12),
('hrm_view_policies', 'Xem chính sách công ty', 'hrm', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'HRM'), 13);

-- 2. Module Attendance (Chấm công)  
INSERT INTO public.permissions (name, description, module, action, category_id, sort_order) VALUES
('attendance_view_dashboard', 'Xem dashboard chấm công', 'attendance', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 1),
('attendance_checkin_checkout', 'Thực hiện check-in/check-out', 'attendance', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 2),
('attendance_view_records', 'Xem bản ghi chấm công', 'attendance', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 3),
('attendance_manage_records', 'Quản lý bản ghi chấm công', 'attendance', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 4),
('attendance_manage_settings', 'Quản lý cài đặt chấm công', 'attendance', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 5),
('attendance_manage_shifts', 'Quản lý ca làm việc', 'attendance', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 6),
('attendance_view_shifts', 'Xem ca làm việc', 'attendance', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 7),
('attendance_manage_locations', 'Quản lý địa điểm chấm công', 'attendance', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 8),
('attendance_view_reports', 'Xem báo cáo chấm công', 'attendance', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 9),
('attendance_export_reports', 'Xuất báo cáo chấm công', 'attendance', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Attendance'), 10);

-- 3. Module Processes (Quản lý quy trình)
INSERT INTO public.permissions (name, description, module, action, category_id, sort_order) VALUES
('processes_view_dashboard', 'Xem dashboard quy trình', 'processes', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'Processes'), 1),
('processes_manage_templates', 'Quản lý mẫu quy trình', 'processes', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Processes'), 2),
('processes_view_templates', 'Xem mẫu quy trình', 'processes', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'Processes'), 3),
('processes_create_instances', 'Tạo quy trình thực thi', 'processes', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Processes'), 4),
('processes_view_instances', 'Xem quy trình thực thi', 'processes', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'Processes'), 5),
('processes_approve_tasks', 'Phê duyệt nhiệm vụ', 'processes', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Processes'), 6),
('processes_manage_categories', 'Quản lý danh mục quy trình', 'processes', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'Processes'), 7);

-- 4. Module KPI (Quản lý KPI)
INSERT INTO public.permissions (name, description, module, action, category_id, sort_order) VALUES
('kpi_view_dashboard', 'Xem dashboard KPI', 'kpi', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 1),
('kpi_manage_frameworks', 'Quản lý khung KPI', 'kpi', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 2),
('kpi_view_frameworks', 'Xem khung KPI', 'kpi', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 3),
('kpi_manage_indicators', 'Quản lý chỉ số KPI', 'kpi', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 4),
('kpi_view_indicators', 'Xem chỉ số KPI', 'kpi', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 5),
('kpi_input_measurements', 'Nhập số liệu đo lường', 'kpi', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 6),
('kpi_view_measurements', 'Xem số liệu đo lường', 'kpi', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 7),
('kpi_manage_targets', 'Quản lý mục tiêu KPI', 'kpi', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 8),
('kpi_view_reports', 'Xem báo cáo KPI', 'kpi', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 9),
('kpi_manage_action_plans', 'Quản lý kế hoạch hành động', 'kpi', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'KPI'), 10);

-- 5. Module OKR (Quản lý OKR)
INSERT INTO public.permissions (name, description, module, action, category_id, sort_order) VALUES
('okr_view_dashboard', 'Xem dashboard OKR', 'okr', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 1),
('okr_manage_cycles', 'Quản lý chu kỳ OKR', 'okr', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 2),
('okr_view_cycles', 'Xem chu kỳ OKR', 'okr', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 3),
('okr_create_objectives', 'Tạo mục tiêu OKR', 'okr', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 4),
('okr_view_objectives', 'Xem mục tiêu OKR', 'okr', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 5),
('okr_update_progress', 'Cập nhật tiến độ OKR', 'okr', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 6),
('okr_view_progress', 'Xem tiến độ OKR', 'okr', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 7),
('okr_manage_alignments', 'Quản lý liên kết OKR', 'okr', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 8),
('okr_view_analytics', 'Xem phân tích OKR', 'okr', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 9),
('okr_manage_settings', 'Quản lý cài đặt OKR', 'okr', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'OKR'), 10);

-- 6. Module System (Cài đặt hệ thống)
INSERT INTO public.permissions (name, description, module, action, category_id, sort_order) VALUES
('system_view_dashboard', 'Xem dashboard hệ thống', 'system', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 1),
('system_manage_users', 'Quản lý người dùng hệ thống', 'system', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 2),
('system_view_users', 'Xem người dùng hệ thống', 'system', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 3),
('system_manage_permissions', 'Quản lý phân quyền', 'system', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 4),
('system_view_audit_logs', 'Xem nhật ký kiểm toán', 'system', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 5),
('system_manage_settings', 'Quản lý cài đặt hệ thống', 'system', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 6),
('system_view_health', 'Xem tình trạng hệ thống', 'system', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 7),
('system_manage_integrations', 'Quản lý tích hợp', 'system', 'manage',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 8),
('system_view_statistics', 'Xem thống kê hệ thống', 'system', 'view',
 (SELECT id FROM public.module_categories WHERE name = 'System'), 9);

-- Cấp lại toàn bộ quyền cho Super Admin
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'super_admin', id FROM public.permissions;

-- Cấp quyền view cho Admin (không có quyền quản lý hệ thống)
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions 
WHERE action = 'view' OR name NOT LIKE 'system_%';