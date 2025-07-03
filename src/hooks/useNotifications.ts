import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  category: 'general' | 'ideas' | 'okr' | 'kpi' | 'attendance' | 'hrm' | 'processes';
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  is_deleted: boolean;
  action_url?: string;
  action_label?: string;
  created_by?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  sound_enabled: boolean;
  categories: Record<string, { email: boolean; push: boolean }>;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Notification[];
    }
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_read', false)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    }
  });
}

export function useNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_unread_notification_count');

      if (error) throw error;
      return data as number;
    }
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .rpc('mark_notification_read', { notification_id: notificationId });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
    }
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .rpc('mark_all_notifications_read');

      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
      toast({
        title: "Thành công",
        description: `Đã đánh dấu ${count} thông báo là đã đọc`,
      });
    }
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notification: {
      user_id: string;
      title: string;
      message: string;
      type?: string;
      category?: string;
      reference_id?: string;
      reference_type?: string;
      action_url?: string;
      action_label?: string;
      created_by?: string;
      expires_at?: string;
    }) => {
      const { data, error } = await supabase
        .rpc('create_notification', {
          p_user_id: notification.user_id,
          p_title: notification.title,
          p_message: notification.message,
          p_type: notification.type || 'info',
          p_category: notification.category || 'general',
          p_reference_id: notification.reference_id,
          p_reference_type: notification.reference_type,
          p_action_url: notification.action_url,
          p_action_label: notification.action_label,
          p_created_by: notification.created_by,
          p_expires_at: notification.expires_at
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo thông báo",
        variant: "destructive",
      });
    }
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as NotificationSettings | null;
    }
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Partial<NotificationSettings>) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.data.user.id,
          ...settings,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật cài đặt thông báo",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật cài đặt thông báo",
        variant: "destructive",
      });
    }
  });
}