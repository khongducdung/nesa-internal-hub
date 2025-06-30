
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Clock, Users, Building2 } from 'lucide-react';
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { useShiftAssignments } from '@/hooks/useShiftAssignments';
import { ShiftAssignmentForm } from './ShiftAssignmentForm';

export function ShiftManagement() {
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  
  const { data: shifts = [] } = useWorkShifts();
  const { data: assignments = [] } = useShiftAssignments();

  const daysOfWeekMap = {
    0: 'CN', 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quản lý ca làm việc
            </CardTitle>
            <Dialog open={showAssignmentForm} onOpenChange={setShowAssignmentForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Phân công ca làm
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Phân công ca làm việc</DialogTitle>
                </DialogHeader>
                <ShiftAssignmentForm 
                  onClose={() => setShowAssignmentForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Danh sách ca làm việc */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ca làm việc có sẵn</h3>
              <div className="space-y-4">
                {shifts.map((shift) => (
                  <Card key={shift.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">{shift.name}</h4>
                      <Badge variant={shift.is_active ? 'default' : 'secondary'}>
                        {shift.is_active ? 'Hoạt động' : 'Ngưng'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{shift.start_time} - {shift.end_time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Nghỉ: {shift.break_duration_minutes} phút</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {shift.days_of_week.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs">
                            {daysOfWeekMap[day as keyof typeof daysOfWeekMap]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Danh sách phân công */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Phân công hiện tại</h3>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-medium">
                          {assignment.work_shifts?.name || 'Ca không xác định'}
                        </h4>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {assignment.employee_id && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>Cá nhân</span>
                            </div>
                          )}
                          {assignment.department_id && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>Phòng ban</span>
                            </div>
                          )}
                          {assignment.position_id && (
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                Chức vụ
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Từ {new Date(assignment.effective_from).toLocaleDateString('vi-VN')}
                          {assignment.effective_to && ` đến ${new Date(assignment.effective_to).toLocaleDateString('vi-VN')}`}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={assignment.is_active ? 'default' : 'secondary'}>
                          {assignment.is_active ? 'Hoạt động' : 'Ngưng'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingAssignment(assignment.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
