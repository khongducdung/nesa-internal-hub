
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LocationPicker } from './LocationPicker';

interface CheckInOutInterfaceProps {
  employeeId: string;
  checkType: 'daily' | 'shift';
}

export function CheckInOutInterface({ employeeId, checkType }: CheckInOutInterfaceProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [currentShift, setCurrentShift] = useState<any>(null);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

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
        .eq('check_type', checkType)
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

  const handleCheckIn = async (actionType: string) => {
    if (!currentLocation) {
      toast({
        title: 'Chưa có vị trí',
        description: 'Vui lòng chọn vị trí để check in',
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

      if (checkType === 'daily') {
        if (actionType === 'daily_start') {
          attendanceData.daily_start_check_in = now;
        } else {
          attendanceData.daily_end_check_out = now;
        }
      } else {
        // shift check in/out
        attendanceData[actionType] = now;
        if (currentShift) {
          attendanceData.shift_assignment_id = currentShift.id;
        }
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

      // Lưu location
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
      daily_start: 'Check in đầu ngày',
      daily_end: 'Check out cuối ngày',
      shift_start_check_in: 'Check in đầu ca',
      shift_start_check_out: 'Check out đầu ca',
      shift_end_check_in: 'Check in cuối ca',
      shift_end_check_out: 'Check out cuối ca'
    };
    return labels[actionType] || actionType;
  };

  const isActionCompleted = (actionType: string) => {
    if (!todayAttendance) return false;
    return Boolean(todayAttendance[actionType]);
  };

  const renderCheckButton = (actionType: string, label: string, variant: 'default' | 'destructive' = 'default') => {
    const completed = isActionCompleted(actionType);
    return (
      <Button
        onClick={() => handleCheckIn(actionType)}
        disabled={completed || isLoading}
        variant={completed ? 'outline' : variant}
        className="w-full h-16 text-lg font-semibold"
      >
        {completed ? (
          <>
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Đã {label}
          </>
        ) : (
          <>
            <Clock className="h-5 w-5 mr-2" />
            {label}
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Chấm công {checkType === 'daily' ? 'theo ngày' : 'theo ca'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkType === 'shift' && currentShift && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Ca làm việc hiện tại</h4>
              <p className="text-blue-700">{currentShift.work_shifts?.name}</p>
              <p className="text-sm text-blue-600">
                {currentShift.work_shifts?.start_time} - {currentShift.work_shifts?.end_time}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checkType === 'daily' ? (
              <>
                {renderCheckButton('daily_start_check_in', 'Check In Đầu Ngày')}
                {renderCheckButton('daily_end_check_out', 'Check Out Cuối Ngày', 'destructive')}
              </>
            ) : (
              <>
                {renderCheckButton('shift_start_check_in', 'Check In Đầu Ca')}
                {renderCheckButton('shift_start_check_out', 'Check Out Đầu Ca', 'destructive')}
                {renderCheckButton('shift_end_check_in', 'Check In Cuối Ca')}
                {renderCheckButton('shift_end_check_out', 'Check Out Cuối Ca', 'destructive')}
              </>
            )}
          </div>

          <LocationPicker 
            onLocationSelect={setCurrentLocation}
            currentLocation={currentLocation}
          />

          {currentLocation && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Vị trí: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
