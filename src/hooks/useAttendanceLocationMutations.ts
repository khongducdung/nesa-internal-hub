
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateLocationData {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
}

export function useAttendanceLocationMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createLocation = useMutation({
    mutationFn: async (data: CreateLocationData) => {
      const { data: result, error } = await supabase
        .from('attendance_locations')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-locations'] });
      toast({
        title: 'Thành công',
        description: 'Đã tạo địa điểm chấm công mới'
      });
    },
    onError: (error) => {
      console.error('Error creating location:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo địa điểm chấm công',
        variant: 'destructive'
      });
    }
  });

  const updateLocation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateLocationData> }) => {
      const { data: result, error } = await supabase
        .from('attendance_locations')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-locations'] });
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật địa điểm chấm công'
      });
    }
  });

  const deleteLocation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attendance_locations')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-locations'] });
      toast({
        title: 'Thành công',
        description: 'Đã xóa địa điểm chấm công'
      });
    }
  });

  return {
    createLocation,
    updateLocation,
    deleteLocation
  };
}
