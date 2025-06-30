
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProcessTemplate {
  id: string;
  name: string;
  description?: string;
  content?: string;
  steps: any;
  category: string;
  category_id?: string;
  target_type?: 'employee' | 'department' | 'position' | 'general';
  target_ids?: string[];
  attachments?: any[];
  external_links?: any[];
  tags?: string[];
  version?: number;
  status?: 'draft' | 'published' | 'archived';
  priority?: string;
  estimated_duration?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by: string;
}

export interface ProcessTemplateWithDetails extends ProcessTemplate {
  process_categories?: {
    id: string;
    name: string;
    color?: string;
  } | null;
}

export const useProcessTemplates = () => {
  return useQuery({
    queryKey: ['process-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_templates')
        .select(`
          *,
          process_categories (
            id,
            name,
            color
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ProcessTemplateWithDetails[];
    },
  });
};

export const useCreateProcessTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newTemplate: Omit<ProcessTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('process_templates')
        .insert([newTemplate])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-templates'] });
      toast({
        title: "Thành công",
        description: "Mẫu quy trình đã được tạo",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo mẫu quy trình",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProcessTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProcessTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('process_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-templates'] });
      toast({
        title: "Thành công",
        description: "Mẫu quy trình đã được cập nhật",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật mẫu quy trình",
        variant: "destructive",
      });
    },
  });
};
