
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
    queryFn: async (): Promise<LeaveRequest[]> => {
      // Get leave requests
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (leaveError) throw leaveError;

      // Get employee data
      const { data: employeeData } = await supabase
        .from('employees')
        .select('id, full_name, employee_code');

      // Combine the data with proper type casting
      const enrichedLeaveRequests: LeaveRequest[] = (leaveData || []).map(request => ({
        ...request,
        leave_type: request.leave_type as 'annual' | 'sick' | 'personal' | 'emergency',
        status: request.status as 'pending' | 'approved' | 'rejected',
        employees: employeeData?.find(emp => emp.id === request.employee_id) || null,
        approved_by_employee: request.approved_by 
          ? employeeData?.find(emp => emp.id === request.approved_by) || null
          : null,
      }));

      return enrichedLeaveRequests;
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
