import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAttendanceSettings, useAttendanceSettingMutations } from '@/hooks/useAttendanceSettings';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Clock, MapPin, Shield, Calendar } from 'lucide-react';

export function AttendanceSettingsManagement() {
  const { data: settings, isLoading } = useAttendanceSettings();
  const { createSetting, updateSetting } = useAttendanceSettingMutations();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    work_start_time: '08:00',
    work_end_time: '17:00',
    break_start_time: '12:00',
    break_end_time: '13:00',
    late_threshold_minutes: 15,
    early_leave_threshold_minutes: 15,
    overtime_start_after_minutes: 0,
    require_gps_check: false,
    gps_radius_meters: 100,
    weekend_work_allowed: false,
    early_checkin_allowed_minutes: 15,
    late_checkout_allowed_minutes: 15,
    count_early_checkin_as_work: false,
    count_late_checkout_as_work: true,
    saturday_work_enabled: false,
    saturday_work_type: 'off' as 'off' | 'full' | 'half_morning' | 'half_afternoon',
    require_daily_start_checkin: true,
    require_daily_end_checkout: true,
    allow_multiple_checkins: false,
    is_default: false,
    created_by: ''
  });

  const handleEdit = (setting: any) => {
    setEditingId(setting.id);
    setFormData({
      name: setting.name || '',
      description: setting.description || '',
      work_start_time: setting.work_start_time || '08:00',
      work_end_time: setting.work_end_time || '17:00',
      break_start_time: setting.break_start_time || '12:00',
      break_end_time: setting.break_end_time || '13:00',
      late_threshold_minutes: setting.late_threshold_minutes || 15,
      early_leave_threshold_minutes: setting.early_leave_threshold_minutes || 15,
      overtime_start_after_minutes: setting.overtime_start_after_minutes || 0,
      require_gps_check: setting.require_gps_check || false,
      gps_radius_meters: setting.gps_radius_meters || 100,
      weekend_work_allowed: setting.weekend_work_allowed || false,
      early_checkin_allowed_minutes: setting.early_checkin_allowed_minutes || 15,
      late_checkout_allowed_minutes: setting.late_checkout_allowed_minutes || 15,
      count_early_checkin_as_work: setting.count_early_checkin_as_work || false,
      count_late_checkout_as_work: setting.count_late_checkout_as_work || true,
      saturday_work_enabled: setting.saturday_work_enabled || false,
      saturday_work_type: setting.saturday_work_type || 'off',
      require_daily_start_checkin: setting.require_daily_start_checkin ?? true,
      require_daily_end_checkout: setting.require_daily_end_checkout ?? true,
      allow_multiple_checkins: setting.allow_multiple_checkins || false,
      is_default: setting.is_default || false,
      created_by: setting.created_by || ''
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateSetting.mutateAsync({ id: editingId, data: formData });
        toast({ title: 'Đã cập nhật cài đặt chấm công thành công' });
      } else {
        await createSetting.mutateAsync({
          ...formData,
          status: 'active',
          created_by: '' // Should be set to current user ID
        });
        toast({ title: 'Đã tạo cài đặt chấm công thành công' });
      }
      
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error saving attendance setting:', error);
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu cài đặt. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      work_start_time: '08:00',
      work_end_time: '17:00',
      break_start_time: '12:00',
      break_end_time: '13:00',
      late_threshold_minutes: 15,
      early_leave_threshold_minutes: 15,
      overtime_start_after_minutes: 0,
      require_gps_check: false,
      gps_radius_meters: 100,
      weekend_work_allowed: false,
      early_checkin_allowed_minutes: 15,
      late_checkout_allowed_minutes: 15,
      count_early_checkin_as_work: false,
      count_late_checkout_as_work: true,
      saturday_work_enabled: false,
      saturday_work_type: 'off',
      require_daily_start_checkin: true,
      require_daily_end_checkout: true,
      allow_multiple_checkins: false,
      is_default: false,
      created_by: ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Cài đặt chấm công</h2>
          <p className="text-gray-600">Quản lý các quy tắc và cài đặt chấm công</p>
        </div>
        <Button onClick={() => setEditingId('new')}>
          <Settings className="h-4 w-4 mr-2" />
          Tạo cài đặt mới
        </Button>
      </div>

      {/* Form for Creating/Editing */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId === 'new' ? 'Tạo cài đặt chấm công mới' : 'Chỉnh sửa cài đặt chấm công'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên cài đặt *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Cài đặt chấm công văn phòng"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cài đặt mặc định</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_default}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
                    />
                    <Label className="text-sm text-gray-600">
                      Sử dụng làm cài đặt mặc định
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả về cài đặt chấm công này"
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Work Schedule */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <h3 className="text-lg font-medium">Lịch làm việc</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work_start_time">Giờ vào làm</Label>
                  <Input
                    id="work_start_time"
                    type="time"
                    value={formData.work_start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, work_start_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work_end_time">Giờ tan làm</Label>
                  <Input
                    id="work_end_time"
                    type="time"
                    value={formData.work_end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, work_end_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break_start_time">Giờ nghỉ trưa</Label>
                  <Input
                    id="break_start_time"
                    type="time"
                    value={formData.break_start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, break_start_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break_end_time">Hết nghỉ trưa</Label>
                  <Input
                    id="break_end_time"
                    type="time"
                    value={formData.break_end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, break_end_time: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Flexible Check-in/out Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <h3 className="text-lg font-medium">Cài đặt chấm công linh hoạt</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="early_checkin">Cho phép check-in sớm (phút)</Label>
                    <Input
                      id="early_checkin"
                      type="number"
                      min="0"
                      value={formData.early_checkin_allowed_minutes}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        early_checkin_allowed_minutes: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.count_early_checkin_as_work}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        count_early_checkin_as_work: checked 
                      }))}
                    />
                    <Label className="text-sm">
                      Tính thời gian check-in sớm vào giờ làm việc
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="late_checkout">Cho phép check-out muộn (phút)</Label>
                    <Input
                      id="late_checkout"
                      type="number"
                      min="0"
                      value={formData.late_checkout_allowed_minutes}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        late_checkout_allowed_minutes: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.count_late_checkout_as_work}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        count_late_checkout_as_work: checked 
                      }))}
                    />
                    <Label className="text-sm">
                      Tính thời gian check-out muộn vào giờ làm việc
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Saturday Work Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h3 className="text-lg font-medium">Cài đặt làm việc thứ 7</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.saturday_work_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      saturday_work_enabled: checked 
                    }))}
                  />
                  <Label>Cho phép làm việc thứ 7</Label>
                </div>

                {formData.saturday_work_enabled && (
                  <div className="space-y-2">
                    <Label>Loại làm việc thứ 7</Label>
                    <Select 
                      value={formData.saturday_work_type} 
                      onValueChange={(value: any) => setFormData(prev => ({ 
                        ...prev, 
                        saturday_work_type: value 
                      }))}
                    >
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Không làm</SelectItem>
                        <SelectItem value="full">Cả ngày</SelectItem>
                        <SelectItem value="half_morning">Nửa ngày sáng</SelectItem>
                        <SelectItem value="half_afternoon">Nửa ngày chiều</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Attendance Rules */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Quy tắc chấm công</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="late_threshold">Ngưỡng đi muộn (phút)</Label>
                  <Input
                    id="late_threshold"
                    type="number"
                    min="0"
                    value={formData.late_threshold_minutes}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      late_threshold_minutes: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="early_leave_threshold">Ngưỡng về sớm (phút)</Label>
                  <Input
                    id="early_leave_threshold"
                    type="number"
                    min="0"
                    value={formData.early_leave_threshold_minutes}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      early_leave_threshold_minutes: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overtime_start">Tăng ca sau (phút)</Label>
                  <Input
                    id="overtime_start"
                    type="number"
                    min="0"
                    value={formData.overtime_start_after_minutes}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      overtime_start_after_minutes: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.require_daily_start_checkin}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      require_daily_start_checkin: checked 
                    }))}
                  />
                  <Label>Bắt buộc check-in hàng ngày</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.require_daily_end_checkout}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      require_daily_end_checkout: checked 
                    }))}
                  />
                  <Label>Bắt buộc check-out hàng ngày</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.allow_multiple_checkins}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      allow_multiple_checkins: checked 
                    }))}
                  />
                  <Label>Cho phép check-in/out nhiều lần</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.weekend_work_allowed}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      weekend_work_allowed: checked 
                    }))}
                  />
                  <Label>Cho phép làm việc cuối tuần</Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* GPS Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <h3 className="text-lg font-medium">Cài đặt GPS</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.require_gps_check}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      require_gps_check: checked 
                    }))}
                  />
                  <Label>Yêu cầu kiểm tra GPS khi chấm công</Label>
                </div>

                {formData.require_gps_check && (
                  <div className="space-y-2">
                    <Label htmlFor="gps_radius">Bán kính cho phép (mét)</Label>
                    <Input
                      id="gps_radius"
                      type="number"
                      min="1"
                      value={formData.gps_radius_meters}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        gps_radius_meters: parseInt(e.target.value) || 100 
                      }))}
                      className="w-32"
                    />
                    <p className="text-sm text-gray-600">
                      Nhân viên chỉ có thể chấm công trong bán kính này
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button 
                onClick={handleSave}
                disabled={createSetting.isPending || updateSetting.isPending}
              >
                {createSetting.isPending || updateSetting.isPending 
                  ? 'Đang lưu...' 
                  : (editingId === 'new' ? 'Tạo cài đặt' : 'Cập nhật')
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Settings List */}
      <div className="grid gap-4">
        {settings?.map((setting) => (
          <Card key={setting.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-medium">{setting.name}</h3>
                    {setting.is_default && (
                      <Badge>Mặc định</Badge>
                    )}
                    <Badge variant="outline">{setting.status}</Badge>
                  </div>

                  {setting.description && (
                    <p className="text-gray-600 mb-4">{setting.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Giờ làm việc:</span>
                      <p>{setting.work_start_time} - {setting.work_end_time}</p>
                    </div>
                    <div>
                      <span className="font-medium">Ngưỡng muộn:</span>
                      <p>{setting.late_threshold_minutes} phút</p>
                    </div>
                    <div>
                      <span className="font-medium">GPS:</span>
                      <p>{setting.require_gps_check ? 'Bắt buộc' : 'Không'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Thứ 7:</span>
                      <p>{setting.saturday_work_enabled ? 'Cho phép' : 'Không'}</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(setting)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!settings || settings.length === 0) && !editingId && (
          <div className="text-center py-12 text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Chưa có cài đặt chấm công nào</p>
            <p className="text-sm">Tạo cài đặt đầu tiên để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
}
