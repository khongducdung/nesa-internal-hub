
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface WorkSession {
  name: string;
  start_time: string;
  end_time: string;
  [key: string]: any; // Add index signature for Json compatibility
}

interface CreateWorkShiftData {
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  days_of_week: number[];
  shift_type?: 'fulltime' | 'parttime' | 'flexible';
  min_hours_per_day?: number;
  max_hours_per_day?: number;
  color?: string;
  attendance_setting_id: string;
  // New fields
  work_sessions?: WorkSession[];
  saturday_work_type?: 'off' | 'full' | 'half_morning' | 'half_afternoon';
  saturday_work_sessions?: WorkSession[];
  total_work_coefficient?: number;
}

export function useWorkShiftMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createShift = useMutation({
    mutationFn: async (data: CreateWorkShiftData) => {
      // Convert WorkSession arrays to Json for database
      const dbData = {
        ...data,
        work_sessions: data.work_sessions as any,
        saturday_work_sessions: data.saturday_work_sessions as any
      };

      const { data: result, error } = await supabase
        .from('work_shifts')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-shifts'] });
    },
    onError: (error) => {
      console.error('Error creating work shift:', error);
      toast({
        title: 'Lỗi tạo ca làm việc',
        description: 'Không thể tạo ca làm việc. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  const updateShift = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateWorkShiftData> }) => {
      // Convert WorkSession arrays to Json for database
      const dbData = {
        ...data,
        work_sessions: data.work_sessions as any,
        saturday_work_sessions: data.saturday_work_sessions as any,
        updated_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('work_shifts')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-shifts'] });
    },
    onError: (error) => {
      console.error('Error updating work shift:', error);
      toast({
        title: 'Lỗi cập nhật ca làm việc',
        description: 'Không thể cập nhật ca làm việc. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  const deleteShift = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('work_shifts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-shifts'] });
    },
    onError: (error) => {
      console.error('Error deleting work shift:', error);
      toast({
        title: 'Lỗi xóa ca làm việc',
        description: 'Không thể xóa ca làm việc. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  return {
    createShift,
    updateShift,
    deleteShift
  };
}
