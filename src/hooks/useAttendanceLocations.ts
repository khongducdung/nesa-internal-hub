
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceLocation {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useAttendanceLocations() {
  return useQuery({
    queryKey: ['attendance-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_locations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as AttendanceLocation[];
    },
  });
}

export function useCreateAttendanceLocation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (locationData: Omit<AttendanceLocation, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('attendance_locations')
        .insert(locationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-locations'] });
      toast({
        title: 'Thành công',
        description: 'Tạo địa điểm chấm công mới thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo địa điểm chấm công',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateAttendanceLocation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AttendanceLocation> }) => {
      const { data: result, error } = await supabase
        .from('attendance_locations')
        .update(data)
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
        description: 'Cập nhật địa điểm chấm công thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật địa điểm chấm công',
        variant: 'destructive',
      });
    },
  });
}
