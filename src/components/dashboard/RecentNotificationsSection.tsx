import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  FileText, 
  Users, 
  Target, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useRecentNotifications } from '@/hooks/useDashboard';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function RecentNotificationsSection() {
  const { data: notifications = [] } = useRecentNotifications();

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'processes') return FileText;
    if (category === 'hrm') return Users;
    if (category === 'okr') return Target;
    if (category === 'attendance') return Calendar;
    
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Thông báo gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type, notification.category);
              const iconColor = getNotificationColor(notification.type);
              
              return (
                <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <Icon className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm truncate">
                          {notification.title}
                        </h4>
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                        {notification.type === 'success' ? 'Thành công' :
                         notification.type === 'warning' ? 'Cảnh báo' :
                         notification.type === 'error' ? 'Lỗi' : 'Thông tin'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { 
                          addSuffix: true,
                          locale: vi 
                        })}
                      </span>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="text-center pt-2">
              <Button variant="outline" size="sm">
                Xem tất cả thông báo
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Không có thông báo mới
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Bạn đã xem hết tất cả thông báo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}