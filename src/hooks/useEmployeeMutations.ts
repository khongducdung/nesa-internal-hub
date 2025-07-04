
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Create a type for employee update that only includes database fields
type EmployeeUpdateData = {
  employee_code?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  department_id?: string;
  position_id?: string;
  hire_date?: string;
  salary?: number;
  employee_level?: 'level_1' | 'level_2' | 'level_3';
  work_status?: 'active' | 'inactive' | 'pending';
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  job_description?: string;
  contract_file_url?: string;
  cv_file_url?: string;
  profile_id?: string;
  manager_id?: string;
  avatar_url?: string;
  auth_user_id?: string;
};

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EmployeeUpdateData }) => {
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
    mutationFn: async (data: EmployeeUpdateData) => {
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
