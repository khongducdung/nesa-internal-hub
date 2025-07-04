import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['process-templates', user?.id],
    queryFn: async () => {
      // Lấy thông tin nhân viên hiện tại
      const { data: currentEmployee, error: employeeError } = await supabase
        .from('employees')
        .select('id, department_id, position_id')
        .eq('auth_user_id', user?.id)
        .single();

      if (employeeError && employeeError.code !== 'PGRST116') {
        console.error('Error fetching current employee:', employeeError);
      }

      // Lấy tất cả tài liệu published và active
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
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Lọc tài liệu theo 3 tiêu chí:
      const filteredData = data?.filter(template => {
        // Tiêu chí 1: Người dùng là người tạo tài liệu
        if (template.created_by === user?.id) {
          return true;
        }

        // Chỉ áp dụng các tiêu chí khác nếu có thông tin nhân viên
        if (!currentEmployee) {
          return false;
        }

        // Tiêu chí 2: Tài liệu áp dụng cho tất cả
        if (template.target_type === 'general' || !template.target_type) {
          return true;
        }

        // Tiêu chí 3: Tài liệu áp dụng cho phòng ban của người dùng
        if (template.target_type === 'department' && 
            template.target_ids && 
            currentEmployee.department_id &&
            template.target_ids.includes(currentEmployee.department_id)) {
          return true;
        }

        // Tiêu chí 4: Tài liệu áp dụng cho vị trí của người dùng
        if (template.target_type === 'position' && 
            template.target_ids && 
            currentEmployee.position_id &&
            template.target_ids.includes(currentEmployee.position_id)) {
          return true;
        }

        // Tiêu chí 5: Tài liệu áp dụng trực tiếp cho người dùng
        if (template.target_type === 'employee' && 
            template.target_ids && 
            template.target_ids.includes(currentEmployee.id)) {
          return true;
        }

        return false;
      }) || [];

      return filteredData as ProcessTemplateWithDetails[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateProcessTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newTemplate: Omit<ProcessTemplate, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      // Kiểm tra user đã đăng nhập chưa
      if (!user) {
        throw new Error('Bạn cần đăng nhập để thực hiện chức năng này');
      }

      // Validate dữ liệu đầu vào
      if (!newTemplate.name || newTemplate.name.trim() === '') {
        throw new Error('Tiêu đề tài liệu không được để trống');
      }

      if (!newTemplate.category_id) {
        throw new Error('Vui lòng chọn danh mục cho tài liệu');
      }

      if (!newTemplate.content || newTemplate.content.trim() === '') {
        throw new Error('Nội dung hướng dẫn không được để trống');
      }

      // Lấy thông tin category để có category name
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

      // Chuẩn bị dữ liệu để insert
      const templateData = {
        ...newTemplate,
        category: categoryData.name,
        created_by: user.id, // Sử dụng user.id thay vì UUID cố định
        is_active: true,
        version: 1
      };

      console.log('Creating template with data:', templateData);

      const { data, error } = await supabase
        .from('process_templates')
        .insert([templateData])
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProcessTemplate> & { id: string }) => {
      // Kiểm tra user đã đăng nhập chưa
      if (!user) {
        throw new Error('Bạn cần đăng nhập để thực hiện chức năng này');
      }

      // Validate dữ liệu đầu vào
      if (updates.name !== undefined && (!updates.name || updates.name.trim() === '')) {
        throw new Error('Tiêu đề tài liệu không được để trống');
      }

      if (updates.content !== undefined && (!updates.content || updates.content.trim() === '')) {
        throw new Error('Nội dung hướng dẫn không được để trống');
      }

      let updatesWithCategory = { ...updates };
      
      // Nếu có cập nhật category_id, lấy category name
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

      console.log('Updating template with data:', updatesWithCategory);

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
