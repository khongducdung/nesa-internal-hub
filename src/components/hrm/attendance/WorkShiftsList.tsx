
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Clock, Calendar, Users, Building2 } from 'lucide-react';
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { WorkShiftForm } from './WorkShiftForm';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Ca làm việc có sẵn</h3>
          <p className="text-sm text-gray-500 mt-1">Quản lý các ca làm việc trong công ty</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Tạo ca làm việc
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo ca làm việc mới</DialogTitle>
            </DialogHeader>
            <WorkShiftForm onClose={() => setShowCreateForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {shifts?.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có ca làm việc nào</h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              Tạo ca làm việc đầu tiên để bắt đầu quản lý chấm công cho nhân viên
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo ca làm việc đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shifts?.map((shift) => (
            <Card key={shift.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium text-gray-900 mb-1">
                      {shift.name}
                    </CardTitle>
                    <Badge 
                      variant={shift.is_active ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {shift.is_active ? 'Hoạt động' : 'Ngưng hoạt động'}
                    </Badge>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => setEditingShift(shift)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Chỉnh sửa ca làm việc</DialogTitle>
                        </DialogHeader>
                        <WorkShiftForm 
                          editingShift={editingShift}
                          onClose={() => {
                            setEditingShift(null);
                          }} 
                        />
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{shift.start_time} - {shift.end_time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Nghỉ trưa: {shift.break_duration_minutes} phút</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Ngày làm việc:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {shift.days_of_week.map((day) => (
                      <Badge key={day} variant="outline" className="text-xs px-2 py-0.5">
                        {daysOfWeekMap[day as keyof typeof daysOfWeekMap]}
                      </Badge>
                    ))}
                  </div>
                </div>

                {shift.attendance_settings && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Building2 className="h-3 w-3" />
                      <span>Cài đặt: {shift.attendance_settings.name}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
