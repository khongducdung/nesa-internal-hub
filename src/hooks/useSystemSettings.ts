import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  type: 'boolean' | 'string' | 'number';
}

// Mock data cho demo - trong thực tế sẽ lưu trong database
const MOCK_SETTINGS: SystemSetting[] = [
  { id: '1', key: 'require_2fa', value: true, category: 'security', description: 'Yêu cầu xác thực 2 bước', type: 'boolean' },
  { id: '2', key: 'account_lockout', value: true, category: 'security', description: 'Khóa tài khoản sau thất bại', type: 'boolean' },
  { id: '3', key: 'auto_logout', value: false, category: 'security', description: 'Phiên làm việc tự động hết hạn', type: 'boolean' },
  { id: '4', key: 'system_email_notifications', value: true, category: 'notifications', description: 'Email thông báo hệ thống', type: 'boolean' },
  { id: '5', key: 'performance_reminders', value: true, category: 'notifications', description: 'Thông báo đánh giá hiệu suất', type: 'boolean' },
  { id: '6', key: 'weekly_reports', value: false, category: 'notifications', description: 'Báo cáo tuần', type: 'boolean' },
  { id: '7', key: 'auto_backup', value: true, category: 'system', description: 'Sao lưu tự động', type: 'boolean' },
  { id: '8', key: 'detailed_logging', value: true, category: 'system', description: 'Ghi log chi tiết', type: 'boolean' },
  { id: '9', key: 'maintenance_mode', value: false, category: 'system', description: 'Chế độ bảo trì', type: 'boolean' },
  { id: '10', key: 'api_rate_limiting', value: true, category: 'api', description: 'API Rate Limiting', type: 'boolean' },
  { id: '11', key: 'api_logging', value: false, category: 'api', description: 'API Logging', type: 'boolean' },
];

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      // Trong thực tế, có thể lấy từ bảng system_settings
      return MOCK_SETTINGS;
    }
  });
};

export const useUpdateSystemSetting = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      // Trong thực tế sẽ update database
      // Hiện tại chỉ update local state
      const currentSettings = queryClient.getQueryData<SystemSetting[]>(['system-settings']) || [];
      const updatedSettings = currentSettings.map(setting =>
        setting.key === key ? { ...setting, value } : setting
      );
      queryClient.setQueryData(['system-settings'], updatedSettings);
      
      return { key, value };
    },
    onSuccess: ({ key }) => {
      toast({
        title: 'Thành công',
        description: `Cập nhật cài đặt ${key} thành công`
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
      // Lấy thống kê từ database
      const { data: usersCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { data: adminsCount } = await supabase
        .from('user_system_roles')
        .select('user_id', { count: 'exact', head: true })
        .in('role', ['admin', 'super_admin']);

      return {
        totalUsers: usersCount?.length || 0,
        totalAdmins: adminsCount?.length || 0,
        activeSessions: 42, // Mock data
        securityAlerts: 3   // Mock data
      };
    }
  });
};