
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, MapPin, Clock, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAttendanceSettings, useAttendanceSettingMutations } from '@/hooks/useAttendanceSettings';
import { useToast } from '@/components/ui/use-toast';

interface SettingsFormData {
  work_start_time: string;
  work_end_time: string;
  break_start_time: string;
  break_end_time: string;
  late_threshold_minutes: number;
  early_leave_threshold_minutes: number;
  overtime_start_after_minutes: number;
  require_gps_check: boolean;
  gps_radius_meters: number;
  weekend_work_allowed: boolean;
  allow_multiple_checkins: boolean;
  require_daily_start_checkin: boolean;
  require_daily_end_checkout: boolean;
}

export function AttendanceSettingsManagement() {
  const { data: settings, isLoading } = useAttendanceSettings();
  const { createSetting } = useAttendanceSettingMutations();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const defaultSetting = settings?.find(s => s.is_default) || settings?.[0];

  const { register, handleSubmit, watch, setValue } = useForm<SettingsFormData>({
    defaultValues: {
      work_start_time: defaultSetting?.work_start_time || '08:00',
      work_end_time: defaultSetting?.work_end_time || '17:00',
      break_start_time: defaultSetting?.break_start_time || '12:00',
      break_end_time: defaultSetting?.break_end_time || '13:00',
      late_threshold_minutes: defaultSetting?.late_threshold_minutes || 15,
      early_leave_threshold_minutes: defaultSetting?.early_leave_threshold_minutes || 15,
      overtime_start_after_minutes: defaultSetting?.overtime_start_after_minutes || 0,
      require_gps_check: defaultSetting?.require_gps_check || false,
      gps_radius_meters: defaultSetting?.gps_radius_meters || 100,
      weekend_work_allowed: defaultSetting?.weekend_work_allowed || false,
      allow_multiple_checkins: defaultSetting?.allow_multiple_checkins || false,
      require_daily_start_checkin: defaultSetting?.require_daily_start_checkin || true,
      require_daily_end_checkout: defaultSetting?.require_daily_end_checkout || true,
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      await createSetting.mutateAsync({
        name: 'Cài đặt chấm công cập nhật',
        description: 'Cài đặt được cập nhật từ giao diện quản lý',
        ...data,
        status: 'active',
        is_default: true,
        created_by: '00000000-0000-0000-0000-000000000000' // Should be current user ID
      });

      toast({
        title: 'Thành công',
        description: 'Đã lưu cài đặt chấm công'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải cài đặt...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Cài đặt máy chấm công</h2>
        <p className="text-gray-600">Thiết lập cấu hình hệ thống chấm công</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Cài đặt thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work-start">Giờ bắt đầu làm việc</Label>
                  <Input 
                    id="work-start" 
                    type="time" 
                    {...register('work_start_time')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work-end">Giờ kết thúc làm việc</Label>
                  <Input 
                    id="work-end" 
                    type="time" 
                    {...register('work_end_time')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="break-start">Giờ bắt đầu nghỉ trưa</Label>
                  <Input 
                    id="break-start" 
                    type="time" 
                    {...register('break_start_time')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-end">Giờ kết thúc nghỉ trưa</Label>
                  <Input 
                    id="break-end" 
                    type="time" 
                    {...register('break_end_time')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="late-threshold">Ngưỡng đi muộn (phút)</Label>
                <Input 
                  id="late-threshold" 
                  type="number" 
                  {...register('late_threshold_minutes', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="early-leave">Ngưỡng về sớm (phút)</Label>
                <Input 
                  id="early-leave" 
                  type="number" 
                  {...register('early_leave_threshold_minutes', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Cài đặt GPS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yêu cầu kiểm tra GPS</Label>
                  <p className="text-sm text-gray-600">Bắt buộc chấm công tại vị trí cho phép</p>
                </div>
                <Switch 
                  checked={watch('require_gps_check')}
                  onCheckedChange={(checked) => setValue('require_gps_check', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gps-radius">Bán kính cho phép (mét)</Label>
                <Input 
                  id="gps-radius" 
                  type="number" 
                  {...register('gps_radius_meters', { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cho phép làm việc cuối tuần</Label>
                  <p className="text-sm text-gray-600">Nhân viên có thể chấm công vào T7, CN</p>
                </div>
                <Switch 
                  checked={watch('weekend_work_allowed')}
                  onCheckedChange={(checked) => setValue('weekend_work_allowed', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cho phép nhiều lần check-in</Label>
                  <p className="text-sm text-gray-600">Nhân viên có thể check-in/out nhiều lần</p>
                </div>
                <Switch 
                  checked={watch('allow_multiple_checkins')}
                  onCheckedChange={(checked) => setValue('allow_multiple_checkins', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cài đặt khác
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="overtime-threshold">Tăng ca sau (phút)</Label>
                <Input 
                  id="overtime-threshold" 
                  type="number" 
                  {...register('overtime_start_after_minutes', { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yêu cầu check-in hàng ngày</Label>
                  <p className="text-sm text-gray-600">Bắt buộc check-in mỗi ngày làm việc</p>
                </div>
                <Switch 
                  checked={watch('require_daily_start_checkin')}
                  onCheckedChange={(checked) => setValue('require_daily_start_checkin', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yêu cầu check-out hàng ngày</Label>
                  <p className="text-sm text-gray-600">Bắt buộc check-out khi kết thúc ngày</p>
                </div>
                <Switch 
                  checked={watch('require_daily_end_checkout')}
                  onCheckedChange={(checked) => setValue('require_daily_end_checkout', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" className="flex items-center gap-2" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
        </div>
      </form>
    </div>
  );
}
