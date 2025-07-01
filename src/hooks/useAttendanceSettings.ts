import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface AttendanceSetting {
  id: string;
  name: string;
  description?: string;
  work_start_time: string;
  work_end_time: string;
  break_start_time?: string;
  break_end_time?: string;
  late_threshold_minutes: number;
  early_leave_threshold_minutes: number;
  overtime_start_after_minutes: number;
  require_gps_check: boolean;
  gps_radius_meters: number;
  weekend_work_allowed: boolean;
  is_default: boolean;
  status: string;
  allow_multiple_checkins: boolean;
  require_daily_start_checkin: boolean;
  require_daily_end_checkout: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  // New fields
  early_checkin_allowed_minutes?: number;
  late_checkout_allowed_minutes?: number;
  count_early_checkin_as_work?: boolean;
  count_late_checkout_as_work?: boolean;
  saturday_work_enabled?: boolean;
  saturday_work_type?: 'off' | 'full' | 'half_morning' | 'half_afternoon';
}

export function useAttendanceSettings() {
  return useQuery({
    queryKey: ['attendance-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_settings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AttendanceSetting[];
    }
  });
}

export function useAttendanceSettingMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createSetting = useMutation({
    mutationFn: async (data: Omit<AttendanceSetting, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('attendance_settings')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-settings'] });
    },
    onError: (error) => {
      console.error('Error creating attendance setting:', error);
      toast({
        title: 'Lỗi tạo cài đặt chấm công',
        description: 'Không thể tạo cài đặt chấm công. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  return { createSetting };
}
