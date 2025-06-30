
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Process {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  created_by: string;
  steps?: any;
  assigned_user_id?: string;
  position_id?: string;
  department_id?: string;
}

export const useProcesses = () => {
  return useQuery({
    queryKey: ['processes'],
    queryFn: async (): Promise<Process[]> => {
      console.log('Fetching processes...');
      
      const { data, error } = await supabase
        .from('processes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching processes:', error);
        throw error;
      }

      console.log('Processes fetched successfully:', data);
      // Filter out any processes with 'pending' status since our interface doesn't support it
      const filteredData = (data || []).filter(process => 
        process.status === 'active' || process.status === 'inactive'
      );
      
      return filteredData as Process[];
    },
  });
};
