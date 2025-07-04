
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Process {
  id: string;
  name: string;
  description: string | null;
  content: string | null;
  status: 'draft' | 'active' | 'inactive';
  target_type: 'employee' | 'department' | 'position' | 'general';
  target_ids: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  created_by_user?: {
    id: string;
    full_name: string;
  };
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
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Process[];
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
      content?: string;
      status?: 'draft' | 'active' | 'inactive';
      target_type?: 'employee' | 'department' | 'position' | 'general';
      target_ids?: string[];
    }) => {
      const { data, error } = await supabase
        .from('processes')
        .insert([{
          ...processData,
          created_by: (await supabase.auth.getUser()).data.user?.id
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
    mutationFn: async ({ id, ...processData }: Partial<Process> & { id: string }) => {
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
        .update({ is_active: false })
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
