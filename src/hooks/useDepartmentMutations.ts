
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Department } from '@/types/database';

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('departments')
        .insert(data);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: 'Thành công',
        description: 'Tạo phòng ban mới thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo phòng ban',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Department> }) => {
      const { error } = await supabase
        .from('departments')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: 'Thành công',
        description: 'Cập nhật phòng ban thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật phòng ban',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: 'Thành công',
        description: 'Xóa phòng ban thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa phòng ban',
        variant: 'destructive',
      });
    },
  });
}
