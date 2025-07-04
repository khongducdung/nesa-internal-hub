import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function AttendanceQuickActions() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      // Mock check-in logic
      setIsCheckedIn(true);
      setCheckInTime(new Date());
      
      toast({
        title: 'Check-in thành công!',
        description: `Bạn đã check-in lúc ${new Date().toLocaleTimeString('vi-VN')}`,
      });
    } catch (error) {
      toast({
        title: 'Lỗi check-in',
        description: 'Không thể thực hiện check-in. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      // Mock check-out logic
      setIsCheckedIn(false);
      
      toast({
        title: 'Check-out thành công!',
        description: `Bạn đã check-out lúc ${new Date().toLocaleTimeString('vi-VN')}`,
      });
    } catch (error) {
      toast({
        title: 'Lỗi check-out',
        description: 'Không thể thực hiện check-out. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  const calculateWorkHours = () => {
    if (!checkInTime) return '0:00';
    
    const diffMs = currentTime.getTime() - checkInTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}:${diffMinutes.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Clock className="h-5 w-5" />
          Chấm công nhanh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900">
            {currentTime.toLocaleTimeString('vi-VN')}
          </div>
          <div className="text-sm text-blue-700">
            {currentTime.toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">Trạng thái:</span>
          <Badge variant={isCheckedIn ? "default" : "outline"}>
            {isCheckedIn ? 'Đang làm việc' : 'Chưa check-in'}
          </Badge>
        </div>

        {/* Work Hours (if checked in) */}
        {isCheckedIn && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Giờ làm việc:</span>
            <span className="font-bold text-blue-900">{calculateWorkHours()}</span>
          </div>
        )}

        {/* Location indicator */}
        <div className="flex items-center gap-2 text-xs text-blue-700">
          <MapPin className="h-3 w-3" />
          <span>Văn phòng chính</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isCheckedIn ? (
            <Button 
              onClick={handleCheckIn} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Clock className="h-4 w-4 mr-2" />
              Check-in
            </Button>
          ) : (
            <Button 
              onClick={handleCheckOut} 
              variant="outline"
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Clock className="h-4 w-4 mr-2" />
              Check-out
            </Button>
          )}
        </div>

        {/* Quick Info */}
        <div className="text-xs text-blue-600 text-center">
          {isCheckedIn 
            ? 'Nhớ check-out khi kết thúc ca làm việc'
            : 'Hãy check-in để bắt đầu ngày làm việc'
          }
        </div>
      </CardContent>
    </Card>
  );
}