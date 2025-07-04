import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Clock, 
  User, 
  FileText, 
  Target, 
  Users,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Update {
  id: string;
  type: 'employee' | 'okr' | 'policy' | 'training';
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  status?: string;
}

export function RecentUpdatesSection() {
  // Mock data - in real app, this would come from an API
  const updates: Update[] = [
    {
      id: '1',
      type: 'employee',
      title: 'Nhân viên mới gia nhập',
      description: 'Nguyễn Văn An đã gia nhập phòng IT',
      user: {
        name: 'Nguyễn Văn An',
        avatar: '/placeholder.svg'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'new'
    },
    {
      id: '2',
      type: 'okr',
      title: 'Cập nhật tiến độ OKR',
      description: 'Hoàn thành 85% mục tiêu Q4',
      user: {
        name: 'Trần Thị Hoa',
        avatar: '/placeholder.svg'
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'progress'
    },
    {
      id: '3',
      type: 'policy',
      title: 'Quy định mới được ban hành',
      description: 'Quy định làm việc từ xa đã được cập nhật',
      user: {
        name: 'Lê Văn Minh',
        avatar: '/placeholder.svg'
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'active'
    },
    {
      id: '4',
      type: 'training',
      title: 'Khóa đào tạo mới',
      description: 'Đào tạo kỹ năng lãnh đạo bắt đầu tuần tới',
      user: {
        name: 'Phạm Thị Lan',
        avatar: '/placeholder.svg'
      },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'upcoming'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return <User className="h-4 w-4" />;
      case 'okr':
        return <Target className="h-4 w-4" />;
      case 'policy':
        return <FileText className="h-4 w-4" />;
      case 'training':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'employee':
        return 'text-blue-600 bg-blue-50';
      case 'okr':
        return 'text-green-600 bg-green-50';
      case 'policy':
        return 'text-purple-600 bg-purple-50';
      case 'training':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-emerald-100 text-emerald-700 text-xs">Mới</Badge>;
      case 'progress':
        return <Badge className="bg-blue-100 text-blue-700 text-xs">Tiến hành</Badge>;
      case 'active':
        return <Badge className="bg-purple-100 text-purple-700 text-xs">Hiệu lực</Badge>;
      case 'upcoming':
        return <Badge className="bg-amber-100 text-amber-700 text-xs">Sắp tới</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-lg font-semibold">Cập nhật gần đây</span>
              <p className="text-sm text-muted-foreground font-normal">
                Hoạt động mới trong hệ thống
              </p>
            </div>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
            Xem tất cả
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {updates.map((update) => (
              <div
                key={update.id}
                className="group p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(update.type)}`}>
                    {getTypeIcon(update.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                          {update.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {update.description}
                        </p>
                      </div>
                      {update.status && getStatusBadge(update.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={update.user.avatar} alt={update.user.name} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {update.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {update.user.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(update.timestamp, 'HH:mm', { locale: vi })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}