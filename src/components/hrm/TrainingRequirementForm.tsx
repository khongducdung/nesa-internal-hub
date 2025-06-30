
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useEmployees } from '@/hooks/useEmployees';
import { useCreateTrainingRequirement } from '@/hooks/useTrainingRequirements';

const trainingRequirementSchema = z.object({
  name: z.string().min(1, 'Tên chương trình không được để trống'),
  description: z.string().optional(),
  reason: z.string().optional(),
  course_url: z.string().url('URL khóa học không hợp lệ').optional().or(z.literal('')),
  duration_days: z.number().min(1, 'Thời gian phải lớn hơn 0'),
  target_type: z.enum(['general', 'department', 'position', 'employee']),
  target_ids: z.array(z.string()).optional(),
  auto_assign_after_days: z.number().min(0, 'Số ngày không được âm'),
  is_active: z.boolean(),
});

type TrainingRequirementFormData = z.infer<typeof trainingRequirementSchema>;

interface TrainingRequirementFormProps {
  onSuccess?: () => void;
}

export function TrainingRequirementForm({ onSuccess }: TrainingRequirementFormProps) {
  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();
  const { data: employees } = useEmployees();
  const createTrainingRequirement = useCreateTrainingRequirement();

  const form = useForm<TrainingRequirementFormData>({
    resolver: zodResolver(trainingRequirementSchema),
    defaultValues: {
      name: '',
      description: '',
      reason: '',
      course_url: '',
      duration_days: 30,
      target_type: 'general',
      target_ids: [],
      auto_assign_after_days: 0,
      is_active: true,
    },
  });

  const targetType = form.watch('target_type');

  const onSubmit = async (data: TrainingRequirementFormData) => {
    try {
      // Ensure all required fields are present and properly typed
      const formattedData = {
        name: data.name,
        description: data.description || undefined,
        reason: data.reason || undefined,
        course_url: data.course_url || undefined,
        duration_days: data.duration_days,
        target_type: data.target_type,
        target_ids: data.target_ids || undefined,
        auto_assign_after_days: data.auto_assign_after_days,
        is_active: data.is_active,
      };
      
      await createTrainingRequirement.mutateAsync(formattedData);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating training requirement:', error);
    }
  };

  const renderTargetSelection = () => {
    switch (targetType) {
      case 'department':
        return (
          <div className="space-y-2">
            <Label>Chọn phòng ban</Label>
            <Select
              value={form.watch('target_ids')?.[0] || ''}
              onValueChange={(value) => form.setValue('target_ids', [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'position':
        return (
          <div className="space-y-2">
            <Label>Chọn chức vụ</Label>
            <Select
              value={form.watch('target_ids')?.[0] || ''}
              onValueChange={(value) => form.setValue('target_ids', [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent>
                {positions?.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id}>
                    {pos.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'employee':
        return (
          <div className="space-y-2">
            <Label>Chọn nhân viên</Label>
            <Select
              value={form.watch('target_ids')?.[0] || ''}
              onValueChange={(value) => form.setValue('target_ids', [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.employee_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo yêu cầu đào tạo mới</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên chương trình *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Nhập tên chương trình đào tạo"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_days">Thời hạn hoàn thành (ngày) *</Label>
              <Input
                id="duration_days"
                type="number"
                {...form.register('duration_days', { valueAsNumber: true })}
                min="1"
              />
              {form.formState.errors.duration_days && (
                <p className="text-sm text-red-500">{form.formState.errors.duration_days.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Mô tả chi tiết về chương trình đào tạo"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Lý do đào tạo</Label>
            <Textarea
              id="reason"
              {...form.register('reason')}
              placeholder="Lý do tại sao cần đào tạo"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course_url">Link khóa học</Label>
            <Input
              id="course_url"
              {...form.register('course_url')}
              placeholder="https://example.com/course"
              type="url"
            />
            {form.formState.errors.course_url && (
              <p className="text-sm text-red-500">{form.formState.errors.course_url.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Đối tượng áp dụng</Label>
              <Select
                value={targetType}
                onValueChange={(value) => {
                  form.setValue('target_type', value as any);
                  form.setValue('target_ids', []);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Tất cả nhân viên</SelectItem>
                  <SelectItem value="department">Theo phòng ban</SelectItem>
                  <SelectItem value="position">Theo chức vụ</SelectItem>
                  <SelectItem value="employee">Nhân viên cụ thể</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auto_assign_after_days">Tự động giao sau (ngày)</Label>
              <Input
                id="auto_assign_after_days"
                type="number"
                {...form.register('auto_assign_after_days', { valueAsNumber: true })}
                min="0"
                placeholder="0 = giao ngay lập tức"
              />
            </div>
          </div>

          {renderTargetSelection()}

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Kích hoạt ngay</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={createTrainingRequirement.isPending}
            >
              {createTrainingRequirement.isPending ? 'Đang tạo...' : 'Tạo yêu cầu đào tạo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
