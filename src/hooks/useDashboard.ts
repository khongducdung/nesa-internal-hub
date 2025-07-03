import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useUserRole() {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: roles, error } = await supabase
        .from('user_system_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const roleHierarchy = ['super_admin', 'admin', 'user'] as const;
      type SystemRole = typeof roleHierarchy[number];
      const userRoles = roles?.map(r => r.role as SystemRole) || [];
      
      // Return highest role in hierarchy
      for (const role of roleHierarchy) {
        if (userRoles.includes(role)) {
          return role;
        }
      }
      
      return 'user' as const;
    }
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get employee info
      const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      // Get attendance today
      const today = new Date().toISOString().split('T')[0];
      const { data: todayAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employee?.id)
        .eq('date', today)
        .single();

      // Get this month attendance
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const { data: monthAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employee?.id)
        .gte('date', startOfMonth);

      // Get my ideas count
      const { data: myIdeas } = await supabase
        .from('ideas')
        .select('id')
        .eq('created_by', user.id);

      // Get my active OKRs
      const currentYear = new Date().getFullYear();
      const { data: myOKRs } = await supabase
        .from('okr_objectives')
        .select('*')
        .eq('employee_id', employee?.id)
        .eq('year', currentYear)
        .eq('status', 'active');

      // Get my KPIs
      const { data: myKPIs } = await supabase
        .from('kpis')
        .select('*')
        .eq('employee_id', employee?.id)
        .eq('year', currentYear);

      // Get recent notifications
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        employee,
        todayAttendance,
        monthAttendance: monthAttendance || [],
        myIdeas: myIdeas || [],
        myOKRs: myOKRs || [],
        myKPIs: myKPIs || [],
        notifications: notifications || []
      };
    }
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_stats');
      if (error) throw error;
      
      return data as {
        total_employees: number;
        active_okrs: number;
        today_attendance: number;
        pending_leave_requests: number;
        total_admins: number;
        security_alerts: number;
      };
    }
  });
}