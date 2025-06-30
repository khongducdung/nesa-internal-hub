
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const departmentFormSchema = z.object({
  name: z.string().min(1, 'Tên phòng ban là bắt buộc'),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
});

type DepartmentFormData = z.infer<typeof departmentFormSchema>;

interface DepartmentFormProps {
  onClose: () => void;
  departmentId?: string;
}

export function DepartmentForm({ onClose, departmentId }: DepartmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [departments, setDepartments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      status: 'active',
    },
  });

  React.useEffect(() => {
    loadDepartments();
    if (departmentId) {
      loadDepartmentData();
    }
  }, [departmentId]);

  const loadDepartments = async () => {
    try {
      const query = supabase
        .from('departments')
        .select('id, name')
        .eq('status', 'active');
      
      // Only exclude current department if departmentId exists and is not empty
      if (departmentId && departmentId.trim() !== '') {
        query.neq('id', departmentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadDepartmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('id', departmentId)
        .single();

      if (error) throw error;
      if (data) {
        // Type-safe status handling
        const validStatus = ['active', 'inactive', 'pending'].includes(data.status || '') 
          ? (data.status as 'active' | 'inactive' | 'pending')
          : 'active';

        form.reset({
          name: data.name,
          description: data.description || '',
          parent_id: data.parent_id || '',
          status: validStatus,
        });
      }
    } catch (error) {
      console.error('Error loading department:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin phòng ban',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: DepartmentFormData) => {
    setIsLoading(true);
    try {
      console.log('Submitting department data:', data);
      
      const departmentData = {
        name: data.name,
        description: data.description || null,
        parent_id: data.parent_id && data.parent_id.trim() !== '' ? data.parent_id : null,
        status: data.status,
      };

      if (departmentId) {
        const { error } = await supabase
          .from('departments')
          .update(departmentData)
          .eq('id', departmentId);
        
        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Cập nhật phòng ban thành công',
        });
      } else {
        const { error } = await supabase
          .from('departments')
          .insert(departmentData);
        
        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Thêm phòng ban mới thành công',
        });
      }

      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department-stats'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      onClose();
    } catch (error: any) {
      console.error('Error saving department:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi lưu thông tin phòng ban',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên phòng ban *</FormLabel>
              <FormControl>
                <Input placeholder="Phòng Kỹ thuật" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng ban cấp trên</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban cấp trên (nếu có)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Không có</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả về phòng ban..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : departmentId ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
