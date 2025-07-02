import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Shield, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSystemStats } from '@/hooks/useSystemSettings';

export function SystemOverviewCard() {
  const { data: stats, isLoading } = useSystemStats();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tổng quan hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statsData = [
    { 
      title: 'Người dùng', 
      value: stats?.total_users || 0, 
      icon: Users, 
      color: 'text-blue-600 dark:text-blue-400' 
    },
    { 
      title: 'Quản trị viên', 
      value: stats?.total_admins || 0, 
      icon: Shield, 
      color: 'text-green-600 dark:text-green-400' 
    },
    { 
      title: 'Nhân viên hoạt động', 
      value: stats?.total_employees || 0, 
      icon: CheckCircle, 
      color: 'text-purple-600 dark:text-purple-400' 
    },
    { 
      title: 'OKR đang chạy', 
      value: stats?.active_okrs || 0, 
      icon: Database, 
      color: 'text-indigo-600 dark:text-indigo-400' 
    },
    { 
      title: 'Nghỉ phép chờ duyệt', 
      value: stats?.pending_leave_requests || 0, 
      icon: AlertTriangle, 
      color: 'text-orange-600 dark:text-orange-400' 
    },
    { 
      title: 'Chấm công hôm nay', 
      value: stats?.today_attendance || 0, 
      icon: Activity, 
      color: 'text-emerald-600 dark:text-emerald-400' 
    }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Tổng quan hệ thống
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center space-y-3">
                <div className="flex justify-center">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground leading-tight">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}