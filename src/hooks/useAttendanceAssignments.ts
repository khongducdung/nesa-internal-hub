
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceAssignment {
  id: string;
  attendance_setting_id: string;
  employee_id?: string;
  department_id?: string;
  position_id?: string;
  work_shift_id?: string;
  location_id?: string;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  attendance_settings?: {
    id: string;
    name: string;
  };
  employees?: {
    id: string;
    full_name: string;
    employee_code: string;
  };
  departments?: {
    id: string;
    name: string;
  };
  positions?: {
    id: string;
    name: string;
  };
  work_shifts?: {
    id: string;
    name: string;
  };
  attendance_locations?: {
    id: string;
    name: string;
  };
}

export function useAttendanceAssignments() {
  return useQuery({
    queryKey: ['attendance-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_assignments')
        .select(`
          *,
          attendance_settings:attendance_setting_id (id, name),
          employees:employee_id (id, full_name, employee_code),
          departments:department_id (id, name),
          positions:position_id (id, name),
          work_shifts:work_shift_id (id, name),
          attendance_locations:location_id (id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AttendanceAssignment[];
    },
  });
}

export function useCreateAttendanceAssignment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignmentData: Omit<AttendanceAssignment, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'attendance_settings' | 'employees' | 'departments' | 'positions' | 'work_shifts' | 'attendance_locations'>) => {
      const { data, error } = await supabase
        .from('attendance_assignments')
        .insert({
          ...assignmentData,
          created_by: '00000000-0000-0000-0000-000000000000' // Tạm thời
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-assignments'] });
      toast({
        title: 'Thành công',
        description: 'Tạo phân công chấm công mới thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo phân công chấm công',
        variant: 'destructive',
      });
    },
  });
}
