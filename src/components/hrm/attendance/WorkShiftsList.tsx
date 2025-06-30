
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Clock, Calendar, Users, Settings as SettingsIcon } from 'lucide-react';
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { WorkShiftForm } from './WorkShiftForm';
import { CheckinConfigDialog } from './CheckinConfigDialog';

const daysOfWeekMap = {
  0: 'CN',
  1: 'T2',
  2: 'T3', 
  3: 'T4',
  4: 'T5',
  5: 'T6',
  6: 'T7'
};

export function WorkShiftsList() {
  const { data: shifts, isLoading } = useWorkShifts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingShift, setEditingShift] = useState<any>(null);

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
            <h2 className="text-lg font-semibold text-gray-900">Ca làm việc có sẵn</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý các ca làm việc trong công ty</p>
          </div>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tạo ca làm việc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo ca làm việc mới</DialogTitle>
              </DialogHeader>
              <WorkShiftForm onClose={() => setShowCreateForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {shifts?.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có ca làm việc nào</h3>
            <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
              Tạo ca làm việc đầu tiên để bắt đầu quản lý chấm công cho nhân viên
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo ca làm việc đầu tiên
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-medium text-gray-700">Tên ca làm việc</TableHead>
                <TableHead className="font-medium text-gray-700">Thời gian</TableHead>
                <TableHead className="font-medium text-gray-700">Nghỉ trưa</TableHead>
                <TableHead className="font-medium text-gray-700">Ngày làm việc</TableHead>
                <TableHead className="font-medium text-gray-700">Cài đặt chấm công</TableHead>
                <TableHead className="font-medium text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-medium text-gray-700 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts?.map((shift) => (
                <TableRow key={shift.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {shift.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{shift.start_time} - {shift.end_time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{shift.break_duration_minutes} phút</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {shift.days_of_week.slice(0, 3).map((day) => (
                        <Badge key={day} variant="outline" className="text-xs px-2 py-0.5 border-gray-200">
                          {daysOfWeekMap[day as keyof typeof daysOfWeekMap]}
                        </Badge>
                      ))}
                      {shift.days_of_week.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5 border-gray-200">
                          +{shift.days_of_week.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {shift.attendance_settings ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {shift.attendance_settings.name}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Chưa cài đặt</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={shift.is_active ? 'default' : 'secondary'}
                      className={shift.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                    >
                      {shift.is_active ? 'Hoạt động' : 'Ngưng hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {shift.attendance_settings && (
                        <CheckinConfigDialog
                          settingId={shift.attendance_settings.id}
                          settingName={shift.attendance_settings.name}
                          trigger={
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <SettingsIcon className="h-4 w-4" />
                            </Button>
                          }
                        />
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditingShift(shift)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa ca làm việc</DialogTitle>
                          </DialogHeader>
                          <WorkShiftForm 
                            editingShift={editingShift}
                            onClose={() => setEditingShift(null)} 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
