
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  break_time: number;
  overtime_hours: number;
  status: string;
  notes?: string;
  is_late: boolean;
  is_early_leave: boolean;
  late_minutes: number;
  early_leave_minutes: number;
  total_work_hours: number;
  is_approved: boolean;
  approval_required: boolean;
  created_at: string;
  updated_at: string;
}

export function useAttendance(employeeId?: string, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['attendance', employeeId, dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      if (dateFrom) {
        query = query.gte('date', dateFrom);
      }

      if (dateTo) {
        query = query.lte('date', dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AttendanceRecord[];
    }
  });
}

export function useAttendanceMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const checkIn = useMutation({
    mutationFn: async (data: {
      employee_id: string;
      date: string;
      check_in_time: string;
      check_in_latitude?: number;
      check_in_longitude?: number;
    }) => {
      const { data: result, error } = await supabase
        .from('attendance')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Check-in thành công',
        description: 'Đã ghi nhận thời gian vào làm'
      });
    },
    onError: (error) => {
      console.error('Error checking in:', error);
      toast({
        title: 'Lỗi check-in',
        description: 'Không thể check-in. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  const checkOut = useMutation({
    mutationFn: async (data: {
      id: string;
      check_out_time: string;
      check_out_latitude?: number;
      check_out_longitude?: number;
    }) => {
      const { data: result, error } = await supabase
        .from('attendance')
        .update({
          check_out_time: data.check_out_time,
          check_out_latitude: data.check_out_latitude,
          check_out_longitude: data.check_out_longitude,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Check-out thành công',
        description: 'Đã ghi nhận thời gian ra về'
      });
    },
    onError: (error) => {
      console.error('Error checking out:', error);
      toast({
        title: 'Lỗi check-out',
        description: 'Không thể check-out. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  return {
    checkIn,
    checkOut
  };
}
