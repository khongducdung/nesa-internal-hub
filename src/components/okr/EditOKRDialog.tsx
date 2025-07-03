// Edit OKR Dialog - Dialog for editing existing OKRs
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save } from 'lucide-react';
import { useUpdateOKR } from '@/hooks/useOKRSystem';
import { useToast } from '@/hooks/use-toast';
import type { OKRObjective } from '@/types/okr';

interface EditOKRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okr: OKRObjective | null;
}

export function EditOKRDialog({ open, onOpenChange, okr }: EditOKRDialogProps) {
  const { toast } = useToast();
  const updateOKR = useUpdateOKR();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active' as 'draft' | 'active' | 'completed' | 'cancelled'
  });

  useEffect(() => {
    if (okr) {
      setFormData({
        title: okr.title,
        description: okr.description,
        status: okr.status
      });
    }
  }, [okr]);

  const handleSubmit = () => {
    if (!okr) return;

    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề OKR"
      });
      return;
    }

    updateOKR.mutate({
      id: okr.id,
      title: formData.title,
      description: formData.description,
      status: formData.status
    }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  if (!okr) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Chỉnh sửa OKR
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho OKR: {okr.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Tiêu đề OKR *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nhập tiêu đề OKR"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Mô tả chi tiết</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về mục tiêu này..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'draft' | 'active' | 'completed' | 'cancelled') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={updateOKR.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateOKR.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}