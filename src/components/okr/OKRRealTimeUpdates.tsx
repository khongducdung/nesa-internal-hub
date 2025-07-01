
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface RealtimeUpdate {
  id: string;
  type: 'progress' | 'completion' | 'milestone' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  user: string;
  okrTitle: string;
}

export function OKRRealTimeUpdates() {
  const { profile } = useAuth();
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);

  useEffect(() => {
    // Mock real-time updates
    const mockUpdates: RealtimeUpdate[] = [
      {
        id: '1',
        type: 'progress',
        title: 'Cập nhật tiến độ OKR',
        description: 'Nguyễn Văn A đã cập nhật tiến độ từ 65% lên 72%',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        priority: 'medium',
        user: 'Nguyễn Văn A',
        okrTitle: 'Tăng doanh số bán hàng 40%'
      },
      {
        id: '2',
        type: 'completion',
        title: 'Hoàn thành Key Result',
        description: 'Trần Thị B đã hoàn thành Key Result "Thu hút 500 khách hàng mới"',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        priority: 'high',
        user: 'Trần Thị B',
        okrTitle: 'Mở rộng thị trường miền Nam'
      },
      {
        id: '3',
        type: 'alert',
        title: 'Cảnh báo tiến độ chậm',
        description: 'OKR "Cải thiện quy trình sản xuất" có nguy cơ không đạt mục tiêu',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        priority: 'high',
        user: 'Hệ thống',
        okrTitle: 'Cải thiện quy trình sản xuất'
      },
      {
        id: '4',
        type: 'milestone',
        title: 'Đạt mốc quan trọng',
        description: 'Phòng Marketing đạt 80% tiến độ cho Q1 2024',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        priority: 'medium',
        user: 'Phòng Marketing',
        okrTitle: 'Tăng nhận diện thương hiệu'
      }
    ];

    setUpdates(mockUpdates);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newUpdate: RealtimeUpdate = {
        id: Date.now().toString(),
        type: ['progress', 'completion', 'milestone', 'alert'][Math.floor(Math.random() * 4)] as any,
        title: 'Cập nhật mới',
        description: `Cập nhật tự động từ hệ thống lúc ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
        user: 'Hệ thống',
        okrTitle: 'OKR Demo'
      };

      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getUpdateIcon = (type: RealtimeUpdate['type']) => {
    switch (type) {
      case 'progress':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'completion':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'milestone':
        return <Bell className="h-4 w-4 text-purple-600" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: RealtimeUpdate['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Cập nhật theo thời gian thực</h3>
            <Badge variant="secondary" className="ml-auto">
              {updates.length} cập nhật
            </Badge>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {updates.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có cập nhật nào</p>
            </div>
          ) : (
            <div className="divide-y">
              {updates.map((update) => (
                <div key={update.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getUpdateIcon(update.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {update.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(update.priority)}`}
                        >
                          {update.priority === 'high' ? 'Cao' : 
                           update.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {update.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate">
                          <span className="font-medium">{update.user}</span>
                          {' • '}
                          <span className="truncate">{update.okrTitle}</span>
                        </span>
                        <span className="flex-shrink-0 ml-2">
                          {formatTime(update.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
