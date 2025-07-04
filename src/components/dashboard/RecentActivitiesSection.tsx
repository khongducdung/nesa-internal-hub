import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  FileText, 
  Users, 
  Target, 
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function RecentActivitiesSection() {
  const { profile } = useAuth();

  // Mock data - would be fetched from API
  const recentActivities = [
    {
      id: '1',
      type: 'attendance',
      title: 'Check-in thành công',
      description: 'Bạn đã check-in lúc 08:15 AM',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: '2',
      type: 'okr',
      title: 'Cập nhật tiến độ OKR',
      description: 'Hoàn thành 75% mục tiêu Q4',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: '3',
      type: 'department',
      title: 'Cuộc họp phòng ban',
      description: 'Meeting review tháng 7 - Phòng Kỹ thuật',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: '4',
      type: 'training',
      title: 'Hoàn thành khóa đào tạo',
      description: 'Khóa "Kỹ năng giao tiếp hiệu quả"',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: '5',
      type: 'feedback',
      title: 'Nhận phản hồi từ quản lý',
      description: 'Đánh giá tích cực cho dự án ABC',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Hoạt động gần đây
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Các hoạt động của bạn và phòng ban
        </p>
      </CardHeader>
      <CardContent>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              
              return (
                <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg border ${activity.bgColor}`}>
                  <div className={`p-2 rounded-lg ${activity.bgColor} border`}>
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {activity.title}
                        </h4>
                        <p className="text-muted-foreground text-xs mt-1">
                          {activity.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type === 'attendance' ? 'Chấm công' :
                         activity.type === 'okr' ? 'OKR' :
                         activity.type === 'department' ? 'Phòng ban' :
                         activity.type === 'training' ? 'Đào tạo' : 'Khác'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { 
                          addSuffix: true,
                          locale: vi 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="text-center pt-2">
              <Button variant="outline" size="sm">
                Xem tất cả hoạt động
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Chưa có hoạt động nào
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Các hoạt động của bạn sẽ hiển thị ở đây
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}