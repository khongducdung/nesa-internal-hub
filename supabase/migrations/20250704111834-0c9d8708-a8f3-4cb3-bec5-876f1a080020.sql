
-- Tạo function để lấy thống kê hệ thống
CREATE OR REPLACE FUNCTION public.get_system_overview_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_total_users INTEGER;
  v_total_admins INTEGER;
  v_total_employees INTEGER;
  v_active_okrs INTEGER;
  v_pending_leave_requests INTEGER;
  v_today_attendance INTEGER;
  v_system_health TEXT;
  v_last_backup TIMESTAMP;
  v_storage_used NUMERIC;
  v_result JSON;
BEGIN
  -- Kiểm tra quyền admin
  IF NOT (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role)) THEN
    RAISE EXCEPTION 'Insufficient permissions to view system overview';
  END IF;

  -- Count users
  SELECT COUNT(*) INTO v_total_users FROM public.profiles;
  
  -- Count admins
  SELECT COUNT(DISTINCT user_id) INTO v_total_admins 
  FROM public.user_system_roles 
  WHERE role IN ('admin', 'super_admin');
  
  -- Count active employees
  SELECT COUNT(*) INTO v_total_employees 
  FROM public.employees 
  WHERE work_status = 'active';
  
  -- Count active OKRs
  SELECT COUNT(*) INTO v_active_okrs 
  FROM public.okrs 
  WHERE status = 'active' AND year = EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Count pending leave requests
  SELECT COUNT(*) INTO v_pending_leave_requests 
  FROM public.leave_requests 
  WHERE status = 'pending';
  
  -- Count today's attendance
  SELECT COUNT(*) INTO v_today_attendance 
  FROM public.attendance 
  WHERE date = CURRENT_DATE;
  
  -- System health (simplified)
  v_system_health := 'healthy';
  
  -- Last backup (mock data)
  v_last_backup := NOW() - INTERVAL '1 day';
  
  -- Storage used (mock data)
  v_storage_used := 2.3;

  v_result := jsonb_build_object(
    'total_users', v_total_users,
    'total_admins', v_total_admins,
    'total_employees', v_total_employees,
    'active_okrs', v_active_okrs,
    'pending_leave_requests', v_pending_leave_requests,
    'today_attendance', v_today_attendance,
    'system_health', v_system_health,
    'last_backup', v_last_backup,
    'storage_used', v_storage_used,
    'storage_limit', 10.0,
    'uptime_days', 15,
    'version', 'NESA v2.1.0'
  );

  RETURN v_result;
END;
$function$

-- Thêm một số cài đặt hệ thống mới cho deployment
INSERT INTO public.system_settings (key, value, category, description, data_type, is_public, created_by) VALUES
-- Deployment settings
('app_version', '"2.1.0"', 'deployment', 'Phiên bản ứng dụng', 'string', true, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('maintenance_mode', 'false', 'deployment', 'Chế độ bảo trì', 'boolean', true, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('deployment_environment', '"production"', 'deployment', 'Môi trường triển khai', 'string', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('auto_backup', 'true', 'deployment', 'Tự động sao lưu', 'boolean', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('backup_retention_days', '30', 'deployment', 'Thời gian lưu backup (ngày)', 'number', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('log_level', '"info"', 'deployment', 'Mức độ log', 'string', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),

-- Performance settings
('cache_enabled', 'true', 'performance', 'Bật cache', 'boolean', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('cache_ttl_minutes', '60', 'performance', 'Thời gian cache (phút)', 'number', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('max_concurrent_users', '1000', 'performance', 'Số user đồng thời tối đa', 'number', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),

-- Integration settings  
('webhook_enabled', 'false', 'integration', 'Bật webhook', 'boolean', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('external_api_timeout', '30', 'integration', 'Timeout API ngoài (giây)', 'number', false, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1))

ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = now();
