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
import { useCreateKPIActionPlan } from '@/hooks/useKPI';
import { useEmployees } from '@/hooks/useEmployees';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ACTION_PLAN_PRIORITIES, ACTION_PLAN_TYPES } from '@/types/kpi';

const actionPlanSchema = z.object({
  kpi_id: z.string().min(1, 'Vui lòng chọn KPI'),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().min(1, 'Vui lòng nhập mô tả'),
  priority: z.string().optional(),
  action_type: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.string().optional(),
  expected_impact: z.string().optional(),
  resources_required: z.array(z.string()).optional(),
});

type ActionPlanFormData = z.infer<typeof actionPlanSchema>;

interface KPIActionPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpiId?: string;
  kpis: any[];
}

export function KPIActionPlanFormDialog({ open, onOpenChange, kpiId, kpis }: KPIActionPlanFormDialogProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { data: employees = [] } = useEmployees();
  const createActionPlan = useCreateKPIActionPlan();

  const form = useForm<ActionPlanFormData>({
    resolver: zodResolver(actionPlanSchema),
    defaultValues: {
      kpi_id: kpiId || '',
      title: '',
      description: '',
      priority: 'medium',
      action_type: 'improvement',
      assigned_to: '',
      due_date: '',
      expected_impact: '',
      resources_required: [],
    },
  });

  const onSubmit = async (data: ActionPlanFormData) => {
    try {
      await createActionPlan.mutateAsync({
        kpi_id: data.kpi_id,
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        action_type: data.action_type || 'improvement',
        assigned_to: data.assigned_to || null,
        due_date: data.due_date || null,
        expected_impact: data.expected_impact || null,
        resources_required: data.resources_required || [],
        created_by: profile?.employee_id || '',
        status: 'pending',
        progress_percentage: 0,
      });
      
      toast({
        title: 'Thành công',
        description: 'Tạo kế hoạch cải tiến thành công',
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi tạo kế hoạch cải tiến',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo kế hoạch cải tiến KPI</DialogTitle>
          <DialogDescription>
            Tạo kế hoạch hành động để cải thiện hiệu suất KPI
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
            <Label htmlFor="title">Tiêu đề kế hoạch</Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề kế hoạch cải tiến..."
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết về kế hoạch cải tiến..."
              rows={4}
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Mức độ ưu tiên</Label>
              <Select
                value={form.watch('priority')}
                onValueChange={(value) => form.setValue('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_PLAN_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: priority.color }}
                        />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action_type">Loại kế hoạch</Label>
              <Select
                value={form.watch('action_type')}
                onValueChange={(value) => form.setValue('action_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_PLAN_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Người thực hiện</Label>
              <Select
                value={form.watch('assigned_to')}
                onValueChange={(value) => form.setValue('assigned_to', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn người thực hiện" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Ngày hoàn thành dự kiến</Label>
              <Input
                id="due_date"
                type="date"
                {...form.register('due_date')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_impact">Tác động dự kiến</Label>
            <Textarea
              id="expected_impact"
              placeholder="Mô tả tác động dự kiến của kế hoạch..."
              {...form.register('expected_impact')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createActionPlan.isPending}>
              Tạo kế hoạch
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}