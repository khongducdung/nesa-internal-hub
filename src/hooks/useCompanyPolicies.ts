
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanyPolicy {
  id: string;
  title: string;
  content: string;
  category: string;
  effective_date: string;
  expiry_date?: string;
  status: 'active' | 'inactive' | 'draft';
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export const useCompanyPolicies = () => {
  return useQuery({
    queryKey: ['company-policies'],
    queryFn: async (): Promise<CompanyPolicy[]> => {
      console.log('Fetching company policies...');
      
      const { data, error } = await supabase
        .from('company_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching company policies:', error);
        throw error;
      }

      console.log('Company policies fetched successfully:', data);
      return (data || []) as CompanyPolicy[];
    },
  });
};

export const useCreateCompanyPolicy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (policyData: Omit<CompanyPolicy, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('company_policies')
        .insert({
          ...policyData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-policies'] });
      toast({
        title: 'Thành công',
        description: 'Quy định công ty đã được tạo thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo quy định',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCompanyPolicy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...policyData }: Partial<CompanyPolicy> & { id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('company_policies')
        .update({
          ...policyData,
          updated_by: user.id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-policies'] });
      toast({
        title: 'Thành công',
        description: 'Quy định công ty đã được cập nhật thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật quy định',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCompanyPolicy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_policies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-policies'] });
      toast({
        title: 'Thành công',
        description: 'Quy định công ty đã được xóa thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa quy định',
        variant: 'destructive',
      });
    },
  });
};
