
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useWorkShiftMutations } from '@/hooks/useWorkShiftMutations';
import { useWorkShift } from '@/hooks/useWorkShifts';
import { useAttendanceSettings } from '@/hooks/useAttendanceSettings';
import { useToast } from '@/hooks/use-toast';
import { ColorPicker } from '@/components/ui/color-picker';
import { WorkSessionsManager } from './WorkSessionsManager';
import { Clock, Users, Calendar, Settings, AlertCircle } from 'lucide-react';

interface WorkSession {
  name: string;
  start_time: string;
  end_time: string;
  [key: string]: any;
}

interface WorkShiftFormAdvancedProps {
  onClose: () => void;
  shiftId?: string;
}

export function WorkShiftFormAdvanced({ onClose, shiftId }: WorkShiftFormAdvancedProps) {
  const { toast } = useToast();
  const { data: shift } = useWorkShift(shiftId || '');
  const { data: attendanceSettings } = useAttendanceSettings();
  const { createShift, updateShift } = useWorkShiftMutations();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_time: '08:00',
    end_time: '17:00',
    break_duration_minutes: 60,
    days_of_week: [1, 2, 3, 4, 5],
    shift_type: 'fulltime' as 'fulltime' | 'parttime' | 'flexible',
    min_hours_per_day: 8,
    max_hours_per_day: 8,
    color: '#3B82F6',
    attendance_setting_id: '',
    work_sessions: [] as WorkSession[],
    saturday_work_type: 'off' as 'off' | 'full' | 'half_morning' | 'half_afternoon',
    saturday_work_sessions: [] as WorkSession[],
    total_work_coefficient: 1.0,
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'schedule' | 'advanced'>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name || '',
        description: shift.description || '',
        start_time: shift.start_time || '08:00',
        end_time: shift.end_time || '17:00',
        break_duration_minutes: shift.break_duration_minutes || 60,
        days_of_week: shift.days_of_week || [1, 2, 3, 4, 5],
        shift_type: (shift.shift_type as any) || 'fulltime',
        min_hours_per_day: shift.min_hours_per_day || 8,
        max_hours_per_day: shift.max_hours_per_day || 8,
        color: shift.color || '#3B82F6',
        attendance_setting_id: shift.attendance_setting_id || '',
        work_sessions: shift.work_sessions || [],
        saturday_work_type: shift.saturday_work_type || 'off',
        saturday_work_sessions: shift.saturday_work_sessions || [],
        total_work_coefficient: shift.total_work_coefficient || 1.0,
      });
    } else if (attendanceSettings && attendanceSettings.length > 0) {
      setFormData(prev => ({
        ...prev,
        attendance_setting_id: attendanceSettings[0].id,
        work_sessions: [
          { name: 'Ca sáng', start_time: '08:00', end_time: '12:00' },
          { name: 'Ca chiều', start_time: '13:00', end_time: '17:00' }
        ]
      }));
    }
  }, [shift, attendanceSettings]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên ca làm việc là bắt buộc';
    }

    if (!formData.attendance_setting_id) {
      newErrors.attendance_setting_id = 'Vui lòng chọn cài đặt chấm công';
    }

    if (formData.work_sessions.length === 0) {
      newErrors.work_sessions = 'Vui lòng thêm ít nhất một ca làm việc';
    }

    if (formData.days_of_week.length === 0) {
      newErrors.days_of_week = 'Vui lòng chọn ít nhất một ngày trong tuần';
    }

    // Validate work sessions
    formData.work_sessions.forEach((session, index) => {
      if (!session.name.trim()) {
        newErrors[`session_${index}_name`] = `Tên ca ${index + 1} là bắt buộc`;
      }
      if (session.start_time >= session.end_time) {
        newErrors[`session_${index}_time`] = `Thời gian ca ${index + 1} không hợp lệ`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day].sort()
    }));
  };

  const calculateTotalWorkHours = () => {
    const sessionHours = formData.work_sessions.reduce((total, session) => {
      const start = new Date(`2000-01-01T${session.start_time}:00`);
      const end = new Date(`2000-01-01T${session.end_time}:00`);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (diff < 0) diff += 24;
      return total + diff;
    }, 0);
    
    return sessionHours * formData.total_work_coefficient;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Dữ liệu không hợp lệ',
        description: 'Vui lòng kiểm tra lại thông tin đã nhập',
        variant: 'destructive'
      });
      return;
    }
    
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
      console.error('Error saving work shift:', error);
      toast({ 
        title: 'Có lỗi xảy ra', 
        description: 'Vui lòng thử lại sau',
        variant: 'destructive' 
      });
    }
  };

  const dayNames = [
    { value: 0, label: 'Chủ nhật', short: 'CN' },
    { value: 1, label: 'Thứ 2', short: 'T2' },
    { value: 2, label: 'Thứ 3', short: 'T3' },
    { value: 3, label: 'Thứ 4', short: 'T4' },
    { value: 4, label: 'Thứ 5', short: 'T5' },
    { value: 5, label: 'Thứ 6', short: 'T6' },
    { value: 6, label: 'Thứ 7', short: 'T7' }
  ];

  const totalWorkHours = calculateTotalWorkHours();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'basic', label: 'Thông tin cơ bản', icon: Clock },
          { key: 'schedule', label: 'Lịch trình', icon: Calendar },
          { key: 'advanced', label: 'Nâng cao', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              type="button"
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className="flex-1 flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Basic Information Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên ca làm việc *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ca hành chính"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Màu sắc ca làm việc</Label>
              <ColorPicker
                value={formData.color}
                onChange={(color) => setFormData(prev => ({ ...prev, color }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Hệ số công việc</Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                max="2.0"
                value={formData.total_work_coefficient}
                onChange={(e) => setFormData(prev => ({ ...prev, total_work_coefficient: parseFloat(e.target.value) || 1.0 }))}
              />
              <p className="text-sm text-gray-600">
                Hệ số 1.0 = 1 công. Hệ số 0.5 = 0.5 công
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendance_setting">Cài đặt chấm công *</Label>
            <Select 
              value={formData.attendance_setting_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, attendance_setting_id: value }))}
            >
              <SelectTrigger className={errors.attendance_setting_id ? 'border-red-500' : ''}>
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
            {errors.attendance_setting_id && (
              <p className="text-sm text-red-500">{errors.attendance_setting_id}</p>
            )}
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Work Sessions */}
          <div>
            <WorkSessionsManager
              title="Ca làm việc trong ngày"
              sessions={formData.work_sessions}
              onChange={(sessions) => setFormData(prev => ({ ...prev, work_sessions: sessions }))}
            />
            {errors.work_sessions && (
              <p className="text-sm text-red-500 mt-2">{errors.work_sessions}</p>
            )}
          </div>

          {/* Total Work Hours Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng giờ làm việc (sau hệ số):</span>
                <Badge variant="outline" className="text-lg font-semibold">
                  {totalWorkHours.toFixed(1)} giờ
                </Badge>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Hệ số hiện tại: {formData.total_work_coefficient}
              </div>
            </CardContent>
          </Card>

          {/* Days of Week */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày trong tuần *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day) => (
                  <div key={day.value} className="flex flex-col items-center space-y-2">
                    <Label htmlFor={`day-${day.value}`} className="text-xs text-center">
                      {day.label}
                    </Label>
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={formData.days_of_week.includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                  </div>
                ))}
              </div>
              {errors.days_of_week && (
                <p className="text-sm text-red-500 mt-2">{errors.days_of_week}</p>
              )}
            </CardContent>
          </Card>

          {/* Saturday Work Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cấu hình thứ 7</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Loại làm việc thứ 7</Label>
                <Select 
                  value={formData.saturday_work_type} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, saturday_work_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Không làm</SelectItem>
                    <SelectItem value="full">Làm cả ngày</SelectItem>
                    <SelectItem value="half_morning">Nửa ngày sáng</SelectItem>
                    <SelectItem value="half_afternoon">Nửa ngày chiều</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.saturday_work_type !== 'off' && (
                <WorkSessionsManager
                  title="Ca làm việc thứ 7"
                  sessions={formData.saturday_work_sessions}
                  onChange={(sessions) => setFormData(prev => ({ ...prev, saturday_work_sessions: sessions }))}
                  maxSessions={formData.saturday_work_type === 'full' ? 4 : 2}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {formData.shift_type === 'flexible' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cấu hình ca linh hoạt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_hours">Số giờ tối thiểu/ngày</Label>
                    <Input
                      id="min_hours"
                      type="number"
                      min="1"
                      max="24"
                      value={formData.min_hours_per_day}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        min_hours_per_day: parseFloat(e.target.value) || 1 
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_hours">Số giờ tối đa/ngày</Label>
                    <Input
                      id="max_hours"
                      type="number"
                      min="1"
                      max="24"
                      value={formData.max_hours_per_day}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        max_hours_per_day: parseFloat(e.target.value) || 8 
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Giờ bắt đầu ca</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">Giờ kết thúc ca</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="break_duration">Thời gian nghỉ (phút)</Label>
                <Input
                  id="break_duration"
                  type="number"
                  min="0"
                  value={formData.break_duration_minutes}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    break_duration_minutes: parseInt(e.target.value) || 0 
                  }))}
                />
                <p className="text-sm text-gray-600">
                  Thời gian nghỉ sẽ không tính vào giờ làm việc
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={createShift.isPending || updateShift.isPending}
          className="min-w-[120px]"
        >
          {createShift.isPending || updateShift.isPending 
            ? 'Đang xử lý...' 
            : (shiftId ? 'Cập nhật ca' : 'Tạo ca mới')
          }
        </Button>
      </div>
    </form>
  );
}
