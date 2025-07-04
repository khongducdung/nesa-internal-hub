
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmployeeWithDetails } from './useEmployees';

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmployeeWithDetails> }) => {
      console.log('Updating employee with data:', data);
      
      const { error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', id);

      if (error) {
        console.error('Error updating employee:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch employees data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      
      toast({
        title: 'Thành công',
        description: 'Cập nhật thông tin nhân viên thành công',
      });
    },
    onError: (error: any) => {
      console.error('Error in useUpdateEmployee:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật nhân viên',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting employee with id:', id);
      
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting employee:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch employees data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      
      toast({
        title: 'Thành công',
        description: 'Xóa nhân viên thành công',
      });
    },
    onError: (error: any) => {
      console.error('Error in useDeleteEmployee:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa nhân viên',
        variant: 'destructive',
      });
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<EmployeeWithDetails>) => {
      console.log('Creating employee with data:', data);
      
      const { error } = await supabase
        .from('employees')
        .insert(data);

      if (error) {
        console.error('Error creating employee:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch employees data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      
      toast({
        title: 'Thành công',
        description: 'Tạo nhân viên mới thành công',
      });
    },
    onError: (error: any) => {
      console.error('Error in useCreateEmployee:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo nhân viên',
        variant: 'destructive',
      });
    },
  });
}
