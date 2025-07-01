
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useAttendanceSettings } from '@/hooks/useAttendanceSettings';
import { useAttendanceSettingsMutations } from '@/hooks/useAttendanceSettingsMutations';
import { useToast } from '@/hooks/use-toast';

interface ConfigForm {
  name: string;
  description: string;
  work_start_time: string;
  work_end_time: string;
  break_start_time: string;
  break_end_time: string;
  late_threshold_minutes: number;
  early_leave_threshold_minutes: number;
  overtime_start_after_minutes: number;
  weekend_work_allowed: boolean;
  require_gps_check: boolean;
  gps_radius_meters: number;
  saturday_work_enabled: boolean;
  saturday_work_type: string;
  require_daily_start_checkin: boolean;
  require_daily_end_checkout: boolean;
  allow_multiple_checkins: boolean;
  early_checkin_allowed_minutes: number;
  late_checkout_allowed_minutes: number;
  count_early_checkin_as_work: boolean;
  count_late_checkout_as_work: boolean;
}

export function AttendanceConfigurationManager() {
  const { data: settings, isLoading } = useAttendanceSettings();
  const { updateSettings, createSettings } = useAttendanceSettingsMutations();
  const { toast } = useToast();

  const defaultSettings = settings?.[0];
  
  const [formData, setFormData] = useState<ConfigForm>({
    name: defaultSettings?.name || 'Cài đặt chấm công mặc định',
    description: defaultSettings?.description || 'Cài đặt chấm công tiêu chuẩn cho văn phòng',
    work_start_time: defaultSettings?.work_start_time || '08:00',
    work_end_time: defaultSettings?.work_end_time || '17:00',
    break_start_time: defaultSettings?.break_start_time || '12:00',
    break_end_time: defaultSettings?.break_end_time || '13:00',
    late_threshold_minutes: defaultSettings?.late_threshold_minutes || 15,
    early_leave_threshold_minutes: defaultSettings?.early_leave_threshold_minutes || 15,
    overtime_start_after_minutes: defaultSettings?.overtime_start_after_minutes || 30,
    weekend_work_allowed: defaultSettings?.weekend_work_allowed || false,
    require_gps_check: defaultSettings?.require_gps_check || false,
    gps_radius_meters: defaultSettings?.gps_radius_meters || 100,
    saturday_work_enabled: defaultSettings?.saturday_work_enabled || true,
    saturday_work_type: defaultSettings?.saturday_work_type || 'half_morning',
    require_daily_start_checkin: defaultSettings?.require_daily_start_checkin ?? true,
    require_daily_end_checkout: defaultSettings?.require_daily_end_checkout ?? true,
    allow_multiple_checkins: defaultSettings?.allow_multiple_checkins || false,
    early_checkin_allowed_minutes: defaultSettings?.early_checkin_allowed_minutes || 15,
    late_checkout_allowed_minutes: defaultSettings?.late_checkout_allowed_minutes || 15,
    count_early_checkin_as_work: defaultSettings?.count_early_checkin_as_work || false,
    count_late_checkout_as_work: defaultSettings?.count_late_checkout_as_work || true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (defaultSettings) {
        await updateSettings.mutateAsync({
          id: defaultSettings.id,
          data: formData
        });
      } else {
        await createSettings.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Cấu hình chung hệ thống chấm công</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tên cài đặt</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thời gian làm việc */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Thời gian làm việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="work_start_time">Giờ bắt đầu</Label>
                <Input
                  id="work_start_time"
                  type="time"
                  value={formData.work_start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_start_time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="work_end_time">Giờ kết thúc</Label>
                <Input
                  id="work_end_time"
                  type="time"
                  value={formData.work_end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_end_time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="break_start_time">Giờ nghỉ trưa</Label>
                <Input
                  id="break_start_time"
                  type="time"
                  value={formData.break_start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, break_start_time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="break_end_time">Kết thúc nghỉ trưa</Label>
                <Input
                  id="break_end_time"
                  type="time"
                  value={formData.break_end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, break_end_time: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cài đặt chấm công */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt chấm công</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="late_threshold">Ngưỡng đi muộn (phút)</Label>
                <Input
                  id="late_threshold"
                  type="number"
                  value={formData.late_threshold_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, late_threshold_minutes: Number(e.target.value) }))}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="early_leave_threshold">Ngưỡng về sớm (phút)</Label>
                <Input
                  id="early_leave_threshold"
                  type="number"
                  value={formData.early_leave_threshold_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, early_leave_threshold_minutes: Number(e.target.value) }))}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="overtime_threshold">Bắt đầu tính OT sau (phút)</Label>
                <Input
                  id="overtime_threshold"
                  type="number"
                  value={formData.overtime_start_after_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, overtime_start_after_minutes: Number(e.target.value) }))}
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="require_daily_checkin">Bắt buộc check-in hằng ngày</Label>
                <Switch
                  id="require_daily_checkin"
                  checked={formData.require_daily_start_checkin}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, require_daily_start_checkin: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="require_daily_checkout">Bắt buộc check-out hằng ngày</Label>
                <Switch
                  id="require_daily_checkout"
                  checked={formData.require_daily_end_checkout}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, require_daily_end_checkout: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow_multiple_checkins">Cho phép check-in nhiều lần</Label>
                <Switch
                  id="allow_multiple_checkins"
                  checked={formData.allow_multiple_checkins}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allow_multiple_checkins: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cài đặt GPS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Cài đặt GPS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="require_gps">Bắt buộc kiểm tra GPS</Label>
              <Switch
                id="require_gps"
                checked={formData.require_gps_check}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, require_gps_check: checked }))}
              />
            </div>
            
            {formData.require_gps_check && (
              <div>
                <Label htmlFor="gps_radius">Bán kính GPS cho phép (mét)</Label>
                <Input
                  id="gps_radius"
                  type="number"
                  value={formData.gps_radius_meters}
                  onChange={(e) => setFormData(prev => ({ ...prev, gps_radius_meters: Number(e.target.value) }))}
                  min="10"
                  max="1000"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cài đặt cuối tuần */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt cuối tuần</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="weekend_work">Cho phép làm việc cuối tuần</Label>
              <Switch
                id="weekend_work"
                checked={formData.weekend_work_allowed}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, weekend_work_allowed: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="saturday_work">Cho phép làm việc thứ 7</Label>
              <Switch
                id="saturday_work"
                checked={formData.saturday_work_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, saturday_work_enabled: checked }))}
              />
            </div>

            {formData.saturday_work_enabled && (
              <div>
                <Label htmlFor="saturday_type">Loại hình làm việc thứ 7</Label>
                <Select
                  value={formData.saturday_work_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, saturday_work_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Không làm việc</SelectItem>
                    <SelectItem value="full">Cả ngày</SelectItem>
                    <SelectItem value="half_morning">Nửa ngày sáng</SelectItem>
                    <SelectItem value="half_afternoon">Nửa ngày chiều</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateSettings.isPending || createSettings.isPending}
            className="min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </div>
  );
}
