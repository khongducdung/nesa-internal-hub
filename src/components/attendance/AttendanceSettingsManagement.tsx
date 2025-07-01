
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, MapPin, Clock, Save } from 'lucide-react';

export function AttendanceSettingsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Cài đặt máy chấm công</h2>
        <p className="text-gray-600">Thiết lập cấu hình hệ thống chấm công</p>
      </div>

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
                <Input id="work-start" type="time" defaultValue="08:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work-end">Giờ kết thúc làm việc</Label>
                <Input id="work-end" type="time" defaultValue="17:00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="break-start">Giờ bắt đầu nghỉ trưa</Label>
                <Input id="break-start" type="time" defaultValue="12:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="break-end">Giờ kết thúc nghỉ trưa</Label>
                <Input id="break-end" type="time" defaultValue="13:00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="late-threshold">Ngưỡng đi muộn (phút)</Label>
              <Input id="late-threshold" type="number" defaultValue="15" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="early-leave">Ngưỡng về sớm (phút)</Label>
              <Input id="early-leave" type="number" defaultValue="15" />
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
              <Switch defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gps-radius">Bán kính cho phép (mét)</Label>
              <Input id="gps-radius" type="number" defaultValue="100" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cho phép làm việc cuối tuần</Label>
                <p className="text-sm text-gray-600">Nhân viên có thể chấm công vào T7, CN</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cho phép nhiều lần check-in</Label>
                <p className="text-sm text-gray-600">Nhân viên có thể check-in/out nhiều lần</p>
              </div>
              <Switch />
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
              <Input id="overtime-threshold" type="number" defaultValue="0" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Yêu cầu phê duyệt chấm công</Label>
                <p className="text-sm text-gray-600">Cần manager xác nhận chấm công</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Check-in tự động khi vào app</Label>
                <p className="text-sm text-gray-600">Tự động check-in khi mở ứng dụng</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Lưu cài đặt
        </Button>
      </div>
    </div>
  );
}
