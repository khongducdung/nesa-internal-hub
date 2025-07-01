
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, BarChart3, FileText, Calendar } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { formatDate, formatNumber } from '@/utils/formatters';

export function AttendanceReports() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [reportType, setReportType] = useState('summary');

  const { data: employees = [] } = useEmployees();

  // Mock data cho demo - trong thực tế sẽ query từ database
  const mockReportData = [
    {
      employeeId: '1',
      employeeName: 'Nguyễn Văn A',
      totalDays: 22,
      presentDays: 20,
      lateDays: 2,
      absentDays: 0,
      overtimeHours: 15.5,
      attendanceRate: 95.5
    },
    {
      employeeId: '2',
      employeeName: 'Trần Thị B',
      totalDays: 22,
      presentDays: 21,
      lateDays: 1,
      absentDays: 0,
      overtimeHours: 8.0,
      attendanceRate: 100
    }
  ];

  const exportReport = (type: 'excel' | 'pdf') => {
    console.log(`Xuất báo cáo ${type} từ`, dateRange?.from, 'đến', dateRange?.to);
    // Logic xuất báo cáo
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Báo cáo chấm công</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhân viên</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DatePickerWithRange 
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="Chọn khoảng thời gian"
            />

            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Loại báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Tổng hợp</SelectItem>
                <SelectItem value="detailed">Chi tiết</SelectItem>
                <SelectItem value="overtime">Tăng ca</SelectItem>
                <SelectItem value="late">Đi muộn</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button onClick={() => exportReport('excel')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button onClick={() => exportReport('pdf')} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Báo cáo tổng hợp - {dateRange?.from && formatDate(dateRange.from.toISOString())} 
            {dateRange?.to && ` đến ${formatDate(dateRange.to.toISOString())}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead className="text-center">Tổng ngày</TableHead>
                  <TableHead className="text-center">Có mặt</TableHead>
                  <TableHead className="text-center">Đi muộn</TableHead>
                  <TableHead className="text-center">Vắng mặt</TableHead>
                  <TableHead className="text-center">Tăng ca (h)</TableHead>
                  <TableHead className="text-center">Tỷ lệ (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReportData.map((record) => (
                  <TableRow key={record.employeeId}>
                    <TableCell className="font-medium">
                      {record.employeeName}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatNumber(record.totalDays)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-800">
                        {formatNumber(record.presentDays)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {formatNumber(record.lateDays)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-red-100 text-red-800">
                        {formatNumber(record.absentDays)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {formatNumber(record.overtimeHours)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={record.attendanceRate >= 95 ? 'default' : 'secondary'}>
                        {formatNumber(record.attendanceRate)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(45)}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trung bình có mặt</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(97.8)}%</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng giờ tăng ca</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(156.5)}h</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đi muộn/tháng</p>
                <p className="text-2xl font-bold text-red-600">{formatNumber(12)}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
