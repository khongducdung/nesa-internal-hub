
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
import { useEmployees } from '@/hooks/useEmployees';

const attendanceFormSchema = z.object({
  employee_id: z.string().min(1, 'Chọn nhân viên là bắt buộc'),
  date: z.string().min(1, 'Ngày là bắt buộc'),
  check_in_time: z.string().optional(),
  check_out_time: z.string().optional(),
  break_time: z.string().optional(),
  overtime_hours: z.string().optional(),
  status: z.enum(['present', 'absent', 'late', 'half_day']),
  notes: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

interface AttendanceFormProps {
  onClose: () => void;
  attendanceId?: string;
  selectedDate?: string;
}

export function AttendanceForm({ onClose, attendanceId, selectedDate }: AttendanceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: employees = [] } = useEmployees();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      status: 'present',
      date: selectedDate || new Date().toISOString().split('T')[0],
      break_time: '60',
      overtime_hours: '0',
    },
  });

  React.useEffect(() => {
    if (attendanceId) {
      loadAttendanceData();
    }
  }, [attendanceId]);

  const loadAttendanceData = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('id', attendanceId)
        .single();

      if (error) throw error;
      if (data) {
        form.reset({
          ...data,
          check_in_time: data.check_in_time ? new Date(data.check_in_time).toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5) : '',
          check_out_time: data.check_out_time ? new Date(data.check_out_time).toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5) : '',
          break_time: data.break_time?.toString() || '60',
          overtime_hours: data.overtime_hours?.toString() || '0',
        });
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin chấm công',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: AttendanceFormData) => {
    setIsLoading(true);
    try {
      const attendanceData = {
        employee_id: data.employee_id,
        date: data.date,
        check_in_time: data.check_in_time ? `${data.date}T${data.check_in_time}:00` : null,
        check_out_time: data.check_out_time ? `${data.date}T${data.check_out_time}:00` : null,
        break_time: data.break_time ? parseInt(data.break_time) : 60,
        overtime_hours: data.overtime_hours ? parseFloat(data.overtime_hours) : 0,
        status: data.status,
        notes: data.notes || null,
      };

      if (attendanceId) {
        const { error } = await supabase
          .from('attendance')
          .update(attendanceData)
          .eq('id', attendanceId);
        
        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin chấm công thành công',
        });
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert([attendanceData]);
        
        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Thêm bản ghi chấm công thành công',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      onClose();
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi lưu thông tin chấm công',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.full_name} ({employee.employee_code})
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="check_in_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ vào</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="check_out_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ ra</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="break_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian nghỉ (phút)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overtime_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ tăng ca</FormLabel>
                <FormControl>
                  <Input type="number" step="0.5" placeholder="0" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="present">Có mặt</SelectItem>
                  <SelectItem value="late">Trễ</SelectItem>
                  <SelectItem value="absent">Vắng mặt</SelectItem>
                  <SelectItem value="half_day">Nửa ngày</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập ghi chú..." {...field} />
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
            {isLoading ? 'Đang lưu...' : attendanceId ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
