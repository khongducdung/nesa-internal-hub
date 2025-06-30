
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PayrollPeriod } from '@/types/payroll';

const payrollPeriodSchema = z.object({
  name: z.string().min(1, 'Tên kỳ tính lương là bắt buộc'),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2050),
  start_date: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  end_date: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
});

type PayrollPeriodFormData = z.infer<typeof payrollPeriodSchema>;

interface PayrollPeriodFormProps {
  onSubmit: (data: Partial<PayrollPeriod>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function PayrollPeriodForm({ onSubmit, onClose, isLoading }: PayrollPeriodFormProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const form = useForm<PayrollPeriodFormData>({
    resolver: zodResolver(payrollPeriodSchema),
    defaultValues: {
      name: `Tính lương tháng ${currentMonth}/${currentYear}`,
      month: currentMonth,
      year: currentYear,
      start_date: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
      end_date: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0],
    },
  });

  const handleSubmit = (data: PayrollPeriodFormData) => {
    onSubmit({
      ...data,
      status: 'draft',
      total_employees: 0,
      total_amount: 0,
      created_by: '', // Will be set by the hook
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên kỳ tính lương</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tháng</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="12" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="2020" 
                    max="2050" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang tạo...' : 'Tạo kỳ tính lương'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
