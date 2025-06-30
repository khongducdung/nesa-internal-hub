
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
      // Get category name from category_id
      const { data: categoryData, error: categoryError } = await supabase
        .from('process_categories')
        .select('name')
        .eq('id', newTemplate.category_id)
        .single();

      if (categoryError) {
        throw new Error(`Không thể tìm thấy danh mục: ${categoryError.message}`);
      }

      if (!categoryData) {
        throw new Error('Danh mục không tồn tại');
      }

      // Add the category name to the template
      const templateWithCategory = {
        ...newTemplate,
        category: categoryData.name
      };

      const { data, error } = await supabase
        .from('process_templates')
        .insert([templateWithCategory])
        .select()
        .single();
      
      if (error) {
        console.error('Database error:', error);
        throw new Error(`Lỗi cơ sở dữ liệu: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-templates'] });
      toast({
        title: "Thành công",
        description: "Tài liệu hướng dẫn đã được tạo thành công",
      });
    },
    onError: (error: Error) => {
      console.error('Create template error:', error);
      toast({
        title: "Lỗi tạo tài liệu",
        description: error.message || "Không thể tạo tài liệu hướng dẫn. Vui lòng thử lại.",
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
      // If category_id is being updated, get the category name
      let updatesWithCategory = { ...updates };
      if (updates.category_id) {
        const { data: categoryData, error: categoryError } = await supabase
          .from('process_categories')
          .select('name')
          .eq('id', updates.category_id)
          .single();

        if (categoryError) {
          throw new Error(`Không thể tìm thấy danh mục: ${categoryError.message}`);
        }

        if (!categoryData) {
          throw new Error('Danh mục không tồn tại');
        }

        updatesWithCategory.category = categoryData.name;
      }

      const { data, error } = await supabase
        .from('process_templates')
        .update(updatesWithCategory)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Database error:', error);
        throw new Error(`Lỗi cơ sở dữ liệu: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-templates'] });
      toast({
        title: "Thành công",
        description: "Tài liệu hướng dẫn đã được cập nhật thành công",
      });
    },
    onError: (error: Error) => {
      console.error('Update template error:', error);
      toast({
        title: "Lỗi cập nhật tài liệu",
        description: error.message || "Không thể cập nhật tài liệu hướng dẫn. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });
};
