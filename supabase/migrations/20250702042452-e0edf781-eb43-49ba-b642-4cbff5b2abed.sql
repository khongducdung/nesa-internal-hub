-- Tạo database functions cho admin operations
CREATE OR REPLACE FUNCTION public.create_admin_user(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_role system_role DEFAULT 'admin'::system_role
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  -- Kiểm tra quyền admin của người gọi
  IF NOT (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role)) THEN
    RAISE EXCEPTION 'Insufficient permissions to create admin user';
  END IF;

  -- Tạo user trong auth.users (chỉ super admin mới được tạo super admin khác)
  IF p_role = 'super_admin' AND NOT has_system_role(auth.uid(), 'super_admin'::system_role) THEN
    RAISE EXCEPTION 'Only super admin can create other super admins';
  END IF;

  -- Tạo UUID cho user mới
  v_user_id := gen_random_uuid();

  -- Insert vào auth.users (bypass normal auth flow)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('full_name', p_full_name),
    false,
    'authenticated'
  );

  -- Tạo profile
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (v_user_id, p_full_name, p_email);

  -- Assign role
  INSERT INTO public.user_system_roles (user_id, role)
  VALUES (v_user_id, p_role);

  -- Log audit
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (
    auth.uid(),
    'create_admin_user',
    'auth.users',
    v_user_id,
    jsonb_build_object('email', p_email, 'full_name', p_full_name, 'role', p_role)
  );

  v_result := jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'email', p_email,
    'full_name', p_full_name,
    'role', p_role
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để log audit actions
CREATE OR REPLACE FUNCTION public.log_audit_action(
  p_action TEXT,
  p_table_name TEXT DEFAULT NULL,
  p_record_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để get system stats
CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS JSON AS $$
DECLARE
  v_total_users INTEGER;
  v_total_admins INTEGER;
  v_active_sessions INTEGER;
  v_security_alerts INTEGER;
  v_result JSON;
BEGIN
  -- Kiểm tra quyền admin
  IF NOT (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role)) THEN
    RAISE EXCEPTION 'Insufficient permissions to view system stats';
  END IF;

  -- Count total users
  SELECT COUNT(*) INTO v_total_users FROM public.profiles;

  -- Count total admins  
  SELECT COUNT(DISTINCT user_id) INTO v_total_admins 
  FROM public.user_system_roles 
  WHERE role IN ('admin', 'super_admin');

  -- Count active sessions (last 24 hours)
  SELECT COUNT(*) INTO v_active_sessions 
  FROM public.user_sessions 
  WHERE is_active = true AND last_activity > (now() - interval '24 hours');

  -- Count security alerts (failed logins, etc. - mock for now)
  v_security_alerts := 3;

  v_result := jsonb_build_object(
    'total_users', v_total_users,
    'total_admins', v_total_admins,
    'active_sessions', v_active_sessions,
    'security_alerts', v_security_alerts
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;