
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, TrendingUp, Calendar } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { useEmployees } from '@/hooks/useEmployees';
import { formatNumber } from '@/utils/formatters';

export function AttendanceStats() {
  const { data: attendance } = useAttendance();
  const { data: employees } = useEmployees();

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().getMonth() + 1;
  const thisYear = new Date().getFullYear();

  // Thống kê hôm nay
  const todayAttendance = attendance?.filter(att => att.date === today) || [];
  const presentToday = todayAttendance.filter(att => att.status === 'present').length;
  const lateToday = todayAttendance.filter(att => att.status === 'late').length;
  const absentToday = todayAttendance.filter(att => att.status === 'absent').length;

  // Thống kê tháng này (cần query riêng trong thực tế)
  const totalEmployees = employees?.filter(emp => emp.work_status === 'active').length || 0;
  const attendanceRate = totalEmployees > 0 ? ((presentToday + lateToday) / totalEmployees * 100) : 0;

  const stats = [
    {
      title: 'Có mặt hôm nay',
      value: formatNumber(presentToday),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${formatNumber(todayAttendance.length)}/${formatNumber(totalEmployees)} đã chấm công`
    },
    {
      title: 'Đi muộn hôm nay',
      value: formatNumber(lateToday),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Cần theo dõi'
    },
    {
      title: 'Vắng mặt hôm nay',
      value: formatNumber(absentToday),
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Không phép'
    },
    {
      title: 'Tỷ lệ chấm công',
      value: `${formatNumber(attendanceRate)}%`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Hôm nay'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
