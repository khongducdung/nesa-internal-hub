
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Clock, MapPin, Shield, Settings } from 'lucide-react';
import { useAttendanceSettings, useDeleteAttendanceSetting } from '@/hooks/useAttendanceSettings';
import { AttendanceSettingsForm } from './AttendanceSettingsForm';
import { CheckinConfigDialog } from './CheckinConfigDialog';

export function AttendanceSettingsList() {
  const { data: settings, isLoading } = useAttendanceSettings();
  const deleteSetting = useDeleteAttendanceSetting();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa cài đặt này?')) {
      await deleteSetting.mutateAsync(id);
    }
  };

  const getCheckTypeLabel = (checkType: string) => {
    switch (checkType) {
      case 'daily':
        return { label: 'Theo ngày', color: 'bg-green-100 text-green-800' };
      case 'shift':
        return { label: 'Theo ca', color: 'bg-blue-100 text-blue-800' };
      case 'both':
        return { label: 'Kết hợp', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Theo ngày', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Cài đặt chấm công</h3>
          <p className="text-sm text-gray-500 mt-1">Quản lý các cấu hình chấm công trong hệ thống</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm cài đặt
        </Button>
      </div>

      {settings?.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có cài đặt nào</h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              Tạo cài đặt chấm công đầu tiên để bắt đầu quản lý
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo cài đặt đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings?.map((setting) => {
            const checkTypeInfo = getCheckTypeLabel(setting.check_type_config || 'daily');
            
            return (
              <Card key={setting.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium text-gray-900 mb-2">
                        {setting.name}
                      </CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge 
                          variant={setting.is_default ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {setting.is_default ? 'Mặc định' : 'Tùy chỉnh'}
                        </Badge>
                        <Badge 
                          className={`text-xs ${checkTypeInfo.color}`}
                          variant="outline"
                        >
                          {checkTypeInfo.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <CheckinConfigDialog
                        settingId={setting.id}
                        settingName={setting.name}
                        initialData={{
                          check_type_config: setting.check_type_config,
                          require_shift_start_checkin: setting.require_shift_start_checkin,
                          require_shift_start_checkout: setting.require_shift_start_checkout,
                          require_shift_end_checkin: setting.require_shift_end_checkin,
                          require_shift_end_checkout: setting.require_shift_end_checkout,
                          require_daily_start_checkin: setting.require_daily_start_checkin,
                          require_daily_end_checkout: setting.require_daily_end_checkout,
                          allow_multiple_checkins: setting.allow_multiple_checkins,
                        }}
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(setting.id)}
                        disabled={setting.is_default}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {setting.work_start_time} - {setting.work_end_time}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Đi muộn:</span>
                      <div className="font-medium">{setting.late_threshold_minutes} phút</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Về sớm:</span>
                      <div className="font-medium">{setting.early_leave_threshold_minutes} phút</div>
                    </div>
                  </div>

                  {setting.require_gps_check && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>GPS: {setting.gps_radius_meters}m</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <Badge variant={setting.status === 'active' ? 'default' : 'secondary'}>
                      {setting.status === 'active' ? 'Hoạt động' : 'Ngưng'}
                    </Badge>
                    {setting.weekend_work_allowed && (
                      <Badge variant="outline" className="text-xs">Cuối tuần</Badge>
                    )}
                  </div>

                  {setting.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {setting.description}
                    </p>
                  )}

                  {/* Hiển thị cấu hình checkin */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Cấu hình chấm công:</div>
                    <div className="flex flex-wrap gap-1">
                      {setting.require_daily_start_checkin && (
                        <Badge variant="outline" className="text-xs">Checkin ngày</Badge>
                      )}
                      {setting.require_daily_end_checkout && (
                        <Badge variant="outline" className="text-xs">Checkout ngày</Badge>
                      )}
                      {setting.require_shift_start_checkin && (
                        <Badge variant="outline" className="text-xs">Checkin đầu ca</Badge>
                      )}
                      {setting.require_shift_end_checkout && (
                        <Badge variant="outline" className="text-xs">Checkout cuối ca</Badge>
                      )}
                      {setting.allow_multiple_checkins && (
                        <Badge variant="outline" className="text-xs">Nhiều lần</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AttendanceSettingsForm 
        open={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </div>
  );
}
