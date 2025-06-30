
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: 'annual' | 'sick' | 'personal' | 'emergency';
  start_date: string;
  end_date: string;
  days_count: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  employees?: {
    id: string;
    full_name: string;
    employee_code: string;
  } | null;
  approved_by_employee?: {
    id: string;
    full_name: string;
  } | null;
}

export function useLeaveRequests() {
  return useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employees:employee_id (
            id,
            full_name,
            employee_code
          ),
          approved_by_employee:approved_by (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as LeaveRequest[];
    },
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (leaveData: {
      employee_id: string;
      leave_type: 'annual' | 'sick' | 'personal' | 'emergency';
      start_date: string;
      end_date: string;
      days_count: number;
      status: 'pending';
      reason?: string;
    }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert(leaveData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast({
        title: 'Thành công',
        description: 'Gửi đơn xin nghỉ phép thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi gửi đơn xin nghỉ phép',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateLeaveRequestStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, approved_by }: { id: string; status: 'approved' | 'rejected'; approved_by: string }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({
          status,
          approved_by,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast({
        title: 'Thành công',
        description: 'Cập nhật trạng thái đơn nghỉ phép thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái',
        variant: 'destructive',
      });
    },
  });
}
