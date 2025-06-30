
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useDepartments } from '@/hooks/useDepartments';
import { useCreatePosition } from '@/hooks/usePositions';

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
}

export function PositionForm({ onClose }: PositionFormProps) {
  const { data: departments } = useDepartments();
  const createPosition = useCreatePosition();

  const form = useForm<PositionFormData>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      level: 'level_3',
      status: 'active',
    },
  });

  const onSubmit = async (data: PositionFormData) => {
    const positionData = {
      ...data,
      department_id: data.department_id || undefined,
      description: data.description || undefined,
    };

    await createPosition.mutateAsync(positionData);
    onClose();
  };

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
                <Input placeholder="Nhập tên vị trí" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Không có</SelectItem>
                  {departments?.map((dept) => (
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
              <FormLabel>Cấp độ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="level_1">Cấp 1 (Lãnh đạo)</SelectItem>
                  <SelectItem value="level_2">Cấp 2 (Quản lý)</SelectItem>
                  <SelectItem value="level_3">Cấp 3 (Nhân viên)</SelectItem>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Textarea placeholder="Mô tả về vị trí công việc..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={createPosition.isPending}>
            {createPosition.isPending ? 'Đang lưu...' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
