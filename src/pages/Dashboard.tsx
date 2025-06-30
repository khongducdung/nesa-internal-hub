import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmployeeJobDescription } from '@/components/dashboard/EmployeeJobDescription';
import { EmployeeTrainingDashboard } from '@/components/dashboard/EmployeeTrainingDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { Calendar, CheckCheck, FileText, HelpCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: employees } = useEmployees();

  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(emp => emp.work_status === 'active').length || 0;

  const dashboardStats = [
    {
      title: 'Tổng nhân viên',
      value: totalEmployees.toString(),
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: `${activeEmployees}/${totalEmployees} đang làm việc`,
      changeType: 'neutral'
    },
    {
      title: 'Số Task',
      value: '12',
      icon: CheckCheck,
      color: 'from-green-500 to-green-600',
      change: 'Hoàn thành tốt',
      changeType: 'increase'
    },
    {
      title: 'Số meeting',
      value: '3',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      change: 'Đang chờ duyệt',
      changeType: 'neutral'
    },
    {
      title: 'Hỗ trợ',
      value: '2',
      icon: HelpCircle,
      color: 'from-orange-500 to-orange-600',
      change: 'Cần hỗ trợ gấp',
      changeType: 'decrease'
    }
  ];

  const quickActions = [
    {
      title: 'Tạo Task',
      description: 'Giao task cho nhân viên',
      href: '/tasks',
      icon: CheckCheck
    },
    {
      title: 'Tạo Meeting',
      description: 'Lên lịch họp với phòng ban',
      href: '/meetings',
      icon: Calendar
    },
    {
      title: 'Hỗ trợ',
      description: 'Gửi yêu cầu hỗ trợ',
      href: '/help',
      icon: HelpCircle
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Chào mừng bạn quay trại lại hệ thống</p>
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Information */}
          <EmployeeJobDescription />

          {/* Training Dashboard */}
          <EmployeeTrainingDashboard />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <action.icon className="h-5 w-5" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {action.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
