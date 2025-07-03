// OKR Check-in Dialog - Dialog for OKR progress check-ins
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCreateOKRCheckIn } from '@/hooks/useOKRSystem';
import { useToast } from '@/hooks/use-toast';
import type { OKRObjective } from '@/types/okr';

interface OKRCheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okr?: OKRObjective | null;
}

export function OKRCheckInDialog({ open, onOpenChange, okr }: OKRCheckInDialogProps) {
  const { toast } = useToast();
  const createCheckIn = useCreateOKRCheckIn();
  
  const [formData, setFormData] = useState({
    check_in_type: 'weekly' as 'weekly' | 'monthly' | 'quarterly',
    confidence_level: 3,
    status_update: '',
    challenges: '',
    support_needed: '',
    next_actions: '',
    mood_indicator: 'confident' as 'confident' | 'concerned' | 'at_risk'
  });

  const handleSubmit = () => {
    if (!okr) return;
    
    if (!formData.status_update.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập cập nhật trạng thái"
      });
      return;
    }

    createCheckIn.mutate({
      okr_id: okr.id,
      ...formData
    }, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Đã ghi nhận check-in cho OKR"
        });
        onOpenChange(false);
        setFormData({
          check_in_type: 'weekly',
          confidence_level: 3,
          status_update: '',
          challenges: '',
          support_needed: '',
          next_actions: '',
          mood_indicator: 'confident'
        });
      }
    });
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'confident': return 'text-green-600';
      case 'concerned': return 'text-yellow-600';
      case 'at_risk': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'confident': return <CheckCircle className="h-4 w-4" />;
      case 'concerned': return <TrendingUp className="h-4 w-4" />;
      case 'at_risk': return <AlertTriangle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  if (!okr) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Check-in OKR
          </DialogTitle>
          <DialogDescription>
            Cập nhật tiến độ và chia sẻ thông tin về OKR: {okr.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* OKR Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{okr.title}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">{okr.progress}% hoàn thành</Badge>
              <span>Còn {okr.time_to_deadline || 0} ngày</span>
            </div>
          </div>

          {/* Check-in Type */}
          <div>
            <Label htmlFor="check_in_type">Loại check-in</Label>
            <Select 
              value={formData.check_in_type} 
              onValueChange={(value: 'weekly' | 'monthly' | 'quarterly') => 
                setFormData(prev => ({ ...prev, check_in_type: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Hàng tuần</SelectItem>
                <SelectItem value="monthly">Hàng tháng</SelectItem>
                <SelectItem value="quarterly">Hàng quý</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Update */}
          <div>
            <Label htmlFor="status_update">Cập nhật trạng thái *</Label>
            <Textarea
              id="status_update"
              value={formData.status_update}
              onChange={(e) => setFormData(prev => ({ ...prev, status_update: e.target.value }))}
              placeholder="Mô tả những gì đã hoàn thành, tiến độ hiện tại..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Confidence Level */}
          <div>
            <Label>Mức độ tự tin (1-5): {formData.confidence_level}</Label>
            <div className="mt-2">
              <Slider
                value={[formData.confidence_level]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, confidence_level: value[0] }))}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Rất thấp</span>
                <span>Thấp</span>
                <span>Trung bình</span>
                <span>Cao</span>
                <span>Rất cao</span>
              </div>
            </div>
          </div>

          {/* Mood Indicator */}
          <div>
            <Label htmlFor="mood_indicator">Tâm trạng</Label>
            <Select 
              value={formData.mood_indicator} 
              onValueChange={(value: 'confident' | 'concerned' | 'at_risk') => 
                setFormData(prev => ({ ...prev, mood_indicator: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confident">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Tự tin
                  </div>
                </SelectItem>
                <SelectItem value="concerned">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    Lo ngại
                  </div>
                </SelectItem>
                <SelectItem value="at_risk">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Có rủi ro
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Challenges */}
          <div>
            <Label htmlFor="challenges">Thách thức gặp phải</Label>
            <Textarea
              id="challenges"
              value={formData.challenges}
              onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
              placeholder="Những khó khăn, trở ngại đang gặp phải..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Support Needed */}
          <div>
            <Label htmlFor="support_needed">Hỗ trợ cần thiết</Label>
            <Textarea
              id="support_needed"
              value={formData.support_needed}
              onChange={(e) => setFormData(prev => ({ ...prev, support_needed: e.target.value }))}
              placeholder="Những hỗ trợ cần thiết từ đồng nghiệp, quản lý..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Next Actions */}
          <div>
            <Label htmlFor="next_actions">Hành động tiếp theo</Label>
            <Textarea
              id="next_actions"
              value={formData.next_actions}
              onChange={(e) => setFormData(prev => ({ ...prev, next_actions: e.target.value }))}
              placeholder="Kế hoạch hành động cho tuần/tháng tới..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createCheckIn.isPending}
            >
              {createCheckIn.isPending ? 'Đang lưu...' : 'Lưu Check-in'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}