
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Settings, Clock, MapPin, Star } from 'lucide-react';
import { useAttendanceSettings, useDeleteAttendanceSetting } from '@/hooks/useAttendanceSettings';
import { AttendanceSettingsForm } from './AttendanceSettingsForm';
import { CheckinConfigDialog } from './CheckinConfigDialog';

export function AttendanceSettingsList() {
  const { data: settings, isLoading } = useAttendanceSettings();
  const deleteMutation = useDeleteAttendanceSetting();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cài đặt này?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Cài đặt chấm công</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý các cấu hình chấm công của công ty</p>
          </div>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tạo cài đặt mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo cài đặt chấm công mới</DialogTitle>
              </DialogHeader>
              <AttendanceSettingsForm onClose={() => setShowCreateForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {settings?.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có cài đặt nào</h3>
            <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
              Tạo cài đặt chấm công đầu tiên để bắt đầu quản lý
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo cài đặt đầu tiên
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-medium text-gray-700">Tên cài đặt</TableHead>
                <TableHead className="font-medium text-gray-700">Thời gian làm việc</TableHead>
                <TableHead className="font-medium text-gray-700">Cấu hình</TableHead>
                <TableHead className="font-medium text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-medium text-gray-700 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings?.map((setting) => (
                <TableRow key={setting.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{setting.name}</span>
                          {setting.is_default && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Mặc định
                            </Badge>
                          )}
                        </div>
                        {setting.description && (
                          <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{setting.work_start_time} - {setting.work_end_time}</span>
                    </div>
                    {setting.break_start_time && setting.break_end_time && (
                      <div className="text-xs text-gray-500 mt-1">
                        Nghỉ: {setting.break_start_time} - {setting.break_end_time}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs border-gray-200">
                        {setting.check_type_config === 'daily' ? 'Chấm công hàng ngày' : 
                         setting.check_type_config === 'shift' ? 'Chấm công theo ca' : 'Cả hai'}
                      </Badge>
                      {setting.require_gps_check && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>GPS ({setting.gps_radius_meters}m)</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={setting.status === 'active' ? 'default' : 'secondary'}
                      className={setting.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                    >
                      {setting.status === 'active' ? 'Hoạt động' : 'Ngưng hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <CheckinConfigDialog
                        settingId={setting.id}
                        settingName={setting.name}
                        trigger={
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditingSetting(setting)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa cài đặt chấm công</DialogTitle>
                          </DialogHeader>
                          <AttendanceSettingsForm 
                            editingSetting={editingSetting}
                            onClose={() => setEditingSetting(null)} 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(setting.id)}
                        disabled={setting.is_default || deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
