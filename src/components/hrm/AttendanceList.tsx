
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Plus, Search, Edit, Calendar, User } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceForm } from './AttendanceForm';

export function AttendanceList() {
  const { data: attendance, isLoading } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  const filteredAttendance = attendance?.filter(record =>
    record.employees?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employees?.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'early_leave': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Có mặt';
      case 'absent': return 'Vắng mặt';
      case 'late': return 'Đi muộn';
      case 'early_leave': return 'Về sớm';
      default: return 'Chưa xác định';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Danh sách chấm công
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Danh sách chấm công ({attendance?.length || 0})
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm chấm công
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm bản ghi chấm công</DialogTitle>
              </DialogHeader>
              <AttendanceForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredAttendance?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Không tìm thấy bản ghi chấm công nào' : 'Chưa có bản ghi chấm công nào'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAttendance?.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-gray-400" />
                        <div>
                          <h3 className="font-semibold">{record.employees?.full_name || 'N/A'}</h3>
                          <p className="text-sm text-gray-600">{record.employees?.employee_code || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">{new Date(record.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditingAttendance(record)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa chấm công</DialogTitle>
                          </DialogHeader>
                          <AttendanceForm 
                            attendanceId={editingAttendance?.id} 
                            onClose={() => setEditingAttendance(null)} 
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Giờ vào:</span>
                      <div className="font-medium">
                        {record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString('vi-VN') : '--:--'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Giờ ra:</span>
                      <div className="font-medium">
                        {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString('vi-VN') : '--:--'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Nghỉ:</span>
                      <div className="font-medium">{record.break_time || 0} phút</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Tăng ca:</span>
                      <div className="font-medium">{record.overtime_hours || 0} giờ</div>
                    </div>
                  </div>
                  
                  {record.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-gray-500 text-sm">Ghi chú:</span>
                      <p className="text-sm mt-1">{record.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
