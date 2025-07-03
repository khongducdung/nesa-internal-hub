// Key Result Progress Update Dialog - Cập nhật tiến độ Key Result
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle } from 'lucide-react';
import type { KeyResult } from '@/types/okr';
import { useUpdateKeyResult } from '@/hooks/useOKRSystem';

interface KeyResultProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyResult: KeyResult;
}

export function KeyResultProgressDialog({ open, onOpenChange, keyResult }: KeyResultProgressDialogProps) {
  const [currentValue, setCurrentValue] = useState(keyResult.current_value);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'not_started' | 'on_track' | 'at_risk' | 'completed'>(keyResult.status);
  
  const updateKeyResult = useUpdateKeyResult();
  
  const calculatedProgress = keyResult.target_value > 0 
    ? Math.min(100, Math.round((currentValue / keyResult.target_value) * 100))
    : 0;
  
  const progressChange = calculatedProgress - keyResult.progress;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on_track': return 'bg-blue-500';
      case 'at_risk': return 'bg-yellow-500';
      case 'not_started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on_track': return <TrendingUp className="h-4 w-4" />;
      case 'at_risk': return <AlertCircle className="h-4 w-4" />;
      case 'not_started': return <Target className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleSubmit = () => {
    updateKeyResult.mutate({
      id: keyResult.id,
      current_value: currentValue,
      progress: calculatedProgress,
      status: calculatedProgress >= 100 ? 'completed' : status,
      notes
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setNotes('');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cập nhật tiến độ Key Result
          </DialogTitle>
          <DialogDescription>
            {keyResult.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tình trạng hiện tại</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={`${getStatusColor(keyResult.status)} text-white`}>
                    {getStatusIcon(keyResult.status)}
                    <span className="ml-1">
                      {keyResult.status === 'completed' ? 'Hoàn thành' :
                       keyResult.status === 'on_track' ? 'Đúng tiến độ' :
                       keyResult.status === 'at_risk' ? 'Có rủi ro' : 'Chưa bắt đầu'}
                    </span>
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{keyResult.progress}%</div>
                  <div className="text-sm text-muted-foreground">
                    {keyResult.current_value} / {keyResult.target_value} {keyResult.unit}
                  </div>
                </div>
              </div>
              <Progress value={keyResult.progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Update Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_value">Giá trị hiện tại *</Label>
              <Input
                id="current_value"
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                placeholder={`Nhập giá trị (${keyResult.unit})`}
                className="mt-1"
              />
              <div className="text-sm text-muted-foreground mt-1">
                Mục tiêu: {keyResult.target_value} {keyResult.unit}
              </div>
            </div>

            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Chưa bắt đầu</SelectItem>
                  <SelectItem value="on_track">Đúng tiến độ</SelectItem>
                  <SelectItem value="at_risk">Có rủi ro</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* New Progress Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {progressChange > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : progressChange < 0 ? (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                ) : (
                  <Target className="h-5 w-5 text-gray-600" />
                )}
                Tiến độ mới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={`${getStatusColor(calculatedProgress >= 100 ? 'completed' : status)} text-white`}>
                    {getStatusIcon(calculatedProgress >= 100 ? 'completed' : status)}
                    <span className="ml-1">
                      {calculatedProgress >= 100 ? 'Hoàn thành' :
                       status === 'on_track' ? 'Đúng tiến độ' :
                       status === 'at_risk' ? 'Có rủi ro' : 'Chưa bắt đầu'}
                    </span>
                  </Badge>
                  {progressChange !== 0 && (
                    <Badge variant={progressChange > 0 ? 'default' : 'destructive'}>
                      {progressChange > 0 ? '+' : ''}{progressChange.toFixed(1)}%
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{calculatedProgress}%</div>
                  <div className="text-sm text-muted-foreground">
                    {currentValue} / {keyResult.target_value} {keyResult.unit}
                  </div>
                </div>
              </div>
              <Progress value={calculatedProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Ghi chú về tiến độ</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mô tả về tiến độ, thách thức, kế hoạch tiếp theo..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={updateKeyResult.isPending}>
              {updateKeyResult.isPending ? 'Đang cập nhật...' : 'Cập nhật tiến độ'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}