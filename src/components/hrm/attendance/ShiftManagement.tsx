
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Clock, Users, Building2, UserCheck } from 'lucide-react';
import { useShiftAssignments } from '@/hooks/useShiftAssignments';
import { ShiftAssignmentForm } from './ShiftAssignmentForm';
import { WorkShiftsList } from './WorkShiftsList';

export function ShiftManagement() {
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  
  const { data: assignments = [] } = useShiftAssignments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Clock className="h-7 w-7 text-blue-600" />
            Quản lý ca làm việc
          </h2>
          <p className="text-gray-600 mt-1">Thiết lập ca làm việc và phân công cho nhân viên</p>
        </div>
      </div>

      <Tabs defaultValue="shifts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="shifts" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Ca làm việc có sẵn
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Phân công hiện tại
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shifts" className="space-y-6">
          <WorkShiftsList />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Phân công hiện tại</h3>
              <p className="text-sm text-gray-500 mt-1">Quản lý việc phân công ca làm việc cho nhân viên, phòng ban hoặc chức vụ</p>
            </div>
            <Dialog open={showAssignmentForm} onOpenChange={setShowAssignmentForm}>
              <DialogTrigger asChild>
                <Button className="shadow-sm">
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

          {assignments.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCheck className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phân công nào</h3>
                <p className="text-gray-500 text-center max-w-sm mb-6">
                  Phân công ca làm việc cho nhân viên, phòng ban hoặc chức vụ để bắt đầu quản lý chấm công
                </p>
                <Button onClick={() => setShowAssignmentForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo phân công đầu tiên
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-base font-medium text-gray-900 mb-2">
                          {assignment.work_shifts?.name || 'Ca không xác định'}
                        </CardTitle>
                        <Badge variant={assignment.is_active ? 'default' : 'secondary'} className="text-xs">
                          {assignment.is_active ? 'Hoạt động' : 'Ngưng hoạt động'}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setEditingAssignment(assignment.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {assignment.employee_id && (
                        <>
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>Nhân viên: {assignment.employees?.full_name}</span>
                        </>
                      )}
                      {assignment.department_id && (
                        <>
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span>Phòng ban: {assignment.departments?.name}</span>
                        </>
                      )}
                      {assignment.position_id && (
                        <>
                          <Badge variant="outline" className="text-xs">
                            Chức vụ: {assignment.positions?.name}
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                      Từ {new Date(assignment.effective_from).toLocaleDateString('vi-VN')}
                      {assignment.effective_to && ` đến ${new Date(assignment.effective_to).toLocaleDateString('vi-VN')}`}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
