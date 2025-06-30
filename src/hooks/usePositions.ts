
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Position {
  id: string;
  name: string;
  description?: string;
  department_id?: string;
  level: 'level_1' | 'level_2' | 'level_3';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
  departments?: {
    id: string;
    name: string;
  };
}

export function usePositions() {
  return useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select(`
          *,
          departments:department_id (
            id,
            name
          )
        `)
        .order('name');

      if (error) throw error;
      return data as Position[];
    },
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (positionData: Omit<Position, 'id' | 'created_at' | 'updated_at' | 'departments'>) => {
      console.log('Creating position with data:', positionData);
      
      // Xử lý department_id - nếu là "no_department" thì set thành null
      const departmentId = positionData.department_id === 'no_department' || !positionData.department_id 
        ? null 
        : positionData.department_id;

      const { data, error } = await supabase
        .from('positions')
        .insert({
          name: positionData.name,
          description: positionData.description || null,
          department_id: departmentId,
          level: positionData.level,
          status: positionData.status,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({
        title: 'Thành công',
        description: 'Thêm vị trí công việc mới thành công',
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi thêm vị trí công việc',
        variant: 'destructive',
      });
    },
  });
}
