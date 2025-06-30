
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
import { useEmployees, useEmployeeStats } from '@/hooks/useEmployees';
import { useAttendance } from '@/hooks/useAttendance';
import { format } from 'date-fns';

export default function HRM() {
  const [activeTab, setActiveTab] = useState('employees');
  const { data: employees = [], isLoading: isLoadingEmployees, error: employeesError } = useEmployees();
  const { data: stats, isLoading: isLoadingStats } = useEmployeeStats();
  const { data: attendanceData = [], isLoading: isLoadingAttendance } = useAttendance();

  console.log('HRM Component - Current data:', { employees, stats, attendanceData });

  const hrStats = [
    {
      title: 'Tổng nhân viên',
      value: stats?.totalEmployees?.toString() || '0',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12',
      changeType: 'increase'
    },
    {
      title: 'Nhân viên mới',
      value: stats?.newEmployees?.toString() || '0',
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Phòng ban',
      value: stats?.activeDepartments?.toString() || '0',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      change: '+1',
      changeType: 'increase'
    },
    {
      title: 'Có mặt hôm nay',
      value: stats?.presentToday?.toString() || '0',
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

  if (employeesError) {
    console.error('Error in HRM component:', employeesError);
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-6 max-w-md">
            <CardContent>
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h2>
                <p className="text-gray-600">
                  Không thể tải dữ liệu nhân sự. Vui lòng thử lại sau.
                </p>
                <p className="text-sm text-red-500 mt-2">
                  {employeesError.message}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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
                        {isLoadingStats ? '...' : stat.value}
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
                {isLoadingEmployees ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có nhân viên nào trong hệ thống</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {employees.map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {employee.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{employee.full_name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {employee.employee_code}
                              </Badge>
                              {getLevelBadge(employee.employee_level || 'level_3')}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {employee.positions?.name || 'Chưa xác định'} - {employee.departments?.name || 'Chưa xác định'}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{employee.email}</span>
                              </div>
                              {employee.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{employee.phone}</span>
                                </div>
                              )}
                              {employee.hire_date && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Vào làm: {format(new Date(employee.hire_date), 'dd/MM/yyyy')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(employee.work_status || 'active')}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <Input type="date" className="w-40" defaultValue={new Date().toISOString().split('T')[0]} />
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Lọc
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingAttendance ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Đang tải dữ liệu chấm công...</span>
                  </div>
                ) : attendanceData.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có dữ liệu chấm công cho ngày hôm nay</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attendanceData.map((attendance) => (
                      <div key={attendance.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {attendance.employee_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{attendance.employee_name}</h3>
                            <p className="text-sm text-gray-600">{format(new Date(attendance.date), 'dd/MM/yyyy')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Vào</p>
                            <p className="font-semibold text-gray-900">
                              {attendance.check_in_time ? format(new Date(attendance.check_in_time), 'HH:mm') : '--:--'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Ra</p>
                            <p className="font-semibold text-gray-900">
                              {attendance.check_out_time ? format(new Date(attendance.check_out_time), 'HH:mm') : '--:--'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Tăng ca</p>
                            <p className="font-semibold text-gray-900">
                              {attendance.overtime_hours}h
                            </p>
                          </div>
                          {getAttendanceStatusBadge(attendance.status || 'present')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
