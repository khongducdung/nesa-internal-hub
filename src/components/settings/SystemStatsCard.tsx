import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, UserCheck, Target, Clock, AlertTriangle, Building } from 'lucide-react';
import { useSystemStats } from '@/hooks/useSystemSettings';
import { useEffect } from 'react';

export function SystemStatsCard() {
  const { data: stats, isLoading, refetch } = useSystemStats();

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Building className="h-5 w-5" />
            Tổng quan hệ thống
            <div className="ml-auto">
              <div className="w-3 h-3 bg-muted rounded-full animate-pulse"></div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statsConfig = [
    { 
      title: 'Người dùng', 
      value: stats?.total_users?.toString() || '0', 
      icon: Users, 
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Admin', 
      value: stats?.total_admins?.toString() || '0', 
      icon: Shield, 
      color: 'text-green-600 dark:text-green-400'
    },
    { 
      title: 'Nhân viên', 
      value: stats?.total_employees?.toString() || '0', 
      icon: UserCheck, 
      color: 'text-purple-600 dark:text-purple-400'
    },
    { 
      title: 'OKR hoạt động', 
      value: stats?.active_okrs?.toString() || '0', 
      icon: Target, 
      color: 'text-indigo-600 dark:text-indigo-400'
    },
    { 
      title: 'Nghỉ phép chờ', 
      value: stats?.pending_leave_requests?.toString() || '0', 
      icon: Clock, 
      color: 'text-orange-600 dark:text-orange-400'
    },
    { 
      title: 'Chấm công hôm nay', 
      value: stats?.today_attendance?.toString() || '0', 
      icon: UserCheck, 
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    { 
      title: 'Cảnh báo', 
      value: stats?.security_alerts?.toString() || '0', 
      icon: AlertTriangle, 
      color: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Building className="h-5 w-5" />
          Tổng quan hệ thống (Realtime)
          <div className="ml-auto">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}