// Create OKR Cycle Dialog - Dialog for creating new OKR cycles
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus } from 'lucide-react';
import { useCreateOKRCycle } from '@/hooks/useOKRSystem';
import { useToast } from '@/hooks/use-toast';

interface CreateOKRCycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOKRCycleDialog({ open, onOpenChange }: CreateOKRCycleDialogProps) {
  const { toast } = useToast();
  const createCycle = useCreateOKRCycle();
  
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
  
  const [formData, setFormData] = useState({
    name: '',
    year: currentYear,
    quarter: `Q${currentQuarter}`,
    cycle_type: 'quarterly' as 'monthly' | 'quarterly' | 'yearly',
    start_date: '',
    end_date: '',
    status: 'planning' as 'planning' | 'active' | 'review' | 'closed',
    is_current: true
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập tên chu kỳ OKR"
      });
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ngày bắt đầu và kết thúc"
      });
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Ngày bắt đầu phải trước ngày kết thúc"
      });
      return;
    }

    createCycle.mutate({
      name: formData.name,
      year: formData.year,
      quarter: formData.quarter,
      cycle_type: formData.cycle_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status,
      is_current: formData.is_current
    }, {
      onSuccess: () => {
        onOpenChange(false);
        // Reset form
        setFormData({
          name: '',
          year: currentYear,
          quarter: `Q${currentQuarter}`,
          cycle_type: 'quarterly',
          start_date: '',
          end_date: '',
          status: 'planning',
          is_current: true
        });
      }
    });
  };

  // Auto generate cycle name when year/quarter changes
  React.useEffect(() => {
    if (formData.cycle_type === 'quarterly') {
      setFormData(prev => ({
        ...prev,
        name: `OKR ${prev.quarter} ${prev.year}`
      }));
    } else if (formData.cycle_type === 'yearly') {
      setFormData(prev => ({
        ...prev,
        name: `OKR ${prev.year}`
      }));
    }
  }, [formData.year, formData.quarter, formData.cycle_type]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Tạo chu kỳ OKR mới
          </DialogTitle>
          <DialogDescription>
            Thiết lập chu kỳ OKR để bắt đầu quản lý mục tiêu
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin chu kỳ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cycle-name">Tên chu kỳ *</Label>
                <Input
                  id="cycle-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: OKR Q4 2024"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cycle-year">Năm *</Label>
                  <Input
                    id="cycle-year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || currentYear }))}
                    min={currentYear - 5}
                    max={currentYear + 5}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cycle-type">Loại chu kỳ *</Label>
                  <Select 
                    value={formData.cycle_type} 
                    onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => 
                      setFormData(prev => ({ ...prev, cycle_type: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn loại chu kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                      <SelectItem value="quarterly">Hàng quý</SelectItem>
                      <SelectItem value="yearly">Hàng năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.cycle_type === 'quarterly' && (
                <div>
                  <Label htmlFor="cycle-quarter">Quý *</Label>
                  <Select 
                    value={formData.quarter} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, quarter: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn quý" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1">Quý 1 (Tháng 1-3)</SelectItem>
                      <SelectItem value="Q2">Quý 2 (Tháng 4-6)</SelectItem>
                      <SelectItem value="Q3">Quý 3 (Tháng 7-9)</SelectItem>
                      <SelectItem value="Q4">Quý 4 (Tháng 10-12)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Ngày bắt đầu *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="end-date">Ngày kết thúc *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cycle-status">Trạng thái *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'planning' | 'active' | 'review' | 'closed') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Đang lập kế hoạch</SelectItem>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="review">Đang đánh giá</SelectItem>
                      <SelectItem value="closed">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="is-current"
                    checked={formData.is_current}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_current: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="is-current" className="text-sm">
                    Đặt làm chu kỳ hiện tại
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createCycle.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              {createCycle.isPending ? 'Đang tạo...' : 'Tạo chu kỳ'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}