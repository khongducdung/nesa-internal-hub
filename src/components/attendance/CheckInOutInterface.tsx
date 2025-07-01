
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useAttendance, useAttendanceMutations } from '@/hooks/useAttendance';

export function CheckInOutInterface() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get today's attendance for current user
  const today = new Date().toISOString().split('T')[0];
  const { data: attendanceRecords } = useAttendance(
    profile?.employee_id, 
    today, 
    today
  );
  const { checkIn, checkOut } = useAttendanceMutations();

  const todayAttendance = attendanceRecords?.[0];
  const isCheckedIn = todayAttendance?.check_in_time && !todayAttendance?.check_out_time;
  const isCompleted = todayAttendance?.check_in_time && todayAttendance?.check_out_time;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí.');
        }
      );
    } else {
      setLocationError('Trình duyệt không hỗ trợ định vị GPS.');
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

    if (!profile?.employee_id) {
      toast({
        title: 'Lỗi thông tin nhân viên',
        description: 'Không tìm thấy thông tin nhân viên',
        variant: 'destructive'
      });
      return;
    }

    try {
      await checkIn.mutateAsync({
        employee_id: profile.employee_id,
        date: today,
        check_in_time: new Date().toISOString(),
        check_in_latitude: location.lat,
        check_in_longitude: location.lng
      });
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance?.id) {
      toast({
        title: 'Lỗi check-out',
        description: 'Không tìm thấy thông tin check-in',
        variant: 'destructive'
      });
      return;
    }

    try {
      await checkOut.mutateAsync({
        id: todayAttendance.id,
        check_out_time: new Date().toISOString(),
        check_out_latitude: location?.lat,
        check_out_longitude: location?.lng
      });
    } catch (error) {
      console.error('Check-out error:', error);
    }
  };

  const calculateWorkHours = () => {
    if (!todayAttendance?.check_in_time) return '-- giờ';
    
    const checkInTime = new Date(todayAttendance.check_in_time);
    const checkOutTime = todayAttendance.check_out_time 
      ? new Date(todayAttendance.check_out_time)
      : new Date();
    
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}:${diffMinutes.toString().padStart(2, '0')} giờ`;
  };

  const getAttendanceStatus = () => {
    if (isCompleted) return { label: 'Hoàn thành', variant: 'default' as const };
    if (isCheckedIn) return { label: 'Đang làm việc', variant: 'secondary' as const };
    return { label: 'Chưa check-in', variant: 'outline' as const };
  };

  const status = getAttendanceStatus();

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentTime.toLocaleTimeString('vi-VN')}
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
              <Badge variant={status.variant}>
                {status.label}
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
              {!isCheckedIn && !isCompleted ? (
                <Button 
                  onClick={handleCheckIn} 
                  className="w-full"
                  disabled={!location || checkIn.isPending}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {checkIn.isPending ? 'Đang check-in...' : 'Check-in'}
                </Button>
              ) : isCheckedIn ? (
                <Button 
                  onClick={handleCheckOut} 
                  variant="outline"
                  className="w-full"
                  disabled={checkOut.isPending}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {checkOut.isPending ? 'Đang check-out...' : 'Check-out'}
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>Đã hoàn thành ca làm việc hôm nay</span>
                </div>
              )}
            </div>

            {locationError && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>{locationError}</span>
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
                <div className="font-medium">
                  {todayAttendance?.check_in_time 
                    ? new Date(todayAttendance.check_in_time).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : '--:--'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-600">Check-out</div>
                <div className="font-medium">
                  {todayAttendance?.check_out_time 
                    ? new Date(todayAttendance.check_out_time).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : '--:--'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-600">Giờ làm việc</div>
                <div className="font-medium">{calculateWorkHours()}</div>
              </div>
              <div>
                <div className="text-gray-600">Trạng thái</div>
                <div className="font-medium">
                  <Badge variant={status.variant} className="text-xs">
                    {status.label}
                  </Badge>
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
          {attendanceRecords && attendanceRecords.length > 0 ? (
            <div className="space-y-3">
              {attendanceRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">
                        {new Date(record.date).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {record.check_in_time && new Date(record.check_in_time).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : 'Chưa check-out'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={record.check_out_time ? "default" : "secondary"}>
                    {record.check_out_time ? "Hoàn thành" : "Đang làm"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có dữ liệu chấm công</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
