
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Position } from '@/hooks/usePositions';

export function useUpdatePosition() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Position> }) => {
      const { error } = await supabase
        .from('positions')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({
        title: 'Thành công',
        description: 'Cập nhật vị trí thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật vị trí',
        variant: 'destructive',
      });
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({
        title: 'Thành công',
        description: 'Xóa vị trí thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa vị trí',
        variant: 'destructive',
      });
    },
  });
}
