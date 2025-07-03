import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_shared: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'active' | 'archived';
  created_by: string;
  employee_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIdeaData {
  title: string;
  content: string;
  tags?: string[];
  is_shared?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export function useIdeas() {
  return useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .or('created_by.eq.' + (await supabase.auth.getUser()).data.user?.id + ',is_shared.eq.true')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Idea[];
    }
  });
}

export function useMyIdeas() {
  return useQuery({
    queryKey: ['my-ideas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('created_by', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Idea[];
    }
  });
}

export function useSharedIdeas() {
  return useQuery({
    queryKey: ['shared-ideas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('is_shared', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Idea[];
    }
  });
}

export function useCreateIdea() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ideaData: CreateIdeaData) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('ideas')
        .insert({
          ...ideaData,
          created_by: user.data.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['my-ideas'] });
      toast({
        title: "Thành công",
        description: "Đã lưu ý tưởng mới",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể lưu ý tưởng",
        variant: "destructive",
      });
    }
  });
}

export function useUpdateIdea() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateIdeaData> }) => {
      const { data: result, error } = await supabase
        .from('ideas')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['my-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['shared-ideas'] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật ý tưởng",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật ý tưởng",
        variant: "destructive",
      });
    }
  });
}

export function useDeleteIdea() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['my-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['shared-ideas'] });
      toast({
        title: "Thành công",
        description: "Đã xóa ý tưởng",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa ý tưởng",
        variant: "destructive",
      });
    }
  });
}