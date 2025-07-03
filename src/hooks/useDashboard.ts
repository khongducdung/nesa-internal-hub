import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  todayAttendance: number;
  pendingLeaveRequests: number;
  activeOKRs: number;
  completedOKRs: number;
  averageKPIProgress: number;
  todayPresent: number;
  todayLate: number;
  thisMonthAttendance: number;
  unreadNotifications: number;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  overtime: number;
  onTimePercentage: number;
}

export interface UserOKRProgress {
  totalOKRs: number;
  completedOKRs: number;
  inProgressOKRs: number;
  averageProgress: number;
  rank: number;
}

export function useDashboardStats() {
  const { isSuperAdmin, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const stats: Partial<DashboardStats> = {};

      if (isSuperAdmin || isAdmin) {
        // Get employee counts
        const { data: employees } = await supabase
          .from('employees')
          .select('work_status');
        
        stats.totalEmployees = employees?.length || 0;
        stats.activeEmployees = employees?.filter(emp => emp.work_status === 'active').length || 0;

        // Get today's attendance
        const today = new Date().toISOString().split('T')[0];
        const { data: attendance } = await supabase
          .from('attendance')
          .select('*')
          .eq('date', today);
        
        stats.todayAttendance = attendance?.length || 0;
        stats.todayPresent = attendance?.filter(att => att.status === 'present').length || 0;
        stats.todayLate = attendance?.filter(att => att.is_late).length || 0;

        // Get pending leave requests
        const { data: leaveRequests } = await supabase
          .from('leave_requests')
          .select('*')
          .eq('status', 'pending');
        
        stats.pendingLeaveRequests = leaveRequests?.length || 0;

        // Get OKR stats
        const currentYear = new Date().getFullYear();
        const { data: okrs } = await supabase
          .from('okrs')
          .select('status')
          .eq('year', currentYear);
        
        stats.activeOKRs = okrs?.filter(okr => okr.status === 'active').length || 0;
        stats.completedOKRs = okrs?.filter(okr => okr.status === 'completed').length || 0;
      }

      return stats as DashboardStats;
    },
    enabled: isSuperAdmin || isAdmin,
  });
}

export function useUserAttendanceSummary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-attendance-summary', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!employee) return null;

      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employee.id)
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0]);

      const totalDays = attendance?.length || 0;
      const presentDays = attendance?.filter(att => att.status === 'present').length || 0;
      const lateDays = attendance?.filter(att => att.is_late).length || 0;
      const absentDays = attendance?.filter(att => att.status === 'absent').length || 0;
      const overtime = attendance?.reduce((sum, att) => sum + (att.overtime_hours || 0), 0) || 0;
      const onTimePercentage = totalDays > 0 ? Math.round(((presentDays - lateDays) / totalDays) * 100) : 0;

      return {
        totalDays,
        presentDays,
        lateDays,
        absentDays,
        overtime,
        onTimePercentage,
      } as AttendanceSummary;
    },
    enabled: !!user?.id,
  });
}

export function useUserOKRProgress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-okr-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!employee) return null;

      const currentYear = new Date().getFullYear();
      const { data: okrs } = await supabase
        .from('okrs')
        .select('status')
        .eq('employee_id', employee.id)
        .eq('year', currentYear);

      const totalOKRs = okrs?.length || 0;
      const completedOKRs = okrs?.filter(okr => okr.status === 'completed').length || 0;
      const inProgressOKRs = okrs?.filter(okr => okr.status === 'active').length || 0;
      const averageProgress = totalOKRs > 0 
        ? Math.round((completedOKRs / totalOKRs) * 100)
        : 0;

      return {
        totalOKRs,
        completedOKRs,
        inProgressOKRs,
        averageProgress,
        rank: 1, // This would need to be calculated based on company-wide comparison
      } as UserOKRProgress;
    },
    enabled: !!user?.id,
  });
}

export function useUserCompetencyFramework() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-competency-framework', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: employee } = await supabase
        .from('employees')
        .select(`
          id,
          position_id,
          positions (
            id,
            name
          )
        `)
        .eq('auth_user_id', user.id)
        .single();

      if (!employee?.position_id) return null;

      const { data: framework } = await supabase
        .from('competency_frameworks')
        .select('*')
        .eq('position_id', employee.position_id)
        .single();

      return framework || null;
    },
    enabled: !!user?.id,
  });
}

export function useRecentNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(5);

      return data || [];
    },
    enabled: !!user?.id,
  });
}