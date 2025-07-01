
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateAttendanceSettingData {
  name: string;
  description?: string;
  work_start_time: string;
  work_end_time: string;
  break_start_time?: string;
  break_end_time?: string;
  late_threshold_minutes: number;
  early_leave_threshold_minutes: number;
  overtime_start_after_minutes: number;
  weekend_work_allowed: boolean;
  require_gps_check: boolean;
  gps_radius_meters: number;
  saturday_work_enabled?: boolean;
  saturday_work_type?: string;
  require_daily_start_checkin?: boolean;
  require_daily_end_checkout?: boolean;
  allow_multiple_checkins?: boolean;
  early_checkin_allowed_minutes?: number;
  late_checkout_allowed_minutes?: number;
  count_early_checkin_as_work?: boolean;
  count_late_checkout_as_work?: boolean;
}

export function useAttendanceSettingsMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createSettings = useMutation({
    mutationFn: async (data: CreateAttendanceSettingData) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('attendance_settings')
        .insert([{
          ...data,
          created_by: user.user.id,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã tạo cài đặt chấm công mới'
      });
    },
    onError: (error) => {
      console.error('Error creating attendance settings:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo cài đặt chấm công',
        variant: 'destructive'
      });
    }
  });

  const updateSettings = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAttendanceSettingData> }) => {
      const { data: result, error } = await supabase
        .from('attendance_settings')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật cài đặt chấm công'
      });
    },
    onError: (error) => {
      console.error('Error updating attendance settings:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật cài đặt chấm công',
        variant: 'destructive'
      });
    }
  });

  return {
    createSettings,
    updateSettings
  };
}
