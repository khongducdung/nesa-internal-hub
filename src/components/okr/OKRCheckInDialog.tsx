// OKR Check-in Dialog - Check-in định kỳ cho OKR
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { MessageCircle, Heart, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import type { OKRObjective } from '@/types/okr';

interface OKRCheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okr: OKRObjective;
}

export function OKRCheckInDialog({ open, onOpenChange, okr }: OKRCheckInDialogProps) {
  const [checkInType, setCheckInType] = useState<'weekly' | 'monthly' | 'quarterly'>('weekly');
  const [confidenceLevel, setConfidenceLevel] = useState([4]);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [challenges, setChallenges] = useState('');
  const [supportNeeded, setSupportNeeded] = useState('');
  const [nextActions, setNextActions] = useState('');
  const [moodIndicator, setMoodIndicator] = useState<'confident' | 'concerned' | 'at_risk'>('confident');

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'confident': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'concerned': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'at_risk': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'confident': return 'bg-green-100 text-green-800 border-green-200';
      case 'concerned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'at_risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceText = (level: number) => {
    switch (level) {
      case 1: return 'Rất thấp - Cần hỗ trợ khẩn cấp';
      case 2: return 'Thấp - Gặp nhiều khó khăn';
      case 3: return 'Trung bình - Có thể hoàn thành';
      case 4: return 'Cao - Tự tin hoàn thành';
      case 5: return 'Rất cao - Có thể vượt mục tiêu';
      default: return '';
    }
  };

  const handleSubmit = () => {
    // TODO: Implement check-in creation
    const checkInData = {
      okr_id: okr.id,
      check_in_type: checkInType,
      confidence_level: confidenceLevel[0],
      status_update: statusUpdate,
      challenges: challenges || null,
      support_needed: supportNeeded || null,
      next_actions: nextActions || null,
      mood_indicator: moodIndicator
    };
    
    console.log('Creating check-in:', checkInData);
    onOpenChange(false);
    
    // Reset form
    setStatusUpdate('');
    setChallenges('');
    setSupportNeeded('');
    setNextActions('');
    setConfidenceLevel([4]);
    setMoodIndicator('confident');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Check-in OKR
          </DialogTitle>
          <DialogDescription>
            {okr.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* OKR Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng quan OKR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {okr.owner_type === 'company' ? 'Công ty' :
                     okr.owner_type === 'department' ? 'Phòng ban' : 'Cá nhân'}
                  </Badge>
                  <Badge variant="outline">
                    {okr.quarter} {okr.year}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{okr.progress}%</div>
                  <div className="text-sm text-muted-foreground">Tiến độ</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{okr.description}</p>
            </CardContent>
          </Card>

          {/* Check-in Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="check_in_type">Loại check-in</Label>
              <Select value={checkInType} onValueChange={(value: any) => setCheckInType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Hàng tuần</SelectItem>
                  <SelectItem value="monthly">Hàng tháng</SelectItem>
                  <SelectItem value="quarterly">Hàng quý</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mood">Tâm trạng</Label>
              <Select value={moodIndicator} onValueChange={(value: any) => setMoodIndicator(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn tâm trạng" />
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
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Lo lắng
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

            <div className="flex items-center gap-2">
              <Badge className={getMoodColor(moodIndicator)}>
                {getMoodIcon(moodIndicator)}
                <span className="ml-1">
                  {moodIndicator === 'confident' ? 'Tự tin' :
                   moodIndicator === 'concerned' ? 'Lo lắng' : 'Có rủi ro'}
                </span>
              </Badge>
            </div>
          </div>

          {/* Confidence Level */}
          <div>
            <Label>Mức độ tự tin hoàn thành mục tiêu ({confidenceLevel[0]}/5)</Label>
            <div className="mt-2 space-y-2">
              <Slider
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground text-center">
                {getConfidenceText(confidenceLevel[0])}
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <Label htmlFor="status_update">Cập nhật tình hình *</Label>
            <Textarea
              id="status_update"
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
              placeholder="Mô tả về tiến độ hiện tại, những gì đã đạt được, kết quả cụ thể..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Challenges */}
          <div>
            <Label htmlFor="challenges">Thách thức gặp phải</Label>
            <Textarea
              id="challenges"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Những khó khăn, trở ngại đang gặp phải trong việc thực hiện mục tiêu..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Support Needed */}
          <div>
            <Label htmlFor="support">Hỗ trợ cần thiết</Label>
            <Textarea
              id="support"
              value={supportNeeded}
              onChange={(e) => setSupportNeeded(e.target.value)}
              placeholder="Loại hỗ trợ cần thiết từ đồng nghiệp, quản lý hoặc tài nguyên..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Next Actions */}
          <div>
            <Label htmlFor="next_actions">Kế hoạch tiếp theo</Label>
            <Textarea
              id="next_actions"
              value={nextActions}
              onChange={(e) => setNextActions(e.target.value)}
              placeholder="Những hành động cụ thể sẽ thực hiện trong thời gian tới..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={!statusUpdate.trim()}>
              Gửi Check-in
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}