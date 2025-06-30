
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Process {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
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
      return data || [];
    },
  });
};
