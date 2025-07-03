import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { 
  useNotifications, 
  useUnreadNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead,
  type Notification 
} from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  system: Settings
};

const typeColors = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  system: 'text-purple-500'
};

const categoryLabels = {
  general: 'Chung',
  ideas: 'Ý tưởng',
  okr: 'OKR',
  kpi: 'KPI',
  attendance: 'Chấm công',
  hrm: 'Nhân sự',
  processes: 'Quy trình'
};

export function NotificationWidget() {
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: allNotifications = [] } = useNotifications();
  const { data: unreadNotifications = [] } = useUnreadNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    
    // Navigate to action URL if available
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const NotificationList = ({ notifications }: { notifications: Notification[] }) => (
    <div className="space-y-2">
      {notifications.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-sm">
          Không có thông báo
        </div>
      ) : (
        notifications.map((notification) => {
          const TypeIcon = typeIcons[notification.type];
          const typeColor = typeColors[notification.type];
          
          return (
            <div
              key={notification.id}
              className={`
                p-3 rounded-lg border transition-all duration-200 cursor-pointer
                ${notification.is_read 
                  ? 'bg-background hover:bg-accent/50' 
                  : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                }
              `}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${typeColor}`}>
                  <TypeIcon className="h-4 w-4 mt-0.5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium text-sm truncate ${
                      notification.is_read ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className={`text-xs mb-2 ${
                    notification.is_read ? 'text-muted-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {categoryLabels[notification.category] || notification.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.created_at), { 
                          addSuffix: true, 
                          locale: vi 
                        })}
                      </div>
                    </div>
                    
                    {notification.action_url && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="w-[400px] h-[600px] bg-background border border-border/50 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold text-foreground">Thông báo</h2>
          </div>
          
          {unreadNotifications.length > 0 && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 px-2"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Đánh dấu tất cả
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Bạn có {unreadNotifications.length} thông báo chưa đọc</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="all" className="text-xs">
              <Bell className="h-3 w-3 mr-1" />
              Tất cả ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs relative">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-1" />
                Chưa đọc ({unreadNotifications.length})
              </div>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="all" className="h-full">
              <ScrollArea className="h-full px-4 pb-4">
                <NotificationList notifications={allNotifications} />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="unread" className="h-full">
              <ScrollArea className="h-full px-4 pb-4">
                <NotificationList notifications={unreadNotifications} />
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}