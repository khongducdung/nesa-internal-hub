
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Attendance } from '@/types/database';

export const useAttendance = (date?: string) => {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['attendance', targetDate],
    queryFn: async (): Promise<(Attendance & { employee_name: string })[]> => {
      console.log('Fetching attendance for date:', targetDate);
      
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          employees!inner (
            full_name
          )
        `)
        .eq('date', targetDate)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attendance:', error);
        throw error;
      }

      const attendanceWithNames = data?.map(record => ({
        ...record,
        employee_name: (record as any).employees?.full_name || 'Unknown'
      })) || [];

      console.log('Attendance fetched successfully:', attendanceWithNames);
      return attendanceWithNames;
    },
  });
};
