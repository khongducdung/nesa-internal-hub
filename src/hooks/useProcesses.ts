
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

// Use the actual database type for processes table
type ProcessRow = Database['public']['Tables']['processes']['Row'];
type ProcessInsert = Database['public']['Tables']['processes']['Insert'];
type ProcessUpdate = Database['public']['Tables']['processes']['Update'];

// Extended type for queries with joined data
export interface ProcessWithDetails extends ProcessRow {
  created_by_user?: {
    id: string;
    full_name: string;
  } | null;
}

export const useProcesses = () => {
  return useQuery({
    queryKey: ['processes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processes')
        .select(`
          *,
          created_by_user:profiles!created_by(id, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as ProcessWithDetails[];
    }
  });
};

export const useCreateProcess = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (processData: {
      name: string;
      description?: string;
      assigned_user_id?: string;
      department_id?: string;
      position_id?: string;
      status?: 'active' | 'inactive' | 'pending';
      steps?: any;
    }) => {
      const { data, error } = await supabase
        .from('processes')
        .insert([{
          ...processData,
          created_by: (await supabase.auth.getUser()).data.user?.id || ''
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      toast({
        title: 'Thành công',
        description: 'Quy trình đã được tạo thành công'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo quy trình',
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateProcess = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...processData }: Partial<ProcessUpdate> & { id: string }) => {
      const { data, error } = await supabase
        .from('processes')
        .update(processData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      toast({
        title: 'Thành công',
        description: 'Quy trình đã được cập nhật thành công'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật quy trình',
        variant: 'destructive'
      });
    }
  });
};

export const useDeleteProcess = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('processes')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      toast({
        title: 'Thành công',
        description: 'Quy trình đã được xóa thành công'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa quy trình',
        variant: 'destructive'
      });
    }
  });
};

// Export the types for use in other components
export type { ProcessRow as Process, ProcessWithDetails };
