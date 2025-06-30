
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CompanyPolicy {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  effective_date: string;
  expiry_date?: string;
  target_type: 'general' | 'department' | 'position' | 'employee';
  target_ids: string[];
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (policyData: Omit<CompanyPolicy, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => {
      if (!user) {
        throw new Error('Bạn cần đăng nhập để thực hiện chức năng này');
      }

      const { data, error } = await supabase
        .from('company_policies')
        .insert({
          ...policyData,
          created_by: user.id,
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

export function useUpdateCompanyPolicy() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...policyData }: Partial<CompanyPolicy> & { id: string }) => {
      if (!user) {
        throw new Error('Bạn cần đăng nhập để thực hiện chức năng này');
      }

      const { data, error } = await supabase
        .from('company_policies')
        .update({
          ...policyData,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_policies'] });
      toast({
        title: 'Thành công',
        description: 'Cập nhật quy định công ty thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật quy định công ty',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCompanyPolicy() {
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
      queryClient.invalidateQueries({ queryKey: ['company_policies'] });
      toast({
        title: 'Thành công',
        description: 'Xóa quy định công ty thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa quy định công ty',
        variant: 'destructive',
      });
    },
  });
}
