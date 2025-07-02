import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateKPITarget } from '@/hooks/useKPI';
import { useToast } from '@/hooks/use-toast';
import { TARGET_LEVELS } from '@/types/kpi';

const targetSchema = z.object({
  kpi_id: z.string().min(1, 'Vui lòng chọn KPI'),
  target_period: z.string().min(1, 'Vui lòng nhập kỳ mục tiêu'),
  target_value: z.number().min(0, 'Giá trị mục tiêu phải >= 0'),
  minimum_acceptable: z.number().min(0, 'Giá trị tối thiểu phải >= 0').optional(),
  excellent_threshold: z.number().min(0, 'Ngưỡng xuất sắc phải >= 0').optional(),
  target_type: z.string().optional(),
  notes: z.string().optional(),
});

type TargetFormData = z.infer<typeof targetSchema>;

interface KPITargetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpiId?: string;
  kpis: any[];
}

export function KPITargetFormDialog({ open, onOpenChange, kpiId, kpis }: KPITargetFormDialogProps) {
  const { toast } = useToast();
  const createTarget = useCreateKPITarget();

  const form = useForm<TargetFormData>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      kpi_id: kpiId || '',
      target_period: '',
      target_value: 0,
      minimum_acceptable: 0,
      excellent_threshold: 0,
      target_type: 'absolute',
      notes: '',
    },
  });

  const onSubmit = async (data: TargetFormData) => {
    try {
      await createTarget.mutateAsync({
        kpi_id: data.kpi_id,
        target_period: data.target_period,
        target_value: Number(data.target_value),
        minimum_acceptable: data.minimum_acceptable ? Number(data.minimum_acceptable) : null,
        excellent_threshold: data.excellent_threshold ? Number(data.excellent_threshold) : null,
        target_type: data.target_type || 'absolute',
        notes: data.notes || null,
      });
      
      toast({
        title: 'Thành công',
        description: 'Tạo mục tiêu KPI thành công',
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi tạo mục tiêu KPI',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo mục tiêu KPI</DialogTitle>
          <DialogDescription>
            Thiết lập mục tiêu cụ thể cho KPI
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kpi_id">KPI</Label>
            <Select
              value={form.watch('kpi_id')}
              onValueChange={(value) => form.setValue('kpi_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn KPI" />
              </SelectTrigger>
              <SelectContent>
                {kpis.map((kpi) => (
                  <SelectItem key={kpi.id} value={kpi.id}>
                    {kpi.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.kpi_id && (
              <p className="text-sm text-destructive">{form.formState.errors.kpi_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_period">Kỳ mục tiêu</Label>
            <Input
              id="target_period"
              placeholder="VD: 2024-Q1, 2024-01, 2024"
              {...form.register('target_period')}
            />
            {form.formState.errors.target_period && (
              <p className="text-sm text-destructive">{form.formState.errors.target_period.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_value">Giá trị mục tiêu</Label>
              <Input
                id="target_value"
                type="number"
                step="0.01"
                {...form.register('target_value', { valueAsNumber: true })}
              />
              {form.formState.errors.target_value && (
                <p className="text-sm text-destructive">{form.formState.errors.target_value.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_type">Loại mục tiêu</Label>
              <Select
                value={form.watch('target_type')}
                onValueChange={(value) => form.setValue('target_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absolute">Tuyệt đối</SelectItem>
                  <SelectItem value="percentage">Phần trăm</SelectItem>
                  <SelectItem value="growth">Tăng trưởng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimum_acceptable">Tối thiểu chấp nhận</Label>
              <Input
                id="minimum_acceptable"
                type="number"
                step="0.01"
                {...form.register('minimum_acceptable', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excellent_threshold">Ngưỡng xuất sắc</Label>
              <Input
                id="excellent_threshold"
                type="number"
                step="0.01"
                {...form.register('excellent_threshold', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Mô tả chi tiết về mục tiêu..."
              {...form.register('notes')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createTarget.isPending}>
              Tạo mục tiêu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}