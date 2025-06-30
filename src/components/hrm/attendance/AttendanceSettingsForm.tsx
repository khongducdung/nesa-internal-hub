
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateAttendanceSetting, useUpdateAttendanceSetting, AttendanceSetting } from '@/hooks/useAttendanceSettings';

interface AttendanceSettingsFormProps {
  editingSetting?: AttendanceSetting | null;
  onClose: () => void;
}

export function AttendanceSettingsForm({ editingSetting, onClose }: AttendanceSettingsFormProps) {
  const createSetting = useCreateAttendanceSetting();
  const updateSetting = useUpdateAttendanceSetting();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    work_start_time: '08:00',
    work_end_time: '17:00',
    break_start_time: '12:00',
    break_end_time: '13:00',
    late_threshold_minutes: 15,
    early_leave_threshold_minutes: 15,
    overtime_start_after_minutes: 30,
    weekend_work_allowed: false,
    require_gps_check: false,
    gps_radius_meters: 100,
    is_default: false,
    status: 'active' as 'active' | 'inactive',
    check_type_config: 'daily' as 'daily' | 'shift' | 'both',
    require_shift_start_checkin: false,
    require_shift_start_checkout: false,
    require_shift_end_checkin: false,
    require_shift_end_checkout: false,
    require_daily_start_checkin: true,
    require_daily_end_checkout: true,
    allow_multiple_checkins: false,
  });

  useEffect(() => {
    if (editingSetting) {
      setFormData({
        name: editingSetting.name,
        description: editingSetting.description || '',
        work_start_time: editingSetting.work_start_time.substring(0, 5),
        work_end_time: editingSetting.work_end_time.substring(0, 5),
        break_start_time: editingSetting.break_start_time?.substring(0, 5) || '12:00',
        break_end_time: editingSetting.break_end_time?.substring(0, 5) || '13:00',
        late_threshold_minutes: editingSetting.late_threshold_minutes,
        early_leave_threshold_minutes: editingSetting.early_leave_threshold_minutes,
        overtime_start_after_minutes: editingSetting.overtime_start_after_minutes,
        weekend_work_allowed: editingSetting.weekend_work_allowed,
        require_gps_check: editingSetting.require_gps_check,
        gps_radius_meters: editingSetting.gps_radius_meters,
        is_default: editingSetting.is_default,
        status: editingSetting.status,
        check_type_config: editingSetting.check_type_config || 'daily',
        require_shift_start_checkin: editingSetting.require_shift_start_checkin || false,
        require_shift_start_checkout: editingSetting.require_shift_start_checkout || false,
        require_shift_end_checkin: editingSetting.require_shift_end_checkin || false,
        require_shift_end_checkout: editingSetting.require_shift_end_checkout || false,
        require_daily_start_checkin: editingSetting.require_daily_start_checkin ?? true,
        require_daily_end_checkout: editingSetting.require_daily_end_checkout ?? true,
        allow_multiple_checkins: editingSetting.allow_multiple_checkins || false,
      });
    }
  }, [editingSetting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      work_start_time: formData.work_start_time + ':00',
      work_end_time: formData.work_end_time + ':00',
      break_start_time: formData.break_start_time + ':00',
      break_end_time: formData.break_end_time + ':00',
    };

    if (editingSetting) {
      await updateSetting.mutateAsync({
        id: editingSetting.id,
        data: submitData
      });
    } else {
      await createSetting.mutateAsync(submitData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên cài đặt *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="check_type_config">Loại chấm công</Label>
            <Select value={formData.check_type_config} onValueChange={(value: 'daily' | 'shift' | 'both') => setFormData({...formData, check_type_config: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Chấm công hàng ngày</SelectItem>
                <SelectItem value="shift">Chấm công theo ca</SelectItem>
                <SelectItem value="both">Cả hai loại</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="work_start_time">Giờ bắt đầu làm việc</Label>
              <Input
                id="work_start_time"
                type="time"
                value={formData.work_start_time}
                onChange={(e) => setFormData({...formData, work_start_time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_end_time">Giờ kết thúc làm việc</Label>
              <Input
                id="work_end_time"
                type="time"
                value={formData.work_end_time}
                onChange={(e) => setFormData({...formData, work_end_time: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="break_start_time">Giờ bắt đầu nghỉ trưa</Label>
              <Input
                id="break_start_time"
                type="time"
                value={formData.break_start_time}
                onChange={(e) => setFormData({...formData, break_start_time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break_end_time">Giờ kết thúc nghỉ trưa</Label>
              <Input
                id="break_end_time"
                type="time"
                value={formData.break_end_time}
                onChange={(e) => setFormData({...formData, break_end_time: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="late_threshold">Ngưỡng đi muộn (phút)</Label>
              <Input
                id="late_threshold"
                type="number"
                value={formData.late_threshold_minutes}
                onChange={(e) => setFormData({...formData, late_threshold_minutes: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="early_leave_threshold">Ngưỡng về sớm (phút)</Label>
              <Input
                id="early_leave_threshold"
                type="number"
                value={formData.early_leave_threshold_minutes}
                onChange={(e) => setFormData({...formData, early_leave_threshold_minutes: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overtime_start">Bắt đầu tính overtime sau (phút)</Label>
            <Input
              id="overtime_start"
              type="number"
              value={formData.overtime_start_after_minutes}
              onChange={(e) => setFormData({...formData, overtime_start_after_minutes: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gps_radius">Bán kính GPS (mét)</Label>
            <Input
              id="gps_radius"
              type="number"
              value={formData.gps_radius_meters}
              onChange={(e) => setFormData({...formData, gps_radius_meters: parseInt(e.target.value) || 100})}
            />
          </div>

          {/* Cấu hình chấm công chi tiết */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-gray-900">Cấu hình chấm công chi tiết</h4>
            
            {(formData.check_type_config === 'daily' || formData.check_type_config === 'both') && (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Chấm công hàng ngày</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_daily_start_checkin"
                      checked={formData.require_daily_start_checkin}
                      onCheckedChange={(checked) => setFormData({...formData, require_daily_start_checkin: checked})}
                    />
                    <Label htmlFor="require_daily_start_checkin">Yêu cầu checkin đầu ngày</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_daily_end_checkout"
                      checked={formData.require_daily_end_checkout}
                      onCheckedChange={(checked) => setFormData({...formData, require_daily_end_checkout: checked})}
                    />
                    <Label htmlFor="require_daily_end_checkout">Yêu cầu checkout cuối ngày</Label>
                  </div>
                </div>
              </div>
            )}

            {(formData.check_type_config === 'shift' || formData.check_type_config === 'both') && (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Chấm công theo ca</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_shift_start_checkin"
                      checked={formData.require_shift_start_checkin}
                      onCheckedChange={(checked) => setFormData({...formData, require_shift_start_checkin: checked})}
                    />
                    <Label htmlFor="require_shift_start_checkin">Yêu cầu checkin đầu ca</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_shift_start_checkout"
                      checked={formData.require_shift_start_checkout}
                      onCheckedChange={(checked) => setFormData({...formData, require_shift_start_checkout: checked})}
                    />
                    <Label htmlFor="require_shift_start_checkout">Yêu cầu checkout cuối ca đầu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_shift_end_checkin"
                      checked={formData.require_shift_end_checkin}
                      onCheckedChange={(checked) => setFormData({...formData, require_shift_end_checkin: checked})}
                    />
                    <Label htmlFor="require_shift_end_checkin">Yêu cầu checkin đầu ca cuối</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_shift_end_checkout"
                      checked={formData.require_shift_end_checkout}
                      onCheckedChange={(checked) => setFormData({...formData, require_shift_end_checkout: checked})}
                    />
                    <Label htmlFor="require_shift_end_checkout">Yêu cầu checkout cuối ca</Label>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="allow_multiple_checkins"
                  checked={formData.allow_multiple_checkins}
                  onCheckedChange={(checked) => setFormData({...formData, allow_multiple_checkins: checked})}
                />
                <Label htmlFor="allow_multiple_checkins">Cho phép checkin nhiều lần</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="weekend_work"
                checked={formData.weekend_work_allowed}
                onCheckedChange={(checked) => setFormData({...formData, weekend_work_allowed: checked})}
              />
              <Label htmlFor="weekend_work">Cho phép làm việc cuối tuần</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="require_gps"
                checked={formData.require_gps_check}
                onCheckedChange={(checked) => setFormData({...formData, require_gps_check: checked})}
              />
              <Label htmlFor="require_gps">Yêu cầu kiểm tra GPS</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData({...formData, is_default: checked})}
              />
              <Label htmlFor="is_default">Đặt làm mặc định</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" disabled={createSetting.isPending || updateSetting.isPending}>
          {editingSetting 
            ? (updateSetting.isPending ? 'Đang cập nhật...' : 'Cập nhật cài đặt')
            : (createSetting.isPending ? 'Đang tạo...' : 'Tạo cài đặt')
          }
        </Button>
      </div>
    </form>
  );
}
