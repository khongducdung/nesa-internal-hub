
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { profile, isSuperAdmin, isAdmin } = useAuth();

  const stats = [
    {
      title: 'Tổng nhân sự',
      value: '156',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Phòng ban',
      value: '12',
      icon: Building2,
      color: 'bg-green-500',
      change: '+2%'
    },
    {
      title: 'Quy trình',
      value: '24',
      icon: FileText,
      color: 'bg-orange-500',
      change: '+8%'
    },
    {
      title: 'Đánh giá tháng này',
      value: '42',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Chào mừng, {profile?.full_name}!
          </h1>
          <p className="text-blue-100">
            {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Nhân viên'} • 
            Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        {stat.change} so với tháng trước
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Thêm nhân viên mới', user: 'Nguyễn Văn A', time: '2 giờ trước' },
                  { action: 'Cập nhật quy trình', user: 'Trần Thị B', time: '4 giờ trước' },
                  { action: 'Hoàn thành đánh giá OKR', user: 'Lê Văn C', time: '1 ngày trước' },
                  { action: 'Tạo KPI mới', user: 'Phạm Thị D', time: '2 ngày trước' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">bởi {activity.user}</p>
                    </div>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông báo quan trọng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Họp tổng kết quý 4', date: '15/01/2024', priority: 'high' },
                  { title: 'Đánh giá hiệu suất hàng tháng', date: '20/01/2024', priority: 'medium' },
                  { title: 'Training kỹ năng mềm', date: '25/01/2024', priority: 'low' },
                  { title: 'Cập nhật quy trình mới', date: '30/01/2024', priority: 'medium' }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        notification.priority === 'high' ? 'bg-red-500' :
                        notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.date}</p>
                      </div>
                    </div>
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
