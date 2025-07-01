
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateShiftAssignmentData {
  work_shift_id: string;
  employee_id?: string;
  department_id?: string;
  position_id?: string;
  effective_from: string;
  effective_to?: string;
  created_by: string;
}

export function useShiftAssignmentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createAssignment = useMutation({
    mutationFn: async (data: CreateShiftAssignmentData) => {
      const { data: result, error } = await supabase
        .from('shift_assignments')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-assignments'] });
      toast({
        title: 'Thành công',
        description: 'Đã phân công ca làm việc'
      });
    },
    onError: (error) => {
      console.error('Error creating assignment:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể phân công ca làm việc',
        variant: 'destructive'
      });
    }
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shift_assignments')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-assignments'] });
      toast({
        title: 'Thành công',
        description: 'Đã hủy phân công ca làm việc'
      });
    }
  });

  return {
    createAssignment,
    deleteAssignment
  };
}
