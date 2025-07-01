
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ShiftAssignment {
  id: string;
  work_shift_id: string;
  employee_id?: string;
  department_id?: string;
  position_id?: string;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  work_shifts?: {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
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
}

export function useShiftAssignments() {
  return useQuery({
    queryKey: ['shift-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shift_assignments')
        .select(`
          *,
          work_shifts:work_shift_id(id, name, start_time, end_time),
          employees:employee_id(id, full_name, employee_code),
          departments:department_id(id, name),
          positions:position_id(id, name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShiftAssignment[];
    }
  });
}
