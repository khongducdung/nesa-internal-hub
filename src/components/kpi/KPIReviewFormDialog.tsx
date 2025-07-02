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
import { useCreateKPIReview } from '@/hooks/useKPI';
import { useEmployees } from '@/hooks/useEmployees';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PERFORMANCE_RATINGS } from '@/types/kpi';

const reviewSchema = z.object({
  kpi_id: z.string().min(1, 'Vui lòng chọn KPI'),
  review_period: z.string().min(1, 'Vui lòng nhập kỳ đánh giá'),
  achievement_percentage: z.number().min(0).max(200, 'Tỷ lệ đạt được từ 0-200%'),
  performance_rating: z.string().min(1, 'Vui lòng chọn mức đánh giá'),
  variance_analysis: z.string().min(1, 'Vui lòng phân tích chênh lệch'),
  root_cause_analysis: z.string().optional(),
  corrective_actions: z.string().optional(),
  recommendations: z.string().optional(),
  review_type: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface KPIReviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpiId?: string;
  kpis: any[];
}

export function KPIReviewFormDialog({ open, onOpenChange, kpiId, kpis }: KPIReviewFormDialogProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const createReview = useCreateKPIReview();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      kpi_id: kpiId || '',
      review_period: '',
      achievement_percentage: 0,
      performance_rating: '',
      variance_analysis: '',
      root_cause_analysis: '',
      corrective_actions: '',
      recommendations: '',
      review_type: 'regular',
    },
  });

  const selectedKPI = kpis.find(k => k.id === form.watch('kpi_id'));

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createReview.mutateAsync({
        kpi_id: data.kpi_id,
        review_period: data.review_period,
        achievement_percentage: Number(data.achievement_percentage),
        performance_rating: data.performance_rating,
        variance_analysis: data.variance_analysis,
        root_cause_analysis: data.root_cause_analysis || null,
        corrective_actions: data.corrective_actions || null,
        recommendations: data.recommendations || null,
        review_type: data.review_type || 'regular',
        reviewed_by: profile?.employee_id || '',
        status: 'draft',
      });
      
      toast({
        title: 'Thành công',
        description: 'Tạo đánh giá KPI thành công',
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi tạo đánh giá KPI',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đánh giá KPI</DialogTitle>
          <DialogDescription>
            Thực hiện đánh giá định kỳ hiệu suất KPI
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="review_period">Kỳ đánh giá</Label>
              <Input
                id="review_period"
                placeholder="VD: 2024-Q1, 2024-01"
                {...form.register('review_period')}
              />
              {form.formState.errors.review_period && (
                <p className="text-sm text-destructive">{form.formState.errors.review_period.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="achievement_percentage">Tỷ lệ đạt được (%)</Label>
              <Input
                id="achievement_percentage"
                type="number"
                step="0.1"
                min="0"
                max="200"
                {...form.register('achievement_percentage', { valueAsNumber: true })}
              />
              {form.formState.errors.achievement_percentage && (
                <p className="text-sm text-destructive">{form.formState.errors.achievement_percentage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="performance_rating">Mức đánh giá</Label>
              <Select
                value={form.watch('performance_rating')}
                onValueChange={(value) => form.setValue('performance_rating', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức đánh giá" />
                </SelectTrigger>
                <SelectContent>
                  {PERFORMANCE_RATINGS.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: rating.color }}
                        />
                        {rating.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.performance_rating && (
                <p className="text-sm text-destructive">{form.formState.errors.performance_rating.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variance_analysis">Phân tích chênh lệch</Label>
            <Textarea
              id="variance_analysis"
              placeholder="Phân tích nguyên nhân chênh lệch giữa kết quả thực tế và mục tiêu..."
              rows={3}
              {...form.register('variance_analysis')}
            />
            {form.formState.errors.variance_analysis && (
              <p className="text-sm text-destructive">{form.formState.errors.variance_analysis.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="root_cause_analysis">Phân tích nguyên nhân gốc</Label>
            <Textarea
              id="root_cause_analysis"
              placeholder="Phân tích sâu hơn về nguyên nhân gốc của vấn đề..."
              rows={3}
              {...form.register('root_cause_analysis')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="corrective_actions">Hành động khắc phục</Label>
            <Textarea
              id="corrective_actions"
              placeholder="Đề xuất các hành động khắc phục cụ thể..."
              rows={3}
              {...form.register('corrective_actions')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations">Khuyến nghị</Label>
            <Textarea
              id="recommendations"
              placeholder="Khuyến nghị cho kỳ tiếp theo..."
              rows={3}
              {...form.register('recommendations')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createReview.isPending}>
              Tạo đánh giá
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}