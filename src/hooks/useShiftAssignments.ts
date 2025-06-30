
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useShiftAssignments = () => {
  return useQuery({
    queryKey: ['shift-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shift_assignments')
        .select(`
          *,
          work_shifts (*),
          employees (
            id,
            full_name,
            employee_code
          ),
          departments (
            id,
            name
          ),
          positions (
            id,
            name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shift assignments:', error);
        throw error;
      }

      return data || [];
    },
  });
};
