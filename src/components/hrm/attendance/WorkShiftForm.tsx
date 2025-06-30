import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useCreateWorkShift, useUpdateWorkShift } from '@/hooks/useWorkShifts';
import { useAttendanceSettings } from '@/hooks/useAttendanceSettings';

const daysOfWeek = [
  { value: 1, label: 'Thứ 2' },
  { value: 2, label: 'Thứ 3' },
  { value: 3, label: 'Thứ 4' },
  { value: 4, label: 'Thứ 5' },
  { value: 5, label: 'Thứ 6' },
  { value: 6, label: 'Thứ 7' },
  { value: 0, label: 'Chủ nhật' },
];

const workShiftSchema = z.object({
  name: z.string().min(1, 'Tên ca làm việc là bắt buộc'),
  start_time: z.string().min(1, 'Giờ bắt đầu là bắt buộc'),
  end_time: z.string().min(1, 'Giờ kết thúc là bắt buộc'),
  break_duration_minutes: z.number().min(0, 'Thời gian nghỉ không được âm'),
  days_of_week: z.array(z.number()).min(1, 'Chọn ít nhất 1 ngày làm việc'),
  attendance_setting_id: z.string().optional(),
  is_active: z.boolean().default(true),
});

type WorkShiftFormData = z.infer<typeof workShiftSchema>;

interface WorkShiftFormProps {
  onClose: () => void;
  editingShift?: any;
}

export function WorkShiftForm({ onClose, editingShift }: WorkShiftFormProps) {
  const createMutation = useCreateWorkShift();
  const updateMutation = useUpdateWorkShift();
  const { data: attendanceSettings = [] } = useAttendanceSettings();

  const form = useForm<WorkShiftFormData>({
    resolver: zodResolver(workShiftSchema),
    defaultValues: {
      name: editingShift?.name || '',
      start_time: editingShift?.start_time || '08:00',
      end_time: editingShift?.end_time || '17:00',
      break_duration_minutes: editingShift?.break_duration_minutes || 60,
      days_of_week: editingShift?.days_of_week || [1, 2, 3, 4, 5],
      attendance_setting_id: editingShift?.attendance_setting_id || '',
      is_active: editingShift?.is_active ?? true,
    },
  });

  const selectedDays = form.watch('days_of_week');

  const onSubmit = async (data: WorkShiftFormData) => {
    try {
      const shiftData = {
        name: data.name,
        start_time: data.start_time,
        end_time: data.end_time,
        break_duration_minutes: data.break_duration_minutes,
        days_of_week: data.days_of_week,
        attendance_setting_id: data.attendance_setting_id || null,
        is_active: data.is_active,
      };

      if (editingShift) {
        await updateMutation.mutateAsync({
          id: editingShift.id,
          data: shiftData,
        });
      } else {
        await createMutation.mutateAsync(shiftData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving work shift:', error);
    }
  };

  const toggleDay = (dayValue: number) => {
    const currentDays = selectedDays || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue].sort();
    form.setValue('days_of_week', newDays);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên ca làm việc *</FormLabel>
                <FormControl>
                  <Input placeholder="VD: Ca hành chính, Ca đêm..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attendance_setting_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cài đặt chấm công</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cài đặt chấm công" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Không áp dụng</SelectItem>
                    {attendanceSettings.map((setting) => (
                      <SelectItem key={setting.id} value={setting.id}>
                        {setting.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ bắt đầu *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ kết thúc *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="break_duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nghỉ trưa (phút)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="days_of_week"
          render={() => (
            <FormItem>
              <FormLabel>Ngày làm việc *</FormLabel>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Badge
                    key={day.value}
                    variant={selectedDays?.includes(day.value) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 px-3 py-1"
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Ca làm việc hoạt động</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : editingShift ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
