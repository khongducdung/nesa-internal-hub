
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Clock, Calendar } from 'lucide-react';
import { useWorkShifts } from '@/hooks/useWorkShifts';

const daysOfWeekMap = {
  0: 'CN',
  1: 'T2',
  2: 'T3', 
  3: 'T4',
  4: 'T5',
  5: 'T6',
  6: 'T7'
};

export function WorkShiftsList() {
  const { data: shifts, isLoading } = useWorkShifts();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ca làm việc</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm ca làm việc
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shifts?.map((shift) => (
          <Card key={shift.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{shift.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{shift.start_time} - {shift.end_time}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Nghỉ trưa:</span>
                <div>{shift.break_duration_minutes} phút</div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {shift.days_of_week.map((day) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {daysOfWeekMap[day as keyof typeof daysOfWeekMap]}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Badge variant={shift.is_active ? 'default' : 'secondary'}>
                  {shift.is_active ? 'Hoạt động' : 'Ngưng'}
                </Badge>
                {shift.attendance_settings && (
                  <span className="text-xs text-muted-foreground">
                    {shift.attendance_settings.name}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
