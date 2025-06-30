
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanyPolicy {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  effective_date: string;
  expiry_date?: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export function useCompanyPolicies() {
  return useQuery({
    queryKey: ['company_policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CompanyPolicy[];
    },
  });
}

export function useCreateCompanyPolicy() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (policyData: Omit<CompanyPolicy, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => {
      const { data, error } = await supabase
        .from('company_policies')
        .insert({
          ...policyData,
          created_by: 'current_user_id', // Sẽ được thay thế bằng ID người dùng hiện tại
          status: policyData.status || 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_policies'] });
      toast({
        title: 'Thành công',
        description: 'Thêm quy định công ty mới thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi thêm quy định công ty',
        variant: 'destructive',
      });
    },
  });
}
