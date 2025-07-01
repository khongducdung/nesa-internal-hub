
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Calendar, CheckCircle, User, Building, PlayCircle, StopCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LocationPicker } from './LocationPicker';

interface CheckInOutInterfaceProps {
  employeeId: string;
}

export function CheckInOutInterface({ employeeId }: CheckInOutInterfaceProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [currentShift, setCurrentShift] = useState<any>(null);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  useEffect(() => {
    loadTodayAttendance();
    loadCurrentShift();
    getCurrentLocation();
  }, [employeeId]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Lỗi định vị',
            description: 'Không thể lấy vị trí hiện tại. Vui lòng chọn vị trí thủ công.',
            variant: 'destructive'
          });
        }
      );
    }
  };

  const loadTodayAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      setTodayAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const loadCurrentShift = async () => {
    try {
      const { data, error } = await supabase
        .from('shift_assignments')
        .select(`
          *,
          work_shifts (*)
        `)
        .eq('employee_id', employeeId)
        .eq('is_active', true)
        .lte('effective_from', today)
        .or(`effective_to.is.null,effective_to.gte.${today}`)
        .maybeSingle();

      if (error) throw error;
      setCurrentShift(data);
    } catch (error) {
      console.error('Error loading shift:', error);
    }
  };

  const handleCheckAction = async (actionType: string, checkType: string) => {
    if (!currentLocation) {
      toast({
        title: 'Chưa có vị trí',
        description: 'Vui lòng chọn vị trí để thực hiện chấm công',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      
      let attendanceData: any = {
        employee_id: employeeId,
        date: today,
        check_type: checkType,
        status: 'present'
      };

      attendanceData[actionType] = now;
      
      if (checkType === 'shift' && currentShift) {
        attendanceData.shift_assignment_id = currentShift.id;
      }

      const { data: attendance, error: attendanceError } = todayAttendance
        ? await supabase
            .from('attendance')
            .update(attendanceData)
            .eq('id', todayAttendance.id)
            .select()
            .single()
        : await supabase
            .from('attendance')
            .insert([attendanceData])
            .select()
            .single();

      if (attendanceError) throw attendanceError;

      const { error: locationError } = await supabase
        .from('attendance_check_locations')
        .insert([{
          attendance_id: attendance.id,
          check_type: actionType,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          timestamp: now
        }]);

      if (locationError) throw locationError;

      toast({
        title: 'Thành công',
        description: `${getActionLabel(actionType)} thành công!`
      });

      loadTodayAttendance();
    } catch (error) {
      console.error('Error checking in/out:', error);
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi chấm công',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      daily_start_check_in: 'Check in đầu ngày',
      daily_end_check_out: 'Check out cuối ngày',
      shift_start_check_in: 'Check in đầu ca',
      shift_end_check_out: 'Check out cuối ca'
    };
    return labels[actionType] || actionType;
  };

  const isActionCompleted = (actionType: string) => {
    if (!todayAttendance) return false;
    return Boolean(todayAttendance[actionType]);
  };

  return (
    <div className="space-y-6">
      {/* Employee Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nhân viên</p>
                <p className="font-semibold text-gray-900">Nguyễn Văn A</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày</p>
                <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vị trí</p>
                <p className="font-semibold text-gray-900">
                  {currentLocation ? 'Đã xác định' : 'Chưa xác định'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Shift Info */}
      {currentShift && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Ca làm việc hiện tại</h4>
                <p className="text-purple-700 font-medium">{currentShift.work_shifts?.name}</p>
                <p className="text-sm text-gray-600">
                  {currentShift.work_shifts?.start_time} - {currentShift.work_shifts?.end_time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Check-in Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Check-in */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              Chấm công theo ngày
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleCheckAction('daily_start_check_in', 'daily')}
              disabled={isActionCompleted('daily_start_check_in') || isLoading}
              className="w-full h-16 text-lg font-semibold bg-[#2563EB] hover:bg-[#1d4ed8]"
            >
              {isActionCompleted('daily_start_check_in') ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Đã Check In</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-6 w-6" />
                  <div className="text-center">
                    <div>Check In Đầu Ngày</div>
                    <div className="text-sm opacity-80">{currentTime}</div>
                  </div>
                </div>
              )}
            </Button>

            <Button
              onClick={() => handleCheckAction('daily_end_check_out', 'daily')}
              disabled={isActionCompleted('daily_end_check_out') || isLoading}
              variant="destructive"
              className="w-full h-16 text-lg font-semibold"
            >
              {isActionCompleted('daily_end_check_out') ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Đã Check Out</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <StopCircle className="h-6 w-6" />
                  <div className="text-center">
                    <div>Check Out Cuối Ngày</div>
                    <div className="text-sm opacity-80">{currentTime}</div>
                  </div>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Shift Check-in */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-purple-600" />
              Chấm công theo ca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleCheckAction('shift_start_check_in', 'shift')}
              disabled={isActionCompleted('shift_start_check_in') || isLoading}
              className="w-full h-16 text-lg font-semibold bg-[#2563EB] hover:bg-[#1d4ed8]"
            >
              {isActionCompleted('shift_start_check_in') ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Đã Check In Ca</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-6 w-6" />
                  <div className="text-center">
                    <div>Check In Đầu Ca</div>
                    <div className="text-sm opacity-80">{currentTime}</div>
                  </div>
                </div>
              )}
            </Button>

            <Button
              onClick={() => handleCheckAction('shift_end_check_out', 'shift')}
              disabled={isActionCompleted('shift_end_check_out') || isLoading}
              variant="destructive"
              className="w-full h-16 text-lg font-semibold"
            >
              {isActionCompleted('shift_end_check_out') ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Đã Check Out Ca</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <StopCircle className="h-6 w-6" />
                  <div className="text-center">
                    <div>Check Out Cuối Ca</div>
                    <div className="text-sm opacity-80">{currentTime}</div>
                  </div>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Vị trí chấm công
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LocationPicker 
            onLocationSelect={setCurrentLocation}
            currentLocation={currentLocation}
          />
          
          {currentLocation && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Vị trí: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
