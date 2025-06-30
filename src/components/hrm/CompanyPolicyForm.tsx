
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateCompanyPolicy } from '@/hooks/useCompanyPolicies';

const companyPolicyFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  category: z.string().min(1, 'Danh mục là bắt buộc'),
  status: z.enum(['active', 'inactive', 'draft']),
  effective_date: z.string().min(1, 'Ngày hiệu lực là bắt buộc'),
  expiry_date: z.string().optional(),
});

type CompanyPolicyFormData = z.infer<typeof companyPolicyFormSchema>;

interface CompanyPolicyFormProps {
  onClose: () => void;
}

export function CompanyPolicyForm({ onClose }: CompanyPolicyFormProps) {
  const createPolicy = useCreateCompanyPolicy();

  const form = useForm<CompanyPolicyFormData>({
    resolver: zodResolver(companyPolicyFormSchema),
    defaultValues: {
      status: 'draft',
    },
  });

  const onSubmit = async (data: CompanyPolicyFormData) => {
    const policyData = {
      title: data.title,
      content: data.content,
      category: data.category,
      status: data.status,
      effective_date: data.effective_date,
      expiry_date: data.expiry_date || undefined,
    };

    await createPolicy.mutateAsync(policyData);
    onClose();
  };

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
                <Input placeholder="Nhập tiêu đề quy định" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hr">Nhân sự</SelectItem>
                  <SelectItem value="finance">Tài chính</SelectItem>
                  <SelectItem value="it">Công nghệ thông tin</SelectItem>
                  <SelectItem value="safety">An toàn lao động</SelectItem>
                  <SelectItem value="general">Quy định chung</SelectItem>
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
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="active">Hiệu lực</SelectItem>
                  <SelectItem value="inactive">Ngưng hiệu lực</SelectItem>
                </SelectContent>
              </Select>
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập nội dung quy định..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={createPolicy.isPending}>
            {createPolicy.isPending ? 'Đang lưu...' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
