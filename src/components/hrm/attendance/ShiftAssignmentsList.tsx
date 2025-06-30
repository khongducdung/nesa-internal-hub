
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, User, Building, Briefcase, Calendar } from 'lucide-react';
import { useShiftAssignments } from '@/hooks/useShiftAssignments';
import { ShiftAssignmentForm } from './ShiftAssignmentForm';

export function ShiftAssignmentsList() {
  const { data: assignments, isLoading } = useShiftAssignments();
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Phân công ca làm việc</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý phân công ca làm việc cho nhân viên</p>
          </div>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm phân công
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm phân công ca làm việc</DialogTitle>
              </DialogHeader>
              <ShiftAssignmentForm onClose={() => setShowCreateForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {assignments?.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phân công nào</h3>
            <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
              Thêm phân công ca làm việc đầu tiên cho nhân viên
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm phân công đầu tiên
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-medium text-gray-700">Đối tượng</TableHead>
                <TableHead className="font-medium text-gray-700">Ca làm việc</TableHead>
                <TableHead className="font-medium text-gray-700">Thời gian hiệu lực</TableHead>
                <TableHead className="font-medium text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-medium text-gray-700 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments?.map((assignment) => {
                const target = getAssignmentTarget(assignment);
                const TargetIcon = target?.icon || User;
                
                return (
                  <TableRow key={assignment.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      {target && (
                        <div className="flex items-center gap-3">
                          <TargetIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{target.name}</span>
                              <Badge variant="outline" className="text-xs border-gray-200">
                                {target.type}
                              </Badge>
                            </div>
                            {target.code && (
                              <span className="text-sm text-gray-500">({target.code})</span>
                            )}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.work_shifts && (
                        <div className="font-medium text-gray-900">
                          {assignment.work_shifts.name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          Từ {new Date(assignment.effective_from).toLocaleDateString('vi-VN')}
                          {assignment.effective_to && 
                            ` đến ${new Date(assignment.effective_to).toLocaleDateString('vi-VN')}`
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={assignment.is_active ? 'default' : 'secondary'}
                        className={assignment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                      >
                        {assignment.is_active ? 'Hoạt động' : 'Ngưng'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
