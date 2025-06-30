
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AttendanceWithDetails } from '@/types/database';

export const useAttendance = (date?: string) => {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['attendance', targetDate],
    queryFn: async (): Promise<AttendanceWithDetails[]> => {
      console.log('Fetching attendance for date:', targetDate);
      
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          employees!inner (
            id,
            full_name,
            employee_code
          )
        `)
        .eq('date', targetDate)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attendance:', error);
        throw error;
      }

      console.log('Attendance fetched successfully:', data);
      return data || [];
    },
  });
};
