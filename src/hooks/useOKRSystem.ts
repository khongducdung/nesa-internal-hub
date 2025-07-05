
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSaveRewardSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'okr_reward_settings',
            value: JSON.stringify(settings),
            category: 'okr',
            description: 'Cài đặt hệ thống thưởng OKR',
            data_type: 'json',
            is_public: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã lưu cài đặt hệ thống thưởng'
      });
    },
    onError: (error: any) => {
      console.error('Error saving reward settings:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu cài đặt hệ thống thưởng',
        variant: 'destructive'
      });
    }
  });
};

export const useSaveAlignmentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'okr_alignment_settings',
            value: JSON.stringify(settings),
            category: 'okr',
            description: 'Cài đặt liên kết OKR',
            data_type: 'json',
            is_public: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã lưu cài đặt liên kết OKR'
      });
    },
    onError: (error: any) => {
      console.error('Error saving alignment settings:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu cài đặt liên kết OKR',
        variant: 'destructive'
      });
    }
  });
};

export const useSaveAchievements = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievements: any[]) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'okr_achievements',
            value: JSON.stringify(achievements),
            category: 'okr',
            description: 'Danh sách thành tựu OKR',
            data_type: 'json',
            is_public: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã lưu danh sách thành tựu'
      });
    },
    onError: (error: any) => {
      console.error('Error saving achievements:', error);
      toast({
        title: 'Lỗi',  
        description: error.message || 'Không thể lưu danh sách thành tựu',
        variant: 'destructive'
      });
    }
  });
};

export const useSaveNotificationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'okr_notification_settings',
            value: JSON.stringify(settings),
            category: 'okr',
            description: 'Cài đặt thông báo OKR',
            data_type: 'json',
            is_public: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã lưu cài đặt thông báo'
      });
    },
    onError: (error: any) => {
      console.error('Error saving notification settings:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu cài đặt thông báo',
        variant: 'destructive'
      });
    }
  });
};
