
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateCompanyPolicy, useUpdateCompanyPolicy, CompanyPolicy } from '@/hooks/useCompanyPolicies';

const policyFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  category: z.string().min(1, 'Danh mục là bắt buộc'),
  effective_date: z.string().min(1, 'Ngày hiệu lực là bắt buộc'),
  expiry_date: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']),
});

type PolicyFormData = z.infer<typeof policyFormSchema>;

interface CompanyPolicyFormProps {
  onClose: () => void;
  policy?: CompanyPolicy;
}

export function CompanyPolicyForm({ onClose, policy }: CompanyPolicyFormProps) {
  const createMutation = useCreateCompanyPolicy();
  const updateMutation = useUpdateCompanyPolicy();

  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      title: policy?.title || '',
      content: policy?.content || '',
      category: policy?.category || '',
      effective_date: policy?.effective_date || new Date().toISOString().split('T')[0],
      expiry_date: policy?.expiry_date || '',
      status: policy?.status || 'active',
    },
  });

  const onSubmit = async (data: PolicyFormData) => {
    try {
      const submitData = {
        title: data.title,
        content: data.content,
        category: data.category,
        effective_date: data.effective_date,
        expiry_date: data.expiry_date || undefined,
        status: data.status,
      };

      if (policy) {
        await updateMutation.mutateAsync({
          id: policy.id,
          ...submitData,
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề *</FormLabel>
              <FormControl>
                <Input placeholder="Quy định về giờ làm việc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="work_hours">Giờ làm việc</SelectItem>
                  <SelectItem value="leave_policy">Chính sách nghỉ phép</SelectItem>
                  <SelectItem value="conduct">Quy tắc ứng xử</SelectItem>
                  <SelectItem value="safety">An toàn lao động</SelectItem>
                  <SelectItem value="benefits">Phúc lợi</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nội dung chi tiết của quy định..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="effective_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày hiệu lực *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày hết hạn</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : policy ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
