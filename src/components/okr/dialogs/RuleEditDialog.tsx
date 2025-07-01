
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface RewardRule {
  id: number;
  category: string;
  action: string;
  reward: string;
  conditions: string;
  status: string;
  priority: string;
  usage_count: number;
}

interface RuleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: RewardRule | null;
  onSave: (rule: RewardRule) => void;
}

export function RuleEditDialog({ open, onOpenChange, rule, onSave }: RuleEditDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: rule?.id || 0,
    category: rule?.category || '',
    action: rule?.action || '',
    reward: rule?.reward || '',
    conditions: rule?.conditions || '',
    priority: rule?.priority || 'medium',
    status: rule?.status || 'active',
    usage_count: rule?.usage_count || 0
  });

  const handleSave = () => {
    if (!formData.category || !formData.action || !formData.reward) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin quy tắc",
        variant: "destructive",
      });
      return;
    }

    onSave(formData as RewardRule);
    toast({
      title: "Đã lưu thành công",
      description: "Quy tắc thưởng đã được cập nhật",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Chỉnh sửa quy tắc thưởng' : 'Tạo quy tắc thưởng mới'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OKR Completion">OKR Completion</SelectItem>
                  <SelectItem value="Excellence">Excellence</SelectItem>
                  <SelectItem value="Collaboration">Collaboration</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Innovation">Innovation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Độ ưu tiên</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Hành động kích hoạt</Label>
            <Input
              value={formData.action}
              onChange={(e) => setFormData({...formData, action: e.target.value})}
              placeholder="VD: Hoàn thành OKR trước hạn 2 tuần"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Phần thưởng</Label>
            <Input
              value={formData.reward}
              onChange={(e) => setFormData({...formData, reward: e.target.value})}
              placeholder="VD: 200 OKR Coins + 20 Trust Points + Badge"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Điều kiện</Label>
            <Textarea
              value={formData.conditions}
              onChange={(e) => setFormData({...formData, conditions: e.target.value})}
              placeholder="Mô tả điều kiện cụ thể để nhận thưởng..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="disabled">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {rule && (
              <div className="space-y-2">
                <Label>Số lần sử dụng</Label>
                <Input
                  type="number"
                  value={formData.usage_count}
                  onChange={(e) => setFormData({...formData, usage_count: parseInt(e.target.value) || 0})}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
