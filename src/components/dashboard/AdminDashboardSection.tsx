import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  TrendingUp, 
  Target,
  AlertTriangle,
  Settings,
  BarChart3,
  Clock
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

export function AdminDashboardSection() {
  const { data: stats, isLoading } = useDashboardStats();
  const navigate = useNavigate();

  const adminStats = [
    {
      title: 'Tổng nhân viên',
      value: stats?.totalEmployees?.toString() || '0',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: `${stats?.activeEmployees || 0} đang làm việc`,
      changeType: 'neutral' as const,
      onClick: () => navigate('/hrm')
    },
    {
      title: 'Chấm công hôm nay',
      value: stats?.todayAttendance?.toString() || '0',
      icon: Clock,
      color: 'from-green-500 to-green-600',
      change: `${stats?.todayPresent || 0} có mặt, ${stats?.todayLate || 0} đi muộn`,
      changeType: 'neutral' as const,
      onClick: () => navigate('/attendance')
    },
    {
      title: 'OKRs năm nay',
      value: stats?.activeOKRs?.toString() || '0',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      change: `${stats?.completedOKRs || 0} đã hoàn thành`,
      changeType: 'increase' as const,
      onClick: () => navigate('/okr')
    },
    {
      title: 'Yêu cầu nghỉ phép',
      value: stats?.pendingLeaveRequests?.toString() || '0',
      icon: ClipboardList,
      color: 'from-orange-500 to-orange-600',
      change: 'Chờ duyệt',
      changeType: stats?.pendingLeaveRequests ? 'decrease' as const : 'neutral' as const,
      onClick: () => navigate('/hrm')
    }
  ];

  const quickActions = [
    {
      title: 'Quản lý nhân sự',
      description: 'Thêm, sửa thông tin nhân viên',
      href: '/hrm',
      icon: Users,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Báo cáo chấm công',
      description: 'Xem báo cáo chi tiết',
      href: '/attendance',
      icon: BarChart3,
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình và quản trị',
      href: '/settings',
      icon: Settings,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tổng quan điều hành
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-200 border-0 shadow-md cursor-pointer"
                onClick={stat.onClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm font-medium flex items-center ${
                        stat.changeType === 'increase' ? 'text-green-600' :
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-muted-foreground'
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
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${action.color}`}
              onClick={() => navigate(action.href)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <action.icon className="h-5 w-5" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Alerts Section */}
      {stats?.pendingLeaveRequests && stats.pendingLeaveRequests > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Cần xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 font-medium">
                  {stats.pendingLeaveRequests} yêu cầu nghỉ phép chờ duyệt
                </p>
                <p className="text-orange-600 text-sm">
                  Hãy xem xét và phê duyệt các yêu cầu này
                </p>
              </div>
              <Button 
                size="sm" 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => navigate('/hrm')}
              >
                Xem ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}