-- Cập nhật database function để tính toán số liệu thực tế
CREATE OR REPLACE FUNCTION public.get_system_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_total_users INTEGER;
  v_total_admins INTEGER;
  v_active_sessions INTEGER;
  v_security_alerts INTEGER;
  v_total_employees INTEGER;
  v_active_okrs INTEGER;
  v_pending_leave_requests INTEGER;
  v_today_attendance INTEGER;
  v_result JSON;
BEGIN
  -- Kiểm tra quyền admin
  IF NOT (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role)) THEN
    RAISE EXCEPTION 'Insufficient permissions to view system stats';
  END IF;

  -- Count total users from profiles
  SELECT COUNT(*) INTO v_total_users FROM public.profiles;

  -- Count total admins  
  SELECT COUNT(DISTINCT user_id) INTO v_total_admins 
  FROM public.user_system_roles 
  WHERE role IN ('admin', 'super_admin');

  -- Count active employees
  SELECT COUNT(*) INTO v_total_employees 
  FROM public.employees 
  WHERE work_status = 'active';

  -- Count active OKRs this year
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

  -- Count security alerts (failed login attempts from last 24h)
  SELECT COUNT(*) INTO v_security_alerts 
  FROM public.audit_logs 
  WHERE action IN ('login_failed', 'suspicious_activity') 
  AND created_at > (now() - interval '24 hours');

  v_result := jsonb_build_object(
    'total_users', v_total_users,
    'total_admins', v_total_admins,
    'total_employees', v_total_employees,
    'active_okrs', v_active_okrs,
    'pending_leave_requests', v_pending_leave_requests,
    'today_attendance', v_today_attendance,
    'security_alerts', v_security_alerts
  );

  RETURN v_result;
END;
$function$;

-- Thêm domain setting cho API
INSERT INTO public.system_settings (key, value, category, description, data_type, is_public, created_by) VALUES
('api_domain', '"app.nesagroups.com"', 'api', 'Domain chính của hệ thống API', 'string', true, (SELECT id FROM auth.users LIMIT 1)),
('api_base_url', '"https://app.nesagroups.com"', 'api', 'Base URL của API hệ thống', 'string', true, (SELECT id FROM auth.users LIMIT 1)),
('cors_allowed_origins', '["https://app.nesagroups.com", "https://nesagroups.com"]', 'api', 'Danh sách domain được phép CORS', 'json', false, (SELECT id FROM auth.users LIMIT 1)),
('api_documentation_url', '"https://app.nesagroups.com/docs"', 'api', 'URL tài liệu API', 'string', true, (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = now();