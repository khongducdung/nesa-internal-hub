
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEmployees } from '@/hooks/useEmployees';
import { useCreateLeaveRequest } from '@/hooks/useLeaveRequests';

const leaveRequestFormSchema = z.object({
  employee_id: z.string().min(1, 'Nhân viên là bắt buộc'),
  leave_type: z.enum(['annual', 'sick', 'personal', 'emergency']),
  start_date: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  end_date: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
  reason: z.string().optional(),
});

type LeaveRequestFormData = z.infer<typeof leaveRequestFormSchema>;

interface LeaveRequestFormProps {
  onClose: () => void;
}

export function LeaveRequestForm({ onClose }: LeaveRequestFormProps) {
  const { data: employees } = useEmployees();
  const createLeaveRequest = useCreateLeaveRequest();

  const form = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestFormSchema),
    defaultValues: {
      leave_type: 'annual',
    },
  });

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const startDate = form.watch('start_date');
  const endDate = form.watch('end_date');

  const onSubmit = async (data: LeaveRequestFormData) => {
    const days_count = calculateDays(data.start_date, data.end_date);
    
    const leaveRequestData = {
      ...data,
      days_count,
      status: 'pending' as const,
      reason: data.reason || undefined,
    };

    await createLeaveRequest.mutateAsync(leaveRequestData);
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="employee_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhân viên *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.employee_code} - {employee.full_name}
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
          name="leave_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại nghỉ phép</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại nghỉ phép" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="annual">Nghỉ phép năm</SelectItem>
                  <SelectItem value="sick">Nghỉ ốm</SelectItem>
                  <SelectItem value="personal">Nghỉ cá nhân</SelectItem>
                  <SelectItem value="emergency">Nghỉ khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu *</FormLabel>
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
                <FormLabel>Ngày kết thúc *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {startDate && endDate && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              Số ngày nghỉ: <span className="font-semibold">{calculateDays(startDate, endDate)} ngày</span>
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lý do</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập lý do nghỉ phép..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={createLeaveRequest.isPending}>
            {createLeaveRequest.isPending ? 'Đang gửi...' : 'Gửi đơn'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
