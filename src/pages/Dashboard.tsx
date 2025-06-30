import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Zap,
  Workflow,
  TrendingUp,
  FileText,
  Briefcase,
  Clock,
  GraduationCap,
  BarChart4,
  ListChecks,
  Calendar,
  User2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { useProcesses } from '@/hooks/useProcesses';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [processCount, setProcessCount] = useState(0);
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(0);
  const [newHiresCount, setNewHiresCount] = useState(0);

  const { data: employees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: processes } = useProcesses();

  useEffect(() => {
    if (employees) {
      setEmployeeCount(employees.length);
      setActiveEmployeeCount(employees.filter(e => e.work_status === 'active').length);
      setNewHiresCount(employees.filter(e => {
        const hireDate = new Date(e.hire_date || '');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return hireDate > thirtyDaysAgo;
      }).length);
    }
    if (departments) {
      setDepartmentCount(departments.length);
    }
    if (processes) {
      setProcessCount(processes.length);
    }
  }, [employees, departments, processes]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
            <p className="text-gray-600 mt-1">Theo dõi nhanh chóng các chỉ số quan trọng của hệ thống</p>
          </div>
          <div className="space-x-2 mt-4 sm:mt-0">
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Báo cáo tháng
            </Button>
            <Button variant="secondary">
              <ListChecks className="h-4 w-4 mr-2" />
              Xem tất cả
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Tổng số nhân viên</p>
                  <p className="text-3xl font-bold text-gray-900">{employeeCount}</p>
                  <p className="text-green-600 text-sm mt-1">
                    <User2 className="h-4 w-4 inline-block mr-1" />
                    {activeEmployeeCount} đang hoạt động
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Tổng số phòng ban</p>
                  <p className="text-3xl font-bold text-gray-900">{departmentCount}</p>
                  <p className="text-blue-600 text-sm mt-1">
                    <Briefcase className="h-4 w-4 inline-block mr-1" />
                    {departmentCount} phòng ban
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Quy trình đang chạy</p>
                  <p className="text-3xl font-bold text-gray-900">{processCount}</p>
                  <p className="text-orange-600 text-sm mt-1">
                    <Workflow className="h-4 w-4 inline-block mr-1" />
                    {processCount} quy trình
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg">
                  <Workflow className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Nhân viên mới (30 ngày)</p>
                  <p className="text-3xl font-bold text-gray-900">{newHiresCount}</p>
                  <p className="text-red-600 text-sm mt-1">
                    <User2 className="h-4 w-4 inline-block mr-1" />
                    {newHiresCount} nhân viên
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg">
                  <User2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Thao tác nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/hrm">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200">
                  <Users className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="text-sm">Quản lý nhân sự</span>
                </Button>
              </Link>
              
              <Link to="/processes">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-200">
                  <Workflow className="h-6 w-6 mb-2 text-green-600" />
                  <span className="text-sm">Quy trình</span>
                </Button>
              </Link>
              
              <Link to="/performance">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-200">
                  <TrendingUp className="h-6 w-6 mb-2 text-purple-600" />
                  <span className="text-sm">Đánh giá hiệu suất</span>
                </Button>
              </Link>

              <Link to="/company-policies">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center hover:bg-orange-50 hover:border-orange-200">
                  <FileText className="h-6 w-6 mb-2 text-orange-600" />
                  <span className="text-sm">Xem quy định công ty</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              <li className="py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Nguyễn Văn A</span> đã được thêm vào phòng ban Kỹ thuật
                    </p>
                    <p className="text-gray-500 text-sm">5 phút trước</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Workflow className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Quy trình "Tuyển dụng nhân viên mới" đã được tạo
                    </p>
                    <p className="text-gray-500 text-sm">30 phút trước</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Đánh giá hiệu suất cho <span className="font-medium">Trần Thị B</span> đã hoàn thành
                    </p>
                    <p className="text-gray-500 text-sm">1 giờ trước</p>
                  </div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                Thống kê nhân viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for Employee Statistics Chart */}
              <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                Biểu đồ thống kê nhân viên
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Lịch làm việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for Calendar */}
              <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                Lịch làm việc
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
