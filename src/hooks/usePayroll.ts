
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PayrollPeriod, PayrollDetail, SalaryConfig } from '@/types/payroll';
import { useToast } from '@/hooks/use-toast';

export const usePayrollPeriods = () => {
  return useQuery({
    queryKey: ['payroll-periods'],
    queryFn: async (): Promise<PayrollPeriod[]> => {
      const { data, error } = await supabase
        .from('payroll_periods')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const usePayrollDetails = (periodId?: string) => {
  return useQuery({
    queryKey: ['payroll-details', periodId],
    queryFn: async (): Promise<PayrollDetail[]> => {
      if (!periodId) return [];
      
      const { data, error } = await supabase
        .from('payroll_details')
        .select(`
          *,
          employees!inner (
            full_name,
            employee_code,
            departments (name),
            positions (name)
          )
        `)
        .eq('payroll_period_id', periodId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(item => ({
        ...item,
        employee: {
          full_name: (item as any).employees?.full_name || '',
          employee_code: (item as any).employees?.employee_code || '',
          department: (item as any).employees?.departments,
          position: (item as any).employees?.positions,
        }
      })) || [];
    },
    enabled: !!periodId,
  });
};

export const useSalaryConfigs = () => {
  return useQuery({
    queryKey: ['salary-configs'],
    queryFn: async (): Promise<SalaryConfig[]> => {
      const { data, error } = await supabase
        .from('salary_configs')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreatePayrollPeriod = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PayrollPeriod>) => {
      const { data: result, error } = await supabase
        .from('payroll_periods')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] });
      toast({
        title: 'Thành công',
        description: 'Tạo kỳ tính lương thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo kỳ tính lương',
        variant: 'destructive',
      });
    },
  });
};

export const useGeneratePayroll = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ periodId, configId }: { periodId: string; configId: string }) => {
      // Gọi edge function để tính lương
      const { data, error } = await supabase.functions.invoke('generate-payroll', {
        body: { periodId, configId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-details'] });
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] });
      toast({
        title: 'Thành công',
        description: 'Tính lương thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tính lương',
        variant: 'destructive',
      });
    },
  });
};
