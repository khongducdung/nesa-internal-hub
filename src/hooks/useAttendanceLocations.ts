
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AttendanceLocation[];
    }
  });
}
