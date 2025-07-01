
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkShiftsListProps {
  onEditShift: (id: string) => void;
}

export function WorkShiftsList({ onEditShift }: WorkShiftsListProps) {
  const { data: shifts, isLoading } = useWorkShifts();

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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shifts?.map((shift) => (
            <div key={shift.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{shift.start_time} - {shift.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{getDaysOfWeekText(shift.days_of_week || [])}</span>
                    </div>
                  </div>

                  {shift.shift_type === 'flexible' && (
                    <div className="mt-2 text-sm text-gray-600">
                      Giờ làm việc: {shift.min_hours_per_day}h - {shift.max_hours_per_day}h/ngày
                    </div>
                  )}

                  {shift.description && (
                    <p className="mt-2 text-sm text-gray-600">{shift.description}</p>
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {(!shifts || shifts.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có ca làm việc nào</p>
              <p className="text-sm">Nhấn "Tạo ca làm việc" để bắt đầu</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
