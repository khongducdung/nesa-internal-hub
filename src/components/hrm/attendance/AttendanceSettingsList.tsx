
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Clock, MapPin, Shield } from 'lucide-react';
import { useAttendanceSettings, useDeleteAttendanceSetting } from '@/hooks/useAttendanceSettings';
import { AttendanceSettingsForm } from './AttendanceSettingsForm';

export function AttendanceSettingsList() {
  const { data: settings, isLoading } = useAttendanceSettings();
  const deleteSetting = useDeleteAttendanceSetting();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa cài đặt này?')) {
      await deleteSetting.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cài đặt chấm công</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm cài đặt
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings?.map((setting) => (
          <Card key={setting.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base flex items-center gap-2">
                  {setting.name}
                  {setting.is_default && (
                    <Badge variant="secondary" className="text-xs">Mặc định</Badge>
                  )}
                </CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(setting.id)}
                    disabled={setting.is_default}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{setting.work_start_time} - {setting.work_end_time}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Đi muộn:</span>
                  <div>{setting.late_threshold_minutes} phút</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Về sớm:</span>
                  <div>{setting.early_leave_threshold_minutes} phút</div>
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
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AttendanceSettingsForm 
        open={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </div>
  );
}
