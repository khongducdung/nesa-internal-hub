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

const positionFormSchema = z.object({
  name: z.string().min(1, 'Tên vị trí là bắt buộc'),
  description: z.string().optional(),
  department_id: z.string().optional(),
  level: z.enum(['level_1', 'level_2', 'level_3']),
  status: z.enum(['active', 'inactive', 'pending']),
});

type PositionFormData = z.infer<typeof positionFormSchema>;

interface PositionFormProps {
  onClose: () => void;
  positionId?: string;
}

export function PositionForm({ onClose, positionId }: PositionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [departments, setDepartments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<PositionFormData>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      name: '',
      description: '',
      department_id: undefined,
      level: 'level_3',
      status: 'active',
    },
  });

  React.useEffect(() => {
    loadDepartments();
    if (positionId) {
      loadPositionData();
    }
  }, [positionId]);

  const loadDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .eq('status', 'active');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadPositionData = async () => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('id', positionId)
        .single();

      if (error) throw error;
      if (data) {
        const validStatus = ['active', 'inactive', 'pending'].includes(data.status || '') 
          ? (data.status as 'active' | 'inactive' | 'pending')
          : 'active';
        
        const validLevel = ['level_1', 'level_2', 'level_3'].includes(data.level || '')
          ? (data.level as 'level_1' | 'level_2' | 'level_3')
          : 'level_3';

        form.reset({
          name: data.name,
          description: data.description || '',
          department_id: data.department_id || undefined,
          level: validLevel,
          status: validStatus,
        });
      }
    } catch (error) {
      console.error('Error loading position:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin vị trí',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: PositionFormData) => {
    setIsLoading(true);
    try {
      console.log('Submitting position data:', data);
      
      const positionData = {
        name: data.name,
        description: data.description || null,
        department_id: data.department_id && data.department_id.trim() !== '' ? data.department_id : null,
        level: data.level,
        status: data.status,
      };

      if (positionId) {
        const { error } = await supabase
          .from('positions')
          .update(positionData)
          .eq('id', positionId);
        
        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Cập nhật vị trí thành công',
        });
      } else {
        const { error } = await supabase
          .from('positions')
          .insert(positionData);
        
        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Thêm vị trí mới thành công',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['positions'] });
      onClose();
    } catch (error: any) {
      console.error('Error saving position:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi lưu thông tin vị trí',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên vị trí *</FormLabel>
              <FormControl>
                <Input placeholder="Nhân viên kỹ thuật" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng ban</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Không có</SelectItem>
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
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cấp bậc</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp bậc" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="level_1">Level 1</SelectItem>
                  <SelectItem value="level_2">Level 2</SelectItem>
                  <SelectItem value="level_3">Level 3</SelectItem>
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
                <Textarea placeholder="Mô tả về vị trí..." {...field} />
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
            {isLoading ? 'Đang lưu...' : positionId ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
