
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  data_type: 'boolean' | 'string' | 'number' | 'json';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemStats {
  total_users: number;
  total_admins: number;
  total_employees: number;
  active_okrs: number;
  pending_leave_requests: number;
  today_attendance: number;
  security_alerts: number;
}

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true })
        .order('key', { ascending: true });

      if (error) throw error;

      // Parse JSON values
      return (data || []).map(setting => ({
        ...setting,
        value: setting.data_type === 'boolean' 
          ? setting.value === 'true' || setting.value === true
          : setting.data_type === 'number'
          ? Number(setting.value)
          : setting.data_type === 'json'
          ? JSON.parse(setting.value as string)
          : typeof setting.value === 'string' && setting.value.startsWith('"') && setting.value.endsWith('"')
          ? JSON.parse(setting.value)
          : setting.value
      })) as SystemSetting[];
    }
  });
};

export const useUpdateSystemSetting = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      // Convert value to proper format for database
      let dbValue = value;
      if (typeof value === 'boolean') {
        dbValue = value.toString();
      } else if (typeof value === 'string') {
        dbValue = JSON.stringify(value);
      } else if (typeof value === 'number') {
        dbValue = value.toString();
      } else {
        dbValue = JSON.stringify(value);
      }

      const { data, error } = await supabase
        .from('system_settings')
        .update({ 
          value: dbValue, 
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;

      // Log audit action
      await supabase.rpc('log_audit_action', {
        p_action: 'update_setting',
        p_table_name: 'system_settings',
        p_record_id: data.id,
        p_new_values: { key, value }
      });

      return data;
    },
    onSuccess: ({ key }) => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      queryClient.invalidateQueries({ queryKey: ['system-overview'] });
      toast({
        title: 'Thành công',
        description: `Cập nhật cài đặt "${key}" thành công`
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật cài đặt',
        variant: 'destructive'
      });
    }
  });
};

export const useSystemStats = () => {
  return useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_stats');
      
      if (error) throw error;
      
      return data as unknown as SystemStats;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};

export const useAuditLogs = (limit = 50) => {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: async () => {
      // First get audit logs
      const { data: auditLogs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Then get profiles for users who have audit logs
      const userIds = auditLogs?.filter(log => log.user_id).map(log => log.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      // Combine the data
      const logsWithProfiles = auditLogs?.map(log => ({
        ...log,
        profiles: profiles?.find(profile => profile.id === log.user_id) || null
      }));

      return logsWithProfiles;
    }
  });
};
