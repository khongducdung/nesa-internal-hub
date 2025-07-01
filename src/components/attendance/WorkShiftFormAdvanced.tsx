
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
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { useAttendanceSettings } from '@/hooks/useAttendanceSettings';
import { useToast } from '@/components/ui/use-toast';
import { ColorPicker } from '@/components/ui/color-picker';
import { Clock, Users, MapPin, Settings, Calendar, AlertCircle } from 'lucide-react';

interface WorkShiftFormAdvancedProps {
  onClose: () => void;
  shiftId?: string;
}

export function WorkShiftFormAdvanced({ onClose, shiftId }: WorkShiftFormAdvancedProps) {
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
    days_of_week: [1, 2, 3, 4, 5],
    shift_type: 'fulltime' as 'fulltime' | 'parttime' | 'flexible',
    min_hours_per_day: 8,
    max_hours_per_day: 8,
    color: '#3B82F6',
    attendance_setting_id: '',
    // Advanced features
    is_night_shift: false,
    allow_early_checkin_minutes: 15,
    allow_late_checkout_minutes: 15,
    auto_checkout_enabled: false,
    auto_checkout_time: '18:00',
    require_manager_approval: false,
    location_restricted: false,
    max_employees: null as number | null,
    priority_level: 1
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'schedule' | 'rules' | 'advanced'>('basic');

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
        attendance_setting_id: currentShift.attendance_setting_id || '',
        // Advanced features (default values for existing shifts)
        is_night_shift: false,
        allow_early_checkin_minutes: 15,
        allow_late_checkout_minutes: 15,
        auto_checkout_enabled: false,
        auto_checkout_time: '18:00',
        require_manager_approval: false,
        location_restricted: false,
        max_employees: null,
        priority_level: 1
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

  const calculateWorkHours = () => {
    const start = new Date(`2000-01-01T${formData.start_time}:00`);
    const end = new Date(`2000-01-01T${formData.end_time}:00`);
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diff < 0) diff += 24; // Handle overnight shifts
    return Math.max(0, diff - (formData.break_duration_minutes / 60));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        max_employees: formData.max_employees || undefined
      };

      if (shiftId) {
        await updateShift.mutateAsync({ id: shiftId, data: submitData });
        toast({ title: 'Đã cập nhật ca làm việc thành công' });
      } else {
        await createShift.mutateAsync(submitData);
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
    { value: 0, label: 'Chủ nhật', short: 'CN' },
    { value: 1, label: 'Thứ 2', short: 'T2' },
    { value: 2, label: 'Thứ 3', short: 'T3' },
    { value: 3, label: 'Thứ 4', short: 'T4' },
    { value: 4, label: 'Thứ 5', short: 'T5' },
    { value: 5, label: 'Thứ 6', short: 'T6' },
    { value: 6, label: 'Thứ 7', short: 'T7' }
  ];

  const workHours = calculateWorkHours();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'basic', label: 'Thông tin cơ bản', icon: Clock },
          { key: 'schedule', label: 'Lịch trình', icon: Calendar },
          { key: 'rules', label: 'Quy tắc', icon: Settings },
          { key: 'advanced', label: 'Nâng cao', icon: Users }
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
                  <SelectItem value="fulltime">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Full-time (8 giờ)
                    </div>
                  </SelectItem>
                  <SelectItem value="parttime">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Part-time (4 giờ)
                    </div>
                  </SelectItem>
                  <SelectItem value="flexible">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Linh hoạt
                    </div>
                  </SelectItem>
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

          <div className="space-y-2">
            <Label>Màu sắc ca làm việc</Label>
            <ColorPicker
              value={formData.color}
              onChange={(color) => setFormData(prev => ({ ...prev, color }))}
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
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {setting.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
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

          {/* Work Hours Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng giờ làm việc:</span>
                <Badge variant="outline" className="text-lg font-semibold">
                  {workHours.toFixed(1)} giờ
                </Badge>
              </div>
            </CardContent>
          </Card>

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
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày trong tuần
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
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quy tắc check-in/out</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="early_checkin">Cho phép check-in sớm (phút)</Label>
                  <Input
                    id="early_checkin"
                    type="number"
                    value={formData.allow_early_checkin_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, allow_early_checkin_minutes: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="late_checkout">Cho phép check-out muộn (phút)</Label>
                  <Input
                    id="late_checkout"
                    type="number"
                    value={formData.allow_late_checkout_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, allow_late_checkout_minutes: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tự động check-out</Label>
                    <p className="text-sm text-gray-600">Tự động check-out khi hết giờ làm việc</p>
                  </div>
                  <Switch
                    checked={formData.auto_checkout_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_checkout_enabled: checked }))}
                  />
                </div>

                {formData.auto_checkout_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="auto_checkout_time">Thời gian tự động check-out</Label>
                    <Input
                      id="auto_checkout_time"
                      type="time"
                      value={formData.auto_checkout_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, auto_checkout_time: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ca làm việc đêm</Label>
                    <p className="text-sm text-gray-600">Đánh dấu đây là ca làm việc qua đêm</p>
                  </div>
                  <Switch
                    checked={formData.is_night_shift}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_night_shift: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Yêu cầu phê duyệt từ quản lý</Label>
                    <p className="text-sm text-gray-600">Cần phê duyệt khi đăng ký ca này</p>
                  </div>
                  <Switch
                    checked={formData.require_manager_approval}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, require_manager_approval: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Quản lý nhân viên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max_employees">Số lượng nhân viên tối đa</Label>
                <Input
                  id="max_employees"
                  type="number"
                  value={formData.max_employees || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_employees: e.target.value ? parseInt(e.target.value) : null }))}
                  placeholder="Không giới hạn"
                  min="1"
                />
                <p className="text-sm text-gray-600">Để trống nếu không giới hạn số lượng nhân viên</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority_level">Mức độ ưu tiên</Label>
                <Select 
                  value={formData.priority_level.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority_level: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cao</SelectItem>
                    <SelectItem value="2">Trung bình</SelectItem>
                    <SelectItem value="3">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Giới hạn theo địa điểm</Label>
                  <p className="text-sm text-gray-600">Chỉ cho phép check-in tại địa điểm cụ thể</p>
                </div>
                <Switch
                  checked={formData.location_restricted}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, location_restricted: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {formData.location_restricted && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Cài đặt địa điểm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Tính năng này sẽ được phát triển trong phiên bản tới. Hiện tại, vui lòng sử dụng cài đặt GPS trong phần cài đặt chấm công.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

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
