// Key Result Progress Dialog - Dialog for updating key result progress
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Plus, Minus } from 'lucide-react';
import { useUpdateKeyResultProgress } from '@/hooks/useOKRSystem';
import { useToast } from '@/hooks/use-toast';
import type { KeyResult } from '@/types/okr';

interface KeyResultProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyResult?: KeyResult | null;
}

export function KeyResultProgressDialog({ open, onOpenChange, keyResult }: KeyResultProgressDialogProps) {
  const { toast } = useToast();
  const updateProgress = useUpdateKeyResultProgress();
  
  const [newValue, setNewValue] = useState(keyResult?.current_value || 0);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (keyResult) {
      setNewValue(keyResult.current_value);
      setNotes('');
    }
  }, [keyResult]);

  const handleSubmit = () => {
    if (!keyResult) return;

    updateProgress.mutate({
      keyResultId: keyResult.id,
      newValue
    }, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Đã cập nhật tiến độ Key Result"
        });
        onOpenChange(false);
      }
    });
  };

  const calculateProgress = () => {
    if (!keyResult) return 0;
    return Math.min(100, Math.max(0, (newValue / keyResult.target_value) * 100));
  };

  const handleQuickUpdate = (increment: number) => {
    if (!keyResult) return;
    const step = keyResult.target_value * 0.1; // 10% của target
    setNewValue(prev => Math.max(0, Math.min(keyResult.target_value, prev + (increment * step))));
  };

  if (!keyResult) return null;

  const currentProgress = calculateProgress();
  const progressDiff = currentProgress - keyResult.progress;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cập nhật tiến độ Key Result
          </DialogTitle>
          <DialogDescription>
            Cập nhật giá trị hiện tại và theo dõi tiến độ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Result Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{keyResult.title}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">
                <Target className="h-3 w-3 mr-1" />
                Mục tiêu: {keyResult.target_value} {keyResult.unit}
              </Badge>
              <Badge variant="outline">
                Hiện tại: {keyResult.current_value} {keyResult.unit}
              </Badge>
              <Badge variant="outline">
                {keyResult.progress}% hoàn thành
              </Badge>
            </div>
          </div>

          {/* Quick Update Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickUpdate(-1)}
              disabled={newValue <= 0}
            >
              <Minus className="h-4 w-4" />
              -10%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickUpdate(1)}
              disabled={newValue >= keyResult.target_value}
            >
              <Plus className="h-4 w-4" />
              +10%
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              Cập nhật nhanh theo 10% mục tiêu
            </span>
          </div>

          {/* Current Value */}
          <div>
            <Label htmlFor="current_value">Giá trị hiện tại *</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="current_value"
                type="number"
                min="0"
                max={keyResult.target_value}
                value={newValue}
                onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-fit">
                {keyResult.unit}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Từ 0 đến {keyResult.target_value} {keyResult.unit}
            </div>
          </div>

          {/* Progress Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tiến độ mới</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {currentProgress.toFixed(1)}%
                </span>
                {progressDiff !== 0 && (
                  <Badge variant={progressDiff > 0 ? 'default' : 'destructive'} className="text-xs">
                    {progressDiff > 0 ? '+' : ''}{progressDiff.toFixed(1)}%
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={currentProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Ghi chú về cập nhật</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mô tả về việc cập nhật tiến độ, nguồn dữ liệu, thành tựu đạt được..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Preview Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Tóm tắt cập nhật</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Giá trị cũ:</span>
                <span>{keyResult.current_value} {keyResult.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Giá trị mới:</span>
                <span className="font-medium">{newValue} {keyResult.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Thay đổi:</span>
                <span className={newValue > keyResult.current_value ? 'text-green-600 font-medium' : newValue < keyResult.current_value ? 'text-red-600 font-medium' : ''}>
                  {newValue > keyResult.current_value ? '+' : ''}{(newValue - keyResult.current_value).toFixed(1)} {keyResult.unit}
                </span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span>Tiến độ mới:</span>
                <span className="font-medium">{currentProgress.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={updateProgress.isPending || newValue === keyResult.current_value}
            >
              {updateProgress.isPending ? 'Đang cập nhật...' : 'Cập nhật tiến độ'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}