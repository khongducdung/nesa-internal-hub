
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TrainingProgram {
  id: string;
  name: string;
  description?: string;
  trainer?: string;
  start_date: string;
  end_date: string;
  max_participants?: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface TrainingParticipant {
  id: string;
  training_id: string;
  employee_id: string;
  status: 'enrolled' | 'completed' | 'dropped';
  completion_date?: string;
  score?: number;
  certificate_url?: string;
  created_at: string;
  employees?: {
    id: string;
    full_name: string;
    employee_code: string;
  };
}

export function useTrainingPrograms() {
  return useQuery({
    queryKey: ['training-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as TrainingProgram[];
    },
  });
}

export function useTrainingParticipants(trainingId?: string) {
  return useQuery({
    queryKey: ['training-participants', trainingId],
    queryFn: async () => {
      let query = supabase
        .from('training_participants')
        .select(`
          *,
          employees:employee_id (
            id,
            full_name,
            employee_code
          )
        `);

      if (trainingId) {
        query = query.eq('training_id', trainingId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrainingParticipant[];
    },
    enabled: !!trainingId,
  });
}

export function useCreateTrainingProgram() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (trainingData: Omit<TrainingProgram, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('training_programs')
        .insert(trainingData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      toast({
        title: 'Thành công',
        description: 'Tạo chương trình đào tạo thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo chương trình đào tạo',
        variant: 'destructive',
      });
    },
  });
}
