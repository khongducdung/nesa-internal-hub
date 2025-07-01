
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Clock, Calendar, Users } from 'lucide-react';
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { useWorkShiftMutations } from '@/hooks/useWorkShiftMutations';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkShiftsListProps {
  onEditShift: (id: string) => void;
}

export function WorkShiftsList({ onEditShift }: WorkShiftsListProps) {
  const { data: shifts, isLoading } = useWorkShifts();
  const { deleteShift } = useWorkShiftMutations();
  const { toast } = useToast();

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'fulltime': return 'bg-blue-100 text-blue-800';
      case 'parttime': return 'bg-green-100 text-green-800';
      case 'flexible': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftTypeName = (type: string) => {
    switch (type) {
      case 'fulltime': return 'Full-time';
      case 'parttime': return 'Part-time';
      case 'flexible': return 'Linh hoạt';
      default: return type;
    }
  };

  const getDaysOfWeekText = (days: number[]) => {
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days.map(day => dayNames[day]).join(', ');
  };

  const calculateWorkSessionsTotal = (sessions: any[]) => {
    if (!sessions || sessions.length === 0) return 0;
    
    return sessions.reduce((total, session) => {
      const start = new Date(`2000-01-01T${session.start_time}:00`);
      const end = new Date(`2000-01-01T${session.end_time}:00`);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (diff < 0) diff += 24;
      return total + diff;
    }, 0);
  };

  const handleDeleteShift = async (id: string, name: string) => {
    try {
      await deleteShift.mutateAsync(id);
      toast({
        title: 'Đã xóa ca làm việc',
        description: `Ca "${name}" đã được xóa thành công`
      });
    } catch (error) {
      console.error('Error deleting shift:', error);
      toast({
        title: 'Lỗi xóa ca làm việc',
        description: 'Không thể xóa ca làm việc. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Danh sách ca làm việc
          {shifts && shifts.length > 0 && (
            <Badge variant="secondary">{shifts.length} ca</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shifts?.map((shift) => {
            const totalHours = calculateWorkSessionsTotal(shift.work_sessions);
            const adjustedHours = totalHours * (shift.total_work_coefficient || 1);
            
            return (
              <div key={shift.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-medium text-lg">{shift.name}</h3>
                      <Badge className={getShiftTypeColor(shift.shift_type || 'fulltime')}>
                        {getShiftTypeName(shift.shift_type || 'fulltime')}
                      </Badge>
                      {shift.color && (
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: shift.color }}
                        />
                      )}
                      <Badge variant="outline">
                        {adjustedHours.toFixed(1)}h/ngày
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{shift.start_time} - {shift.end_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{getDaysOfWeekText(shift.days_of_week || [])}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Hệ số: {shift.total_work_coefficient || 1}</span>
                      </div>
                    </div>

                    {/* Work Sessions Info */}
                    {shift.work_sessions && shift.work_sessions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Ca làm việc:</div>
                        <div className="flex flex-wrap gap-2">
                          {shift.work_sessions.map((session, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {session.name}: {session.start_time} - {session.end_time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Saturday Work Info */}
                    {shift.saturday_work_type && shift.saturday_work_type !== 'off' && (
                      <div className="mb-3">
                        <div className="text-sm text-blue-600">
                          Thứ 7: {shift.saturday_work_type === 'full' ? 'Cả ngày' : 
                                  shift.saturday_work_type === 'half_morning' ? 'Nửa ngày sáng' : 'Nửa ngày chiều'}
                        </div>
                      </div>
                    )}

                    {shift.shift_type === 'flexible' && (
                      <div className="text-sm text-gray-600 mb-3">
                        Giờ làm việc linh hoạt: {shift.min_hours_per_day}h - {shift.max_hours_per_day}h/ngày
                      </div>
                    )}

                    {shift.description && (
                      <p className="text-sm text-gray-600">{shift.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditShift(shift.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa ca làm việc</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa ca làm việc "{shift.name}"? 
                            Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteShift(shift.id, shift.name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}

          {(!shifts || shifts.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Chưa có ca làm việc nào</p>
              <p className="text-sm">Nhấn "Tạo ca làm việc" để bắt đầu</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
