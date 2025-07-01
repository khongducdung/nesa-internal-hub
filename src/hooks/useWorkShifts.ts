import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WorkSession {
  name: string;
  start_time: string;
  end_time: string;
}

export interface WorkShift {
  id: string;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  days_of_week: number[];
  shift_type?: 'fulltime' | 'parttime' | 'flexible';
  min_hours_per_day?: number;
  max_hours_per_day?: number;
  color?: string;
  attendance_setting_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // New fields
  work_sessions?: WorkSession[];
  saturday_work_type?: 'off' | 'full' | 'half_morning' | 'half_afternoon';
  saturday_work_sessions?: WorkSession[];
  total_work_coefficient?: number;
}

export function useWorkShifts() {
  return useQuery({
    queryKey: ['work-shifts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_shifts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WorkShift[];
    }
  });
}

export function useWorkShift(id: string) {
  return useQuery({
    queryKey: ['work-shift', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_shifts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as WorkShift;
    },
    enabled: !!id
  });
}
