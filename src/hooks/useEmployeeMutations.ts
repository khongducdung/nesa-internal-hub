
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

// Create a type for employee creation that requires essential fields
type EmployeeCreateData = {
  employee_code: string;
  full_name: string;
  email: string;
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
    mutationFn: async (data: EmployeeCreateData) => {
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

// Updated mutation for creating employee account using signUp instead of admin functions
export function useCreateEmployeeAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ employeeId, email, password, fullName }: { 
      employeeId: string; 
      email: string; 
      password: string; 
      fullName: string; 
    }) => {
      console.log('Creating account for employee:', employeeId);
      
      try {
        // First, create the user account using signUp
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (authError) {
          console.error('Auth error:', authError);
          throw new Error(`Lỗi tạo tài khoản: ${authError.message}`);
        }

        if (!authData.user) {
          throw new Error('Không thể tạo tài khoản người dùng');
        }

        console.log('User created successfully:', authData.user.id);

        // Update employee record with auth_user_id
        const { error: updateError } = await supabase
          .from('employees')
          .update({ auth_user_id: authData.user.id })
          .eq('id', employeeId);

        if (updateError) {
          console.error('Update employee error:', updateError);
          throw new Error(`Lỗi cập nhật thông tin nhân viên: ${updateError.message}`);
        }

        return authData.user;
      } catch (error) {
        console.error('Error in createEmployeeAccount:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Thành công',
        description: 'Tạo tài khoản đăng nhập cho nhân viên thành công',
      });
    },
    onError: (error: any) => {
      console.error('Error in useCreateEmployeeAccount:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo tài khoản';
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Email này đã được đăng ký. Vui lòng sử dụng email khác.';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'Mật khẩu không đủ mạnh. Vui lòng sử dụng mật khẩu ít nhất 6 ký tự.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
}
