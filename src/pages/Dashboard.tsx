
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, FileText, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { profile, isSuperAdmin, isAdmin } = useAuth();

  const stats = [
    {
      title: 'Tổng nhân sự',
      value: '156',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Phòng ban',
      value: '12',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      change: '+2%',
      changeType: 'increase'
    },
    {
      title: 'Quy trình hoạt động',
      value: '24',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Đánh giá tháng này',
      value: '42',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const quickActions = [
    { label: 'Thêm nhân viên', icon: Plus, path: '/hrm/employees/new', access: 'admin' },
    { label: 'Tạo quy trình mới', icon: Plus, path: '/processes/new', access: 'admin' },
    { label: 'Đánh giá OKR', icon: TrendingUp, path: '/okr', access: 'all' },
    { label: 'Xem KPI', icon: ArrowRight, path: '/kpi', access: 'all' }
  ];

  const hasAccess = (access: string) => {
    if (access === 'all') return true;
    if (access === 'admin') return isAdmin || isSuperAdmin;
    if (access === 'super_admin') return isSuperAdmin;
    return false;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Chào mừng trở lại, {profile?.full_name}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Nhân viên'} • 
                Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">N</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
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

        {/* Quick Actions */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                if (!hasAccess(action.access)) return null;
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    onClick={() => console.log(`Navigate to ${action.path}`)}
                  >
                    <Icon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Thêm nhân viên mới', user: 'Nguyễn Văn A', time: '2 giờ trước', type: 'add' },
                  { action: 'Cập nhật quy trình', user: 'Trần Thị B', time: '4 giờ trước', type: 'update' },
                  { action: 'Hoàn thành đánh giá OKR', user: 'Lê Văn C', time: '1 ngày trước', type: 'complete' },
                  { action: 'Tạo KPI mới', user: 'Phạm Thị D', time: '2 ngày trước', type: 'create' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'add' ? 'bg-green-500' :
                      activity.type === 'update' ? 'bg-blue-500' :
                      activity.type === 'complete' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">bởi {activity.user}</p>
                    </div>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Notifications */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Thông báo quan trọng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Họp tổng kết quý 4', date: '15/01/2024', priority: 'high' },
                  { title: 'Đánh giá hiệu suất hàng tháng', date: '20/01/2024', priority: 'medium' },
                  { title: 'Training kỹ năng mềm', date: '25/01/2024', priority: 'low' },
                  { title: 'Cập nhật quy trình mới', date: '30/01/2024', priority: 'medium' }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-3 h-3 rounded-full ${
                      notification.priority === 'high' ? 'bg-red-500' :
                      notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      Xem
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
