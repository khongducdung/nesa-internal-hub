
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WorkShift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  days_of_week: number[];
  attendance_setting_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attendance_settings?: {
    id: string;
    name: string;
  };
}

export function useWorkShifts() {
  return useQuery({
    queryKey: ['work-shifts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_shifts')
        .select(`
          *,
          attendance_settings:attendance_setting_id (
            id,
            name
          )
        `)
        .order('name');

      if (error) throw error;
      return data as WorkShift[];
    },
  });
}

export function useCreateWorkShift() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (shiftData: Omit<WorkShift, 'id' | 'created_at' | 'updated_at' | 'attendance_settings'>) => {
      const { data, error } = await supabase
        .from('work_shifts')
        .insert(shiftData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-shifts'] });
      toast({
        title: 'Thành công',
        description: 'Tạo ca làm việc mới thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo ca làm việc',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateWorkShift() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WorkShift> }) => {
      const { data: result, error } = await supabase
        .from('work_shifts')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-shifts'] });
      toast({
        title: 'Thành công',
        description: 'Cập nhật ca làm việc thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật ca làm việc',
        variant: 'destructive',
      });
    },
  });
}
