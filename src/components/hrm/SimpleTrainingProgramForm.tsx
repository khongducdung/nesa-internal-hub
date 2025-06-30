
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateTrainingProgram } from '@/hooks/useTrainingPrograms';

const trainingProgramSchema = z.object({
  name: z.string().min(1, 'Tên chương trình không được để trống'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Ngày bắt đầu không được để trống'),
  end_date: z.string().min(1, 'Ngày kết thúc không được để trống'),
  trainer: z.string().optional(),
  max_participants: z.number().min(1, 'Số lượng tối đa phải lớn hơn 0').optional(),
  status: z.enum(['active', 'inactive']),
});

type TrainingProgramFormData = z.infer<typeof trainingProgramSchema>;

interface SimpleTrainingProgramFormProps {
  onSuccess?: () => void;
}

export function SimpleTrainingProgramForm({ onSuccess }: SimpleTrainingProgramFormProps) {
  const createTrainingProgram = useCreateTrainingProgram();

  const form = useForm<TrainingProgramFormData>({
    resolver: zodResolver(trainingProgramSchema),
    defaultValues: {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      trainer: '',
      status: 'active',
    },
  });

  const onSubmit = async (data: TrainingProgramFormData) => {
    try {
      const formattedData = {
        name: data.name,
        description: data.description || undefined,
        start_date: data.start_date,
        end_date: data.end_date,
        trainer: data.trainer || undefined,
        max_participants: data.max_participants || undefined,
        status: data.status,
      };
      
      await createTrainingProgram.mutateAsync(formattedData);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating training program:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Mô tả chi tiết về chương trình"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Ngày bắt đầu *</Label>
              <Input
                id="start_date"
                type="date"
                {...form.register('start_date')}
              />
              {form.formState.errors.start_date && (
                <p className="text-sm text-red-500">{form.formState.errors.start_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Ngày kết thúc *</Label>
              <Input
                id="end_date"
                type="date"
                {...form.register('end_date')}
              />
              {form.formState.errors.end_date && (
                <p className="text-sm text-red-500">{form.formState.errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainer">Giảng viên</Label>
              <Input
                id="trainer"
                {...form.register('trainer')}
                placeholder="Tên giảng viên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_participants">Số lượng tối đa</Label>
              <Input
                id="max_participants"
                type="number"
                {...form.register('max_participants', { valueAsNumber: true })}
                min="1"
                placeholder="Số người tham gia tối đa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(value) => form.setValue('status', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={createTrainingProgram.isPending}
            >
              {createTrainingProgram.isPending ? 'Đang tạo...' : 'Tạo chương trình'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
