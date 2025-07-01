
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, Settings, Calendar, BarChart3 } from 'lucide-react';
import { WorkShiftsList } from './WorkShiftsList';
import { WorkShiftDialog } from './WorkShiftDialog';
import { ShiftAssignmentDialog } from './ShiftAssignmentDialog';
import { useWorkShifts } from '@/hooks/useWorkShifts';

export function WorkScheduleManagement() {
  const { data: shifts } = useWorkShifts();
  const [showShiftDialog, setShowShiftDialog] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [editingShift, setEditingShift] = useState<string | undefined>();

  // Calculate statistics
  const shiftStats = React.useMemo(() => {
    if (!shifts) return { fulltime: 0, parttime: 0, flexible: 0, total: 0 };
    
    return shifts.reduce((stats, shift) => {
      stats.total++;
      switch (shift.shift_type) {
        case 'fulltime':
          stats.fulltime++;
          break;
        case 'parttime':
          stats.parttime++;
          break;
        case 'flexible':
          stats.flexible++;
          break;
      }
      return stats;
    }, { fulltime: 0, parttime: 0, flexible: 0, total: 0 });
  }, [shifts]);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Thiết kế lịch làm việc
          </h2>
          <p className="text-gray-600">Quản lý các ca làm việc và phân công nhân viên</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAssignmentDialog(true)} variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Phân công ca
          </Button>
          <Button onClick={() => setShowShiftDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo ca làm việc
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số ca</p>
                <p className="text-2xl font-bold text-blue-600">{shiftStats.total}</p>
                <p className="text-sm text-gray-500">Ca làm việc</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full-time</p>
                <p className="text-2xl font-bold text-green-600">{shiftStats.fulltime}</p>
                <p className="text-sm text-gray-500">8 giờ/ngày</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Part-time</p>
                <p className="text-2xl font-bold text-orange-600">{shiftStats.parttime}</p>
                <p className="text-sm text-gray-500">4 giờ/ngày</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Linh hoạt</p>
                <p className="text-2xl font-bold text-purple-600">{shiftStats.flexible}</p>
                <p className="text-sm text-gray-500">6-10 giờ/ngày</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Info Cards */}
      {shifts && shifts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shifts.slice(0, 3).map((shift) => {
            const totalHours = shift.work_sessions?.reduce((total, session) => {
              const start = new Date(`2000-01-01T${session.start_time}:00`);
              const end = new Date(`2000-01-01T${session.end_time}:00`);
              let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              if (diff < 0) diff += 24;
              return total + diff;
            }, 0) || 0;

            const adjustedHours = totalHours * (shift.total_work_coefficient || 1);

            return (
              <Card key={shift.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate">{shift.name}</h3>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: shift.color || '#3B82F6' }}
                    />
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{shift.start_time} - {shift.end_time}</p>
                    <div className="flex items-center justify-between">
                      <span>{adjustedHours.toFixed(1)}h/ngày</span>
                      <Badge variant="outline" className="text-xs">
                        {shift.work_sessions?.length || 0} ca
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Work Shifts List */}
      <WorkShiftsList 
        onEditShift={(id) => {
          setEditingShift(id);
          setShowShiftDialog(true);
        }}
      />

      {/* Dialogs */}
      <WorkShiftDialog
        open={showShiftDialog}
        onClose={() => {
          setShowShiftDialog(false);
          setEditingShift(undefined);
        }}
        shiftId={editingShift}
      />

      <ShiftAssignmentDialog
        open={showAssignmentDialog}
        onClose={() => setShowAssignmentDialog(false)}
      />
    </div>
  );
}
