
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkShiftMutations } from '@/hooks/useWorkShiftMutations';
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { useAttendanceSettings } from '@/hooks/useAttendanceSettings';
import { useToast } from '@/components/ui/use-toast';

interface WorkShiftFormProps {
  onClose: () => void;
  shiftId?: string;
}

export function WorkShiftForm({ onClose, shiftId }: WorkShiftFormProps) {
  const { toast } = useToast();
  const { data: shifts } = useWorkShifts();
  const { data: attendanceSettings } = useAttendanceSettings();
  const { createShift, updateShift } = useWorkShiftMutations();

  const currentShift = shiftId ? shifts?.find(s => s.id === shiftId) : null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_time: '08:00',
    end_time: '17:00',
    break_duration_minutes: 60,
    days_of_week: [1, 2, 3, 4, 5], // Mon-Fri
    shift_type: 'fulltime' as 'fulltime' | 'parttime' | 'flexible',
    min_hours_per_day: 8,
    max_hours_per_day: 8,
    color: '#3B82F6',
    attendance_setting_id: ''
  });

  useEffect(() => {
    if (currentShift) {
      setFormData({
        name: currentShift.name || '',
        description: currentShift.description || '',
        start_time: currentShift.start_time || '08:00',
        end_time: currentShift.end_time || '17:00',
        break_duration_minutes: currentShift.break_duration_minutes || 60,
        days_of_week: currentShift.days_of_week || [1, 2, 3, 4, 5],
        shift_type: (currentShift.shift_type as any) || 'fulltime',
        min_hours_per_day: currentShift.min_hours_per_day || 8,
        max_hours_per_day: currentShift.max_hours_per_day || 8,
        color: currentShift.color || '#3B82F6',
        attendance_setting_id: currentShift.attendance_setting_id || ''
      });
    } else if (attendanceSettings && attendanceSettings.length > 0) {
      setFormData(prev => ({
        ...prev,
        attendance_setting_id: attendanceSettings[0].id
      }));
    }
  }, [currentShift, attendanceSettings]);

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day].sort()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (shiftId) {
        await updateShift.mutateAsync({ id: shiftId, data: formData });
        toast({ title: 'Đã cập nhật ca làm việc thành công' });
      } else {
        await createShift.mutateAsync(formData);
        toast({ title: 'Đã tạo ca làm việc thành công' });
      }
      onClose();
    } catch (error) {
      toast({ 
        title: 'Có lỗi xảy ra', 
        description: 'Vui lòng thử lại sau',
        variant: 'destructive' 
      });
    }
  };

  const dayNames = [
    { value: 0, label: 'Chủ nhật' },
    { value: 1, label: 'Thứ 2' },
    { value: 2, label: 'Thứ 3' },
    { value: 3, label: 'Thứ 4' },
    { value: 4, label: 'Thứ 5' },
    { value: 5, label: 'Thứ 6' },
    { value: 6, label: 'Thứ 7' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên ca làm việc *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ca hành chính"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shift_type">Loại ca *</Label>
          <Select 
            value={formData.shift_type} 
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, shift_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fulltime">Full-time (8 giờ)</SelectItem>
              <SelectItem value="parttime">Part-time (4 giờ)</SelectItem>
              <SelectItem value="flexible">Linh hoạt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Mô tả về ca làm việc"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Giờ bắt đầu *</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">Giờ kết thúc *</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="break_duration">Nghỉ trưa (phút)</Label>
          <Input
            id="break_duration"
            type="number"
            value={formData.break_duration_minutes}
            onChange={(e) => setFormData(prev => ({ ...prev, break_duration_minutes: parseInt(e.target.value) || 0 }))}
            min="0"
          />
        </div>
      </div>

      {formData.shift_type === 'flexible' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_hours">Giờ tối thiểu/ngày</Label>
            <Input
              id="min_hours"
              type="number"
              step="0.5"
              value={formData.min_hours_per_day}
              onChange={(e) => setFormData(prev => ({ ...prev, min_hours_per_day: parseFloat(e.target.value) || 0 }))}
              min="0"
              max="24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_hours">Giờ tối đa/ngày</Label>
            <Input
              id="max_hours"
              type="number"
              step="0.5"
              value={formData.max_hours_per_day}
              onChange={(e) => setFormData(prev => ({ ...prev, max_hours_per_day: parseFloat(e.target.value) || 0 }))}
              min="0"
              max="24"
            />
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ngày trong tuần</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dayNames.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day.value}`}
                  checked={formData.days_of_week.includes(day.value)}
                  onCheckedChange={() => handleDayToggle(day.value)}
                />
                <Label htmlFor={`day-${day.value}`} className="text-sm">
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Màu sắc</Label>
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendance_setting">Cài đặt chấm công *</Label>
          <Select 
            value={formData.attendance_setting_id} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, attendance_setting_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cài đặt chấm công" />
            </SelectTrigger>
            <SelectContent>
              {attendanceSettings?.map((setting) => (
                <SelectItem key={setting.id} value={setting.id}>
                  {setting.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={createShift.isPending || updateShift.isPending}
        >
          {createShift.isPending || updateShift.isPending 
            ? 'Đang xử lý...' 
            : (shiftId ? 'Cập nhật' : 'Tạo ca')
          }
        </Button>
      </div>
    </form>
  );
}
