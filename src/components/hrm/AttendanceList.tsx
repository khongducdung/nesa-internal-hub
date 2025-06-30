
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useAttendance } from '@/hooks/useAttendance';

export function AttendanceList() {
  const { data: attendance, isLoading } = useAttendance();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Có mặt</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Vắng mặt</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Đi muộn</Badge>;
      case 'half_day':
        return <Badge className="bg-blue-100 text-blue-800">Nửa ngày</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {attendance?.map((record) => (
        <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold">{record.employee_name}</h3>
                {getStatusBadge(record.status || 'present')}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Ngày: {new Date(record.date).toLocaleDateString('vi-VN')}</p>
                {record.check_in_time && (
                  <p>Giờ vào: {new Date(record.check_in_time).toLocaleTimeString('vi-VN')}</p>
                )}
                {record.check_out_time && (
                  <p>Giờ ra: {new Date(record.check_out_time).toLocaleTimeString('vi-VN')}</p>
                )}
                {record.overtime_hours && record.overtime_hours > 0 && (
                  <p>Giờ làm thêm: {record.overtime_hours} giờ</p>
                )}
                {record.notes && <p>Ghi chú: {record.notes}</p>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
