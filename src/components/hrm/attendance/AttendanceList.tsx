
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Download, Edit, Plus, Calendar } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceForm } from '../AttendanceForm';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: attendance = [], isLoading } = useAttendance(selectedDate);

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const exportToExcel = () => {
    // Logic xuất Excel sẽ được implement sau
    console.log('Xuất Excel cho ngày:', selectedDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Danh sách chấm công</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button onClick={exportToExcel} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm bản ghi chấm công</DialogTitle>
                </DialogHeader>
                <AttendanceForm 
                  onClose={() => setShowAddForm(false)}
                  selectedDate={selectedDate}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="present">Có mặt</SelectItem>
              <SelectItem value="late">Đi muộn</SelectItem>
              <SelectItem value="absent">Vắng mặt</SelectItem>
              <SelectItem value="half_day">Nửa ngày</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ vào</TableHead>
                <TableHead>Giờ ra</TableHead>
                <TableHead>Tăng ca (h)</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.employee_name}
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.date), 'dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell>
                    {record.check_in_time 
                      ? new Date(record.check_in_time).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {record.check_out_time 
                      ? new Date(record.check_out_time).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {record.overtime_hours || 0}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(record.status || 'present')}
                  </TableCell>
                  <TableCell>
                    {record.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog 
                      open={editingRecord === record.id} 
                      onOpenChange={(open) => setEditingRecord(open ? record.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Chỉnh sửa chấm công</DialogTitle>
                        </DialogHeader>
                        <AttendanceForm 
                          onClose={() => setEditingRecord(null)}
                          attendanceId={record.id}
                        />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAttendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Không có dữ liệu chấm công
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
