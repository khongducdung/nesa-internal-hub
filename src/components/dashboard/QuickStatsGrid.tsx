import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Calendar,
  Clock,
  UserCheck,
  Target,
  Award
} from 'lucide-react';
import { useEmployeeStats } from '@/hooks/useEmployees';

export function QuickStatsGrid() {
  const { data: employeeStats } = useEmployeeStats();

  const stats = [
    {
      title: 'Tổng nhân viên',
      value: employeeStats?.totalEmployees || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+5%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Phòng ban hoạt động',
      value: employeeStats?.activeDepartments || 0,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '12',
      trendColor: 'text-slate-600'
    },
    {
      title: 'Có mặt hôm nay',
      value: employeeStats?.presentToday || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '95%',
      trendColor: 'text-green-600'
    },
    {
      title: 'OKR hoàn thành',
      value: 24,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+12%',
      trendColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground mb-2">
                  {stat.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className={`text-xs ${stat.trendColor} bg-transparent px-0`}>
                    {stat.trend}
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs tháng trước</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}