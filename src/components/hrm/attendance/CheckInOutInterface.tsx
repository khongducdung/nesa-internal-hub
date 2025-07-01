
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Calendar, CheckCircle, XCircle, User, Building } from 'lucide-react';
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

      // Set the appropriate field based on action type
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
      daily_start_check_in: 'Check in đầu ngày',
      daily_end_check_out: 'Check out cuối ngày',
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

  const renderCheckButton = (actionType: string, label: string, variant: 'default' | 'destructive' = 'default', checkType: string) => {
    const completed = isActionCompleted(actionType);
    return (
      <Button
        onClick={() => handleCheckAction(actionType, checkType)}
        disabled={completed || isLoading}
        variant={completed ? 'outline' : variant}
        className="w-full h-20 text-lg font-semibold"
      >
        {completed ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-6 w-6 mb-1 text-green-600" />
            <span className="text-sm">Đã {label}</span>
            {todayAttendance && todayAttendance[actionType] && (
              <span className="text-xs text-gray-500">
                {new Date(todayAttendance[actionType]).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Clock className="h-6 w-6 mb-1" />
            <span>{label}</span>
            <span className="text-xs opacity-80">{currentTime}</span>
          </div>
        )}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Nhân viên</p>
                <p className="font-semibold">Nguyễn Văn A</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Ngày</p>
                <p className="font-semibold">{new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Vị trí</p>
                <p className="font-semibold">
                  {currentLocation ? 'Đã xác định' : 'Chưa xác định'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Check-in Interface */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList variant="secondary" className="grid w-full grid-cols-2">
          <TabsTrigger variant="secondary" value="daily">
            <Calendar className="h-4 w-4 mr-2" />
            Chấm công theo ngày
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="shift">
            <Clock className="h-4 w-4 mr-2" />
            Chấm công theo ca
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Chấm công theo ngày làm việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderCheckButton('daily_start_check_in', 'Check In Đầu Ngày', 'default', 'daily')}
                {renderCheckButton('daily_end_check_out', 'Check Out Cuối Ngày', 'destructive', 'daily')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shift" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Chấm công theo ca làm việc
              </CardTitle>
              {currentShift && (
                <div className="p-4 bg-blue-50 rounded-lg mt-4">
                  <h4 className="font-medium text-blue-900">Ca làm việc hiện tại</h4>
                  <p className="text-blue-700">{currentShift.work_shifts?.name}</p>
                  <p className="text-sm text-blue-600">
                    {currentShift.work_shifts?.start_time} - {currentShift.work_shifts?.end_time}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderCheckButton('shift_start_check_in', 'Check In Đầu Ca', 'default', 'shift')}
                {renderCheckButton('shift_start_check_out', 'Check Out Đầu Ca', 'destructive', 'shift')}
                {renderCheckButton('shift_end_check_in', 'Check In Cuối Ca', 'default', 'shift')}
                {renderCheckButton('shift_end_check_out', 'Check Out Cuối Ca', 'destructive', 'shift')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
