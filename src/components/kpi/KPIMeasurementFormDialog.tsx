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
import { useCreateKPIMeasurement } from '@/hooks/useKPI';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const measurementSchema = z.object({
  kpi_id: z.string().min(1, 'Vui lòng chọn KPI'),
  measured_value: z.number().min(0, 'Giá trị đo lường phải >= 0'),
  measurement_date: z.string().min(1, 'Vui lòng chọn ngày đo'),
  measurement_period: z.string().min(1, 'Vui lòng nhập kỳ đo'),
  notes: z.string().optional(),
  evidence_urls: z.array(z.string()).optional(),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

interface KPIMeasurementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpiId?: string;
  kpis: any[];
}

export function KPIMeasurementFormDialog({ open, onOpenChange, kpiId, kpis }: KPIMeasurementFormDialogProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const createMeasurement = useCreateKPIMeasurement();

  const form = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      kpi_id: kpiId || '',
      measured_value: 0,
      measurement_date: new Date().toISOString().split('T')[0],
      measurement_period: '',
      notes: '',
      evidence_urls: [],
    },
  });

  const selectedKPI = kpis.find(k => k.id === form.watch('kpi_id'));

  const onSubmit = async (data: MeasurementFormData) => {
    try {
      await createMeasurement.mutateAsync({
        kpi_id: data.kpi_id,
        measured_value: Number(data.measured_value),
        measurement_date: data.measurement_date,
        measurement_period: data.measurement_period,
        notes: data.notes || null,
        evidence_urls: data.evidence_urls || [],
        measured_by: profile?.employee_id || null,
      });
      
      toast({
        title: 'Thành công',
        description: 'Thêm đo lường KPI thành công',
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi thêm đo lường KPI',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm đo lường KPI</DialogTitle>
          <DialogDescription>
            Nhập kết quả đo lường cho KPI
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
                    <div className="flex items-center gap-2">
                      <span>{kpi.name}</span>
                      <span className="text-muted-foreground">({kpi.unit})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.kpi_id && (
              <p className="text-sm text-destructive">{form.formState.errors.kpi_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="measured_value">
                Giá trị đo được {selectedKPI && `(${selectedKPI.unit})`}
              </Label>
              <Input
                id="measured_value"
                type="number"
                step="0.01"
                {...form.register('measured_value', { valueAsNumber: true })}
              />
              {form.formState.errors.measured_value && (
                <p className="text-sm text-destructive">{form.formState.errors.measured_value.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurement_date">Ngày đo</Label>
              <Input
                id="measurement_date"
                type="date"
                {...form.register('measurement_date')}
              />
              {form.formState.errors.measurement_date && (
                <p className="text-sm text-destructive">{form.formState.errors.measurement_date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurement_period">Kỳ đo lường</Label>
            <Input
              id="measurement_period"
              placeholder="VD: 2024-Q1, 2024-01, 2024"
              {...form.register('measurement_period')}
            />
            {form.formState.errors.measurement_period && (
              <p className="text-sm text-destructive">{form.formState.errors.measurement_period.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Mô tả về kết quả đo lường..."
              {...form.register('notes')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createMeasurement.isPending}>
              Thêm đo lường
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}