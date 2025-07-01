
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmployeeJobDescription } from '@/components/dashboard/EmployeeJobDescription';
import { EmployeeTrainingDashboard } from '@/components/dashboard/EmployeeTrainingDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { Calendar, CheckCheck, FileText, HelpCircle, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { data: employees } = useEmployees();

  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(emp => emp.work_status === 'active').length || 0;

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 
                   'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;
  };

  const motivationalQuotes = [
    "🎯 Hôm nay là một ngày tuyệt vời để đạt được mục tiêu!",
    "⭐ Sẵn sáng cho một ngày làm việc hiệu quả",
    "🚀 Cùng nhau xây dựng một tương lai tốt đẹp!",
    "💪 Mỗi ngày là một cơ hội mới để phát triển!"
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

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
        {/* Hero Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white border-0 shadow-xl overflow-hidden relative">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-r from-blue-500/90 via-blue-600/90 to-purple-600/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-white/80 text-sm font-medium">Chào buổi chiều</span>
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-3 text-white">
                      Chào mừng trở lại, {profile?.full_name || 'Người dùng'}!
                    </h1>
                    
                    <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                      {randomQuote}
                    </p>
                    
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
                      <Clock className="h-4 w-4" />
                      <span>{getCurrentDate()}</span>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button size="sm" variant="secondary" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm text-white hover:text-white">
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Tạo Task
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm text-white hover:text-white">
                        <Calendar className="h-4 w-4 mr-2" />
                        Lên lịch Meeting
                      </Button>
                      <Button size="sm" className="bg-white text-blue-600 hover:bg-white/90 font-medium">
                        Xem báo cáo →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
