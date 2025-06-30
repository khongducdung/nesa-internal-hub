
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useWorkShifts } from '@/hooks/useWorkShifts';

const shiftAssignmentSchema = z.object({
  work_shift_id: z.string().min(1, 'Chọn ca làm việc là bắt buộc'),
  target_type: z.enum(['employee', 'department', 'position']),
  target_id: z.string().min(1, 'Chọn đối tượng là bắt buộc'),
  effective_from: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  effective_to: z.string().optional(),
});

type ShiftAssignmentFormData = z.infer<typeof shiftAssignmentSchema>;

interface ShiftAssignmentFormProps {
  onClose: () => void;
  assignmentId?: string;
}

export function ShiftAssignmentForm({ onClose, assignmentId }: ShiftAssignmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: employees = [] } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();
  const { data: shifts = [] } = useWorkShifts();
  
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ShiftAssignmentFormData>({
    resolver: zodResolver(shiftAssignmentSchema),
    defaultValues: {
      target_type: 'employee',
      effective_from: new Date().toISOString().split('T')[0],
    },
  });

  const targetType = form.watch('target_type');

  const onSubmit = async (data: ShiftAssignmentFormData) => {
    setIsLoading(true);
    try {
      const assignmentData = {
        work_shift_id: data.work_shift_id,
        employee_id: data.target_type === 'employee' ? data.target_id : null,
        department_id: data.target_type === 'department' ? data.target_id : null,
        position_id: data.target_type === 'position' ? data.target_id : null,
        effective_from: data.effective_from,
        effective_to: data.effective_to || null,
        created_by: '00000000-0000-0000-0000-000000000000', // Tạm thời
      };

      const { error } = await supabase
        .from('shift_assignments')
        .insert([assignmentData]);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Phân công ca làm việc thành công',
      });

      queryClient.invalidateQueries({ queryKey: ['shift-assignments'] });
      onClose();
    } catch (error: any) {
      console.error('Error saving shift assignment:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi phân công ca làm việc',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTargetOptions = () => {
    switch (targetType) {
      case 'employee':
        return employees.map((employee) => (
          <SelectItem key={employee.id} value={employee.id}>
            {employee.full_name} ({employee.employee_code})
          </SelectItem>
        ));
      case 'department':
        return departments.map((department) => (
          <SelectItem key={department.id} value={department.id}>
            {department.name}
          </SelectItem>
        ));
      case 'position':
        return positions.map((position) => (
          <SelectItem key={position.id} value={position.id}>
            {position.name}
          </SelectItem>
        ));
      default:
        return [];
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="work_shift_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ca làm việc *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ca làm việc" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.name} ({shift.start_time} - {shift.end_time})
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
          name="target_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phân công cho *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employee" id="employee" />
                    <Label htmlFor="employee">Nhân viên cụ thể</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="department" id="department" />
                    <Label htmlFor="department">Toàn bộ phòng ban</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="position" id="position" />
                    <Label htmlFor="position">Toàn bộ chức vụ</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Chọn {targetType === 'employee' ? 'nhân viên' : 
                      targetType === 'department' ? 'phòng ban' : 'chức vụ'} *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Chọn ${
                      targetType === 'employee' ? 'nhân viên' : 
                      targetType === 'department' ? 'phòng ban' : 'chức vụ'
                    }`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {renderTargetOptions()}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="effective_from"
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
            name="effective_to"
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
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
