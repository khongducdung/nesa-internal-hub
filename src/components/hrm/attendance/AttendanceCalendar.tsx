
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceForm } from '../AttendanceForm';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function AttendanceCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const { data: attendance } = useAttendance(format(selectedDate, 'yyyy-MM-dd'));

  const getAttendanceForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return attendance?.filter(record => record.date === dateStr) || [];
  };

  const getDateStatus = (date: Date) => {
    const records = getAttendanceForDate(date);
    if (records.length === 0) return 'none';
    
    const hasLate = records.some(r => r.status === 'late');
    const hasAbsent = records.some(r => r.status === 'absent');
    
    if (hasAbsent) return 'absent';
    if (hasLate) return 'late';
    return 'present';
  };

  const modifiers = {
    present: (date: Date) => getDateStatus(date) === 'present',
    late: (date: Date) => getDateStatus(date) === 'late',
    absent: (date: Date) => getDateStatus(date) === 'absent',
  };

  const modifiersStyles = {
    present: { backgroundColor: '#dcfce7', color: '#166534' },
    late: { backgroundColor: '#fef3c7', color: '#92400e' },
    absent: { backgroundColor: '#fecaca', color: '#991b1b' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Lịch chấm công</span>
            </CardTitle>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button>Thêm chấm công</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm bản ghi chấm công</DialogTitle>
                </DialogHeader>
                <AttendanceForm 
                  onClose={() => setShowForm(false)}
                  selectedDate={format(selectedDate, 'yyyy-MM-dd')}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            locale={vi}
            className="rounded-md border"
          />
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Có mặt</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-200 rounded"></div>
              <span>Đi muộn</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>Vắng mặt</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Chi tiết ngày {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getAttendanceForDate(selectedDate).length > 0 ? (
              getAttendanceForDate(selectedDate).map((record) => (
                <div key={record.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{record.employee_name}</span>
                    <Badge variant={
                      record.status === 'present' ? 'default' :
                      record.status === 'late' ? 'secondary' :
                      record.status === 'absent' ? 'destructive' : 'outline'
                    }>
                      {record.status === 'present' ? 'Có mặt' :
                       record.status === 'late' ? 'Đi muộn' :
                       record.status === 'absent' ? 'Vắng mặt' : 'Khác'}
                    </Badge>
                  </div>
                  {record.check_in_time && (
                    <p className="text-sm text-gray-600">
                      Vào: {new Date(record.check_in_time).toLocaleTimeString('vi-VN')}
                    </p>
                  )}
                  {record.check_out_time && (
                    <p className="text-sm text-gray-600">
                      Ra: {new Date(record.check_out_time).toLocaleTimeString('vi-VN')}
                    </p>
                  )}
                  {record.overtime_hours && record.overtime_hours > 0 && (
                    <p className="text-sm text-gray-600">
                      Tăng ca: {record.overtime_hours}h
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Chưa có dữ liệu chấm công</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
