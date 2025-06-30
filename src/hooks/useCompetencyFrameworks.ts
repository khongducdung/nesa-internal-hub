
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCompetencyFrameworks() {
  return useQuery({
    queryKey: ['competency-frameworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competency_frameworks')
        .select(`
          *,
          positions (
            id,
            name,
            department_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCompetencyFramework(id: string) {
  return useQuery({
    queryKey: ['competency-framework', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competency_frameworks')
        .select(`
          *,
          positions (
            id,
            name,
            department_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
