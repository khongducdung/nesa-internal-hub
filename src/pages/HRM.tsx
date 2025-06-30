
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  UserPlus,
  Building,
  Calendar,
  Phone,
  Mail,
  MapPin,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function HRM() {
  const [activeTab, setActiveTab] = useState('employees');

  // Mock data cho employees
  const employees = [
    {
      id: '1',
      employee_code: 'EMP001',
      full_name: 'Nguyễn Văn An',
      email: 'nguyenvanan@company.com',
      phone: '0901234567',
      department: 'Phòng Kỹ Thuật',
      position: 'Senior Developer',
      hire_date: '2023-01-15',
      work_status: 'active',
      avatar: 'A',
      employee_level: 'level_2'
    },
    {
      id: '2',
      employee_code: 'EMP002',
      full_name: 'Trần Thị Bình',
      email: 'tranthibinh@company.com',
      phone: '0901234568',
      department: 'Phòng Nhân Sự',
      position: 'HR Manager',
      hire_date: '2022-03-20',
      work_status: 'active',
      avatar: 'B',
      employee_level: 'level_2'
    },
    {
      id: '3',
      employee_code: 'EMP003',
      full_name: 'Lê Văn Công',
      email: 'levancong@company.com',
      phone: '0901234569',
      department: 'Phòng Kinh Doanh',
      position: 'Sales Executive',
      hire_date: '2023-08-10',
      work_status: 'active',
      avatar: 'C',
      employee_level: 'level_3'
    }
  ];

  // Mock data cho attendance
  const attendanceData = [
    {
      id: '1',
      employee_name: 'Nguyễn Văn An',
      date: '2024-01-15',
      check_in: '08:00',
      check_out: '17:30',
      status: 'present',
      overtime_hours: 0.5
    },
    {
      id: '2',
      employee_name: 'Trần Thị Bình',
      date: '2024-01-15',
      check_in: '08:15',
      check_out: '17:45',
      status: 'late',
      overtime_hours: 0
    },
    {
      id: '3',
      employee_name: 'Lê Văn Công',
      date: '2024-01-15',
      check_in: null,
      check_out: null,
      status: 'absent',
      overtime_hours: 0
    }
  ];

  const hrStats = [
    {
      title: 'Tổng nhân viên',
      value: '156',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12',
      changeType: 'increase'
    },
    {
      title: 'Nhân viên mới',
      value: '8',
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Phòng ban',
      value: '12',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      change: '+1',
      changeType: 'increase'
    },
    {
      title: 'Có mặt hôm nay',
      value: '142',
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      change: '+5',
      changeType: 'increase'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang làm việc</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Nghỉ việc</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Có mặt</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Trễ</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Vắng mặt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'level_1':
        return <Badge className="bg-red-100 text-red-800">Cấp 1</Badge>;
      case 'level_2':
        return <Badge className="bg-yellow-100 text-yellow-800">Cấp 2</Badge>;
      case 'level_3':
        return <Badge className="bg-green-100 text-green-800">Cấp 3</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân sự</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin nhân viên và chấm công</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm nhân viên
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hrStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 font-medium flex items-center">
                        {stat.change} so với tháng trước
                      </p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employees">Nhân viên</TabsTrigger>
            <TabsTrigger value="attendance">Chấm công</TabsTrigger>
            <TabsTrigger value="departments">Phòng ban</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">Danh sách nhân viên</CardTitle>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Tìm kiếm nhân viên..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Lọc
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{employee.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{employee.full_name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {employee.employee_code}
                            </Badge>
                            {getLevelBadge(employee.employee_level)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{employee.position} - {employee.department}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{employee.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{employee.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Vào làm: {new Date(employee.hire_date).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(employee.work_status)}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">Chấm công hôm nay</CardTitle>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Input type="date" className="w-40" />
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Lọc
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceData.map((attendance) => (
                    <div key={attendance.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{attendance.employee_name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{attendance.employee_name}</h3>
                          <p className="text-sm text-gray-600">{new Date(attendance.date).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Vào</p>
                          <p className="font-semibold text-gray-900">
                            {attendance.check_in || '--:--'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Ra</p>
                          <p className="font-semibold text-gray-900">
                            {attendance.check_out || '--:--'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Tăng ca</p>
                          <p className="font-semibold text-gray-900">
                            {attendance.overtime_hours}h
                          </p>
                        </div>
                        {getAttendanceStatusBadge(attendance.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">Phòng ban</CardTitle>
                  <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm phòng ban
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Ban Giám Đốc', employees: 3, description: 'Ban lãnh đạo công ty' },
                    { name: 'Phòng Nhân Sự', employees: 8, description: 'Quản lý nguồn nhân lực' },
                    { name: 'Phòng Kế Toán', employees: 12, description: 'Quản lý tài chính kế toán' },
                    { name: 'Phòng Kinh Doanh', employees: 25, description: 'Phát triển kinh doanh' },
                    { name: 'Phòng Kỹ Thuật', employees: 35, description: 'Phát triển sản phẩm kỹ thuật' },
                    { name: 'Phòng Marketing', employees: 15, description: 'Tiếp thị và truyền thông' }
                  ].map((dept, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-white" />
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">{dept.employees} NV</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                        <p className="text-sm text-gray-600">{dept.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
