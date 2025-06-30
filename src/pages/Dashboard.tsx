
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeJobDescription } from '@/components/dashboard/EmployeeJobDescription';
import {
  Users,
  Building2,
  ClipboardList,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: employees } = useEmployees();

  // Check if current user is an employee
  const currentEmployee = employees?.find(emp => emp.auth_user_id === user?.id);
  const isEmployee = !!currentEmployee;

  // Sample dashboard stats - in a real app, these would come from actual data
  const dashboardStats = [
    {
      title: 'Tổng nhân viên',
      value: employees?.length || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Phòng ban',
      value: '8',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      change: '+2 phòng ban mới',
      changeType: 'increase'
    },
    {
      title: 'Quy trình',
      value: '24',
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Sự kiện tuần này',
      value: '12',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      change: '3 cuộc họp quan trọng',
      changeType: 'neutral'
    }
  ];

  if (isEmployee) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chào mừng, {currentEmployee.full_name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {currentEmployee.positions?.name || 'Nhân viên'} - {currentEmployee.departments?.name || 'Chưa phân phòng ban'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Description Card */}
            <div className="lg:col-span-2">
              <EmployeeJobDescription />
            </div>

            {/* Quick Stats for Employee */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã nhân viên:</span>
                  <span className="font-medium">{currentEmployee.employee_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{currentEmployee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày vào làm:</span>
                  <span className="font-medium">
                    {currentEmployee.hire_date 
                      ? new Date(currentEmployee.hire_date).toLocaleDateString('vi-VN')
                      : 'Chưa cập nhật'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-medium ${
                    currentEmployee.work_status === 'active' ? 'text-green-600' : 
                    currentEmployee.work_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {currentEmployee.work_status === 'active' ? 'Đang làm việc' :
                     currentEmployee.work_status === 'pending' ? 'Chờ duyệt' : 'Nghỉ việc'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions for Employee */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">📋 Xem quy trình làm việc</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">📅 Đăng ký nghỉ phép</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">🎯 Xem mục tiêu KPI</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Admin/Manager Dashboard
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Tổng quan hệ thống quản lý nhân sự</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => {
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
                      <p className={`text-sm font-medium flex items-center ${
                        stat.changeType === 'increase' ? 'text-green-600' :
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.changeType === 'increase' && <TrendingUp className="h-4 w-4 mr-1" />}
                        {stat.changeType === 'decrease' && <AlertCircle className="h-4 w-4 mr-1" />}
                        {stat.change}
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

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Quản lý nhân viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Thêm, sửa, xóa thông tin nhân viên và quản lý phòng ban</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-green-600" />
                Quy trình làm việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Tạo và quản lý các quy trình, hướng dẫn công việc</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Đánh giá hiệu suất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Thiết lập KPI, OKR và đánh giá hiệu suất nhân viên</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
