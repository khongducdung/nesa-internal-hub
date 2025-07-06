
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateTrainingProgram, useUpdateTrainingProgram, TrainingProgram } from '@/hooks/useTrainingPrograms';

const trainingProgramFormSchema = z.object({
  name: z.string().min(1, 'Tên chương trình là bắt buộc'),
  description: z.string().optional(),
  trainer: z.string().optional(),
  start_date: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  end_date: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
  max_participants: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled']),
});

type TrainingProgramFormData = z.infer<typeof trainingProgramFormSchema>;

interface TrainingProgramFormProps {
  onClose: () => void;
  initialData?: TrainingProgram;
}

export function TrainingProgramForm({ onClose, initialData }: TrainingProgramFormProps) {
  const createTrainingProgram = useCreateTrainingProgram();
  const updateTrainingProgram = useUpdateTrainingProgram();
  const isEditing = !!initialData;

  const form = useForm<TrainingProgramFormData>({
    resolver: zodResolver(trainingProgramFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      trainer: initialData?.trainer || '',
      start_date: initialData?.start_date ? initialData.start_date.split('T')[0] : '',
      end_date: initialData?.end_date ? initialData.end_date.split('T')[0] : '',
      max_participants: initialData?.max_participants?.toString() || '',
      status: initialData?.status || 'active',
    },
  });

  const onSubmit = async (data: TrainingProgramFormData) => {
    const trainingData = {
      name: data.name,
      description: data.description || undefined,
      trainer: data.trainer || undefined,
      start_date: data.start_date,
      end_date: data.end_date,
      max_participants: data.max_participants ? parseInt(data.max_participants) : undefined,
      status: data.status,
    };

    if (isEditing && initialData) {
      await updateTrainingProgram.mutateAsync({ 
        id: initialData.id, 
        data: trainingData 
      });
    } else {
      await createTrainingProgram.mutateAsync(trainingData);
    }
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
              <FormLabel>Tên chương trình *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên chương trình đào tạo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trainer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giảng viên</FormLabel>
              <FormControl>
                <Input placeholder="Tên giảng viên/đơn vị đào tạo" {...field} />
              </FormControl>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng tối đa</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Số học viên tối đa" {...field} />
                </FormControl>
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
                    <SelectItem value="active">Đang mở</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả về chương trình đào tạo..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={createTrainingProgram.isPending || updateTrainingProgram.isPending}
          >
            {createTrainingProgram.isPending || updateTrainingProgram.isPending 
              ? (isEditing ? 'Đang cập nhật...' : 'Đang tạo...') 
              : (isEditing ? 'Cập nhật chương trình' : 'Tạo chương trình')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
