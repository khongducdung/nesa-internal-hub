
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Download, Edit, Plus, Calendar, Filter, Users, Clock } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceForm } from '../AttendanceForm';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: attendance = [], isLoading } = useAttendance(selectedDate);

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all'; // Sẽ implement sau khi có department data
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Có mặt</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Vắng mặt</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Đi muộn</Badge>;
      case 'half_day':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Nửa ngày</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Không xác định</Badge>;
    }
  };

  const exportToExcel = () => {
    console.log('Xuất Excel cho ngày:', selectedDate);
    // Logic xuất Excel sẽ được implement sau
  };

  const calculateWorkingHours = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return '-';
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    return `${hours.toFixed(1)}h`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header với thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số bản ghi</p>
                <p className="text-2xl font-bold text-gray-900">{filteredAttendance.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Có mặt</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAttendance.filter(r => r.status === 'present').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đi muộn</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredAttendance.filter(r => r.status === 'late').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vắng mặt</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredAttendance.filter(r => r.status === 'absent').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Danh sách chấm công</span>
              <Badge variant="outline" className="ml-2">
                {format(new Date(selectedDate), 'dd/MM/yyyy', { locale: vi })}
              </Badge>
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
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
          {/* Filters Section */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tìm kiếm</label>
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
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ngày</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Trạng thái</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
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
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phòng ban</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phòng ban</SelectItem>
                    <SelectItem value="dev">Phát triển</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="hr">Nhân sự</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Nhân viên</TableHead>
                  <TableHead className="font-semibold">Ngày</TableHead>
                  <TableHead className="font-semibold">Giờ vào</TableHead>
                  <TableHead className="font-semibold">Giờ ra</TableHead>
                  <TableHead className="font-semibold">Giờ làm</TableHead>
                  <TableHead className="font-semibold">Tăng ca</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold">Ghi chú</TableHead>
                  <TableHead className="text-right font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            {record.employee_name.charAt(0)}
                          </span>
                        </div>
                        <span>{record.employee_name}</span>
                      </div>
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
                      {calculateWorkingHours(record.check_in_time, record.check_out_time)}
                    </TableCell>
                    <TableCell>
                      <span className="text-orange-600 font-medium">
                        {record.overtime_hours || 0}h
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record.status || 'present')}
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 text-sm">
                        {record.notes || '-'}
                      </span>
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
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="h-8 w-8 text-gray-400" />
                        <span className="text-gray-500">Không có dữ liệu chấm công</span>
                        <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm bản ghi đầu tiên
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
