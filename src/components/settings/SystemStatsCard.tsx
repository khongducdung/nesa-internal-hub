import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, Globe, Lock } from 'lucide-react';
import { useSystemStats } from '@/hooks/useSystemSettings';

export function SystemStatsCard() {
  const { data: stats, isLoading } = useSystemStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsConfig = [
    { 
      title: 'Tổng người dùng', 
      value: stats?.total_users?.toString() || '0', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      title: 'Admin', 
      value: stats?.total_admins?.toString() || '0', 
      icon: Shield, 
      color: 'from-green-500 to-green-600' 
    },
    { 
      title: 'Phiên hoạt động', 
      value: stats?.active_sessions?.toString() || '0', 
      icon: Globe, 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      title: 'Cảnh báo bảo mật', 
      value: stats?.security_alerts?.toString() || '0', 
      icon: Lock, 
      color: 'from-orange-500 to-orange-600' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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
  );
}