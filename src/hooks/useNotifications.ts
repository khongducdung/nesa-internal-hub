
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface ProcessNotification {
  id: string;
  process_template_id: string;
  user_id: string;
  message: string;
  type: 'new_process' | 'process_updated';
  is_read: boolean;
  created_at: string;
  process_template?: {
    name: string;
    category: string;
  };
}

export const useCreateProcessNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      processTemplateId, 
      processName, 
      targetUsers, 
      notificationType 
    }: {
      processTemplateId: string;
      processName: string;
      targetUsers: string[];
      notificationType: 'new_process' | 'process_updated';
    }) => {
      if (!user) {
        throw new Error('Bạn cần đăng nhập để thực hiện chức năng này');
      }

      const message = notificationType === 'new_process' 
        ? `Có tài liệu hướng dẫn mới: "${processName}" được tạo cho bạn`
        : `Tài liệu hướng dẫn: "${processName}" đã được cập nhật`;

      const notifications = targetUsers.map(userId => ({
        process_template_id: processTemplateId,
        user_id: userId,
        message,
        type: notificationType,
        is_read: false
      }));

      // Use raw SQL query since the table is not in the TypeScript types yet
      const { data, error } = await supabase
        .rpc('insert_process_notifications', {
          notifications_data: notifications
        });

      // Fallback: If RPC doesn't exist, try direct insert
      if (error && error.message.includes('function')) {
        const { data: directData, error: directError } = await supabase
          .from('process_notifications' as any)
          .insert(notifications)
          .select();

        if (directError) {
          throw new Error(`Lỗi tạo thông báo: ${directError.message}`);
        }

        return directData;
      }

      if (error) {
        throw new Error(`Lỗi tạo thông báo: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Thành công",
        description: `Đã gửi thông báo cho ${Array.isArray(data) ? data.length : targetUsers?.length || 0} nhân viên`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi gửi thông báo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useGetTargetUsers = (targetType: string, targetIds: string[]) => {
  return useQuery({
    queryKey: ['target-users', targetType, targetIds],
    queryFn: async () => {
      if (targetType === 'general') {
        // Lấy tất cả nhân viên
        const { data, error } = await supabase
          .from('employees')
          .select('auth_user_id')
          .eq('work_status', 'active')
          .not('auth_user_id', 'is', null);

        if (error) throw error;
        return data.map(emp => emp.auth_user_id).filter(Boolean);
      }

      if (targetType === 'employee') {
        return targetIds;
      }

      if (targetType === 'department') {
        const { data, error } = await supabase
          .from('employees')
          .select('auth_user_id')
          .in('department_id', targetIds)
          .eq('work_status', 'active')
          .not('auth_user_id', 'is', null);

        if (error) throw error;
        return data.map(emp => emp.auth_user_id).filter(Boolean);
      }

      if (targetType === 'position') {
        const { data, error } = await supabase
          .from('employees')
          .select('auth_user_id')
          .in('position_id', targetIds)
          .eq('work_status', 'active')
          .not('auth_user_id', 'is', null);

        if (error) throw error;
        return data.map(emp => emp.auth_user_id).filter(Boolean);
      }

      return [];
    },
    enabled: !!targetType && (targetType === 'general' || targetIds.length > 0),
  });
};
