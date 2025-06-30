
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  weekend_work_allowed: boolean;
  require_gps_check: boolean;
  gps_radius_meters: number;
  is_default: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function useAttendanceSettings() {
  return useQuery({
    queryKey: ['attendance-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_settings')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name');

      if (error) throw error;
      return data as AttendanceSetting[];
    },
  });
}

export function useCreateAttendanceSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settingData: Omit<AttendanceSetting, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('attendance_settings')
        .insert({
          ...settingData,
          created_by: '00000000-0000-0000-0000-000000000000' // Tạm thời
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-settings'] });
      toast({
        title: 'Thành công',
        description: 'Tạo cài đặt chấm công mới thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo cài đặt chấm công',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateAttendanceSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AttendanceSetting> }) => {
      const { data: result, error } = await supabase
        .from('attendance_settings')
        .update(data)
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
        description: 'Cập nhật cài đặt chấm công thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật cài đặt chấm công',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteAttendanceSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attendance_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-settings'] });
      toast({
        title: 'Thành công',
        description: 'Xóa cài đặt chấm công thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa cài đặt chấm công',
        variant: 'destructive',
      });
    },
  });
}
