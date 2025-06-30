
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCreateCompetencyFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('competency_frameworks')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competency-frameworks'] });
      toast.success('Khung năng lực đã được tạo thành công!');
    },
    onError: (error) => {
      console.error('Error creating competency framework:', error);
      toast.error('Có lỗi xảy ra khi tạo khung năng lực');
    },
  });
}

export function useUpdateCompetencyFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('competency_frameworks')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competency-frameworks'] });
      queryClient.invalidateQueries({ queryKey: ['competency-framework'] });
      toast.success('Khung năng lực đã được cập nhật!');
    },
    onError: (error) => {
      console.error('Error updating competency framework:', error);
      toast.error('Có lỗi xảy ra khi cập nhật khung năng lực');
    },
  });
}

export function useDeleteCompetencyFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('competency_frameworks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competency-frameworks'] });
      toast.success('Khung năng lực đã được xóa!');
    },
    onError: (error) => {
      console.error('Error deleting competency framework:', error);
      toast.error('Có lỗi xảy ra khi xóa khung năng lực');
    },
  });
}
