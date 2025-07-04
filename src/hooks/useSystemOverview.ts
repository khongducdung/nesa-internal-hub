
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemOverviewStats {
  total_users: number;
  total_admins: number;
  total_employees: number;
  active_okrs: number;
  pending_leave_requests: number;
  today_attendance: number;
  system_health: string;
  last_backup: string;
  storage_used: number;
  storage_limit: number;
  uptime_days: number;
  version: string;
}

export const useSystemOverview = () => {
  return useQuery({
    queryKey: ['system-overview'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_overview_stats' as any);
      
      if (error) throw error;
      
      return data as unknown as SystemOverviewStats;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};
