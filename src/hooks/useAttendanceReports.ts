
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface AttendanceReport {
  id: string;
  name: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  date_from: string;
  date_to: string;
  filters: any;
  file_url?: string;
  generated_by: string;
  generated_at: string;
  created_at: string;
}

export interface ReportFilters {
  department_ids?: string[];
  employee_ids?: string[];
  status?: string[];
  work_shift_ids?: string[];
}

export function useAttendanceReports() {
  return useQuery({
    queryKey: ['attendance-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AttendanceReport[];
    }
  });
}

export function useAttendanceReportMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const generateReport = useMutation({
    mutationFn: async (params: {
      name: string;
      report_type: 'daily' | 'weekly' | 'monthly' | 'custom';
      date_from: string;
      date_to: string;
      filters: ReportFilters;
    }) => {
      const { data: result, error } = await supabase
        .from('attendance_reports')
        .insert([{
          ...params,
          generated_by: (await supabase.auth.getUser()).data.user?.id || '',
          filters: params.filters
        }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-reports'] });
      toast({
        title: 'Thành công',
        description: 'Đã tạo báo cáo chấm công'
      });
    },
    onError: (error) => {
      console.error('Error generating report:', error);
      toast({
        title: 'Lỗi tạo báo cáo',
        description: 'Không thể tạo báo cáo. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  });

  return { generateReport };
}
