
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OKRCycleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCycleCreated?: (cycle: any) => void;
}

export function OKRCycleForm({ open, onOpenChange, onCycleCreated }: OKRCycleFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    quarter: 'Q1',
    start_date: '',
    end_date: '',
    description: '',
    status: 'planning'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateCycleName = () => {
    const name = `${formData.quarter} ${formData.year}`;
    setFormData({ ...formData, name });
  };

  const generateDates = () => {
    const year = formData.year;
    let start_date, end_date;

    switch (formData.quarter) {
      case 'Q1':
        start_date = `${year}-01-01`;
        end_date = `${year}-03-31`;
        break;
      case 'Q2':
        start_date = `${year}-04-01`;
        end_date = `${year}-06-30`;
        break;
      case 'Q3':
        start_date = `${year}-07-01`;
        end_date = `${year}-09-30`;
        break;
      case 'Q4':
        start_date = `${year}-10-01`;
        end_date = `${year}-12-31`;
        break;
      default:
        return;
    }

    setFormData({ ...formData, start_date, end_date });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('okr_cycles')
        .insert({
          name: formData.name,
          year: formData.year,
          quarter: formData.quarter,
          start_date: formData.start_date,
          end_date: formData.end_date,
          description: formData.description,
          status: formData.status,
          is_current: false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Chu kỳ OKR mới đã được tạo",
      });

      onCycleCreated?.(data);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: '',
        year: new Date().getFullYear(),
        quarter: 'Q1',
        start_date: '',
        end_date: '',
        description: '',
        status: 'planning'
      });

    } catch (error) {
      console.error('Error creating cycle:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo chu kỳ OKR. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo chu kỳ OKR mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Năm *</Label>
              <Input
                id="year"
                type="number"
                min="2024"
                max="2030"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarter">Quý *</Label>
              <Select
                value={formData.quarter}
                onValueChange={(value) => setFormData({ ...formData, quarter: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1">Quý 1 (Tháng 1-3)</SelectItem>
                  <SelectItem value="Q2">Quý 2 (Tháng 4-6)</SelectItem>
                  <SelectItem value="Q3">Quý 3 (Tháng 7-9)</SelectItem>
                  <SelectItem value="Q4">Quý 4 (Tháng 10-12)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên chu kỳ *</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Q3 2025"
                required
              />
              <Button type="button" variant="outline" onClick={generateCycleName}>
                Tự động
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Ngày bắt đầu *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Ngày kết thúc *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="button" variant="outline" onClick={generateDates}>
              Tự động tạo ngày theo quý
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Đang lập kế hoạch</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="review">Đang đánh giá</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả về chu kỳ OKR này"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo chu kỳ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
