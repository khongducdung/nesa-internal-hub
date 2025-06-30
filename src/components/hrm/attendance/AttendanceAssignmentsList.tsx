
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, User, Building, Briefcase, Calendar } from 'lucide-react';
import { useAttendanceAssignments } from '@/hooks/useAttendanceAssignments';

export function AttendanceAssignmentsList() {
  const { data: assignments, isLoading } = useAttendanceAssignments();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  const getAssignmentTarget = (assignment: any) => {
    if (assignment.employees) {
      return {
        type: 'Nhân viên',
        name: assignment.employees.full_name,
        code: assignment.employees.employee_code,
        icon: User
      };
    } else if (assignment.departments) {
      return {
        type: 'Phòng ban',
        name: assignment.departments.name,
        icon: Building
      };
    } else if (assignment.positions) {
      return {
        type: 'Vị trí',
        name: assignment.positions.name,
        icon: Briefcase
      };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Phân công chấm công</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm phân công
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments?.map((assignment) => {
          const target = getAssignmentTarget(assignment);
          const TargetIcon = target?.icon || User;
          
          return (
            <Card key={assignment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {assignment.attendance_settings?.name}
                  </CardTitle>
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
                {target && (
                  <div className="flex items-center gap-2 text-sm">
                    <TargetIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Badge variant="outline" className="text-xs mr-2">
                        {target.type}
                      </Badge>
                      <span>{target.name}</span>
                      {target.code && (
                        <span className="text-muted-foreground ml-1">({target.code})</span>
                      )}
                    </div>
                  </div>
                )}
                
                {assignment.work_shifts && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Ca làm việc:</span>
                    <div>{assignment.work_shifts.name}</div>
                  </div>
                )}

                {assignment.attendance_locations && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Địa điểm:</span>
                    <div>{assignment.attendance_locations.name}</div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Từ {new Date(assignment.effective_from).toLocaleDateString('vi-VN')}
                    {assignment.effective_to && 
                      ` đến ${new Date(assignment.effective_to).toLocaleDateString('vi-VN')}`
                    }
                  </span>
                </div>

                <div className="flex justify-end">
                  <Badge variant={assignment.is_active ? 'default' : 'secondary'}>
                    {assignment.is_active ? 'Hoạt động' : 'Ngưng'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
