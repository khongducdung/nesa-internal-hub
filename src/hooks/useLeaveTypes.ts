
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  is_paid: boolean;
  max_days_per_year: number;
  requires_approval: boolean;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function useLeaveTypes() {
  return useQuery({
    queryKey: ['leave-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LeaveType[];
    }
  });
}

export function useLeaveTypeMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createLeaveType = useMutation({
    mutationFn: async (data: Omit<LeaveType, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('leave_types')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      toast({
        title: 'Thành công',
        description: 'Đã tạo loại nghỉ phép mới'
      });
    },
    onError: (error) => {
      console.error('Error creating leave type:', error);
      toast({
        title: 'Lỗi tạo loại nghỉ',
        description: 'Không thể tạo loại nghỉ phép. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  const updateLeaveType = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LeaveType> }) => {
      const { data: result, error } = await supabase
        .from('leave_types')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật loại nghỉ phép'
      });
    },
    onError: (error) => {
      console.error('Error updating leave type:', error);
      toast({
        title: 'Lỗi cập nhật',
        description: 'Không thể cập nhật loại nghỉ phép. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  const deleteLeaveType = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leave_types')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      toast({
        title: 'Thành công',
        description: 'Đã xóa loại nghỉ phép'
      });
    },
    onError: (error) => {
      console.error('Error deleting leave type:', error);
      toast({
        title: 'Lỗi xóa',
        description: 'Không thể xóa loại nghỉ phép. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  return {
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
  };
}
