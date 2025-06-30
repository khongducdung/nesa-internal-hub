
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProcessCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by: string;
}

export const useProcessCategories = () => {
  return useQuery({
    queryKey: ['process-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as ProcessCategory[];
    },
  });
};

export const useCreateProcessCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newCategory: Omit<ProcessCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('process_categories')
        .insert([newCategory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-categories'] });
      toast({
        title: "Thành công",
        description: "Danh mục quy trình đã được tạo",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo danh mục quy trình",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProcessCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProcessCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('process_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-categories'] });
      toast({
        title: "Thành công",
        description: "Danh mục quy trình đã được cập nhật",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật danh mục quy trình",
        variant: "destructive",
      });
    },
  });
};
