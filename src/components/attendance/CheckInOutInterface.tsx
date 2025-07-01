
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export function CheckInOutInterface() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Không thể lấy vị trí',
            description: 'Vui lòng cho phép truy cập vị trí để chấm công',
            variant: 'destructive'
          });
        }
      );
    }
  }, []);

  const handleCheckIn = async () => {
    if (!location) {
      toast({
        title: 'Cần vị trí để chấm công',
        description: 'Vui lòng cho phép truy cập vị trí',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Implement check-in logic here
      setIsCheckedIn(true);
      toast({
        title: 'Check-in thành công',
        description: `Đã chấm công vào lúc ${currentTime.toLocaleTimeString()}`
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
      // Implement check-out logic here
      setIsCheckedIn(false);
      toast({
        title: 'Check-out thành công',
        description: `Đã chấm công ra lúc ${currentTime.toLocaleTimeString()}`
      });
    } catch (error) {
      toast({
        title: 'Lỗi check-out',
        description: 'Không thể thực hiện check-out. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-lg text-gray-600">
              {currentTime.toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-in/Check-out Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Chấm công
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trạng thái:</span>
              <Badge variant={isCheckedIn ? "default" : "secondary"}>
                {isCheckedIn ? 'Đã check-in' : 'Chưa check-in'}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {location 
                  ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` 
                  : 'Đang lấy vị trí...'
                }
              </span>
            </div>

            <div className="space-y-2">
              {!isCheckedIn ? (
                <Button 
                  onClick={handleCheckIn} 
                  className="w-full"
                  disabled={!location}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Check-in
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckOut} 
                  variant="outline"
                  className="w-full"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Check-out
                </Button>
              )}
            </div>

            {!location && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>Cần cho phép truy cập vị trí để chấm công</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tóm tắt hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Check-in</div>
                <div className="font-medium">--:--</div>
              </div>
              <div>
                <div className="text-gray-600">Check-out</div>
                <div className="font-medium">--:--</div>
              </div>
              <div>
                <div className="text-gray-600">Giờ làm việc</div>
                <div className="font-medium">-- giờ</div>
              </div>
              <div>
                <div className="text-gray-600">Trạng thái</div>
                <div className="font-medium">
                  <Badge variant="secondary">Chưa hoàn thành</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử chấm công gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có dữ liệu chấm công</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
