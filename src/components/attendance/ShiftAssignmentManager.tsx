
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Users, Building, Briefcase, Plus, Trash2, Clock } from 'lucide-react';
import { useShiftAssignments } from '@/hooks/useShiftAssignments';
import { useShiftAssignmentMutations } from '@/hooks/useShiftAssignmentMutations';
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format, parse } from 'date-fns';

interface AssignmentForm {
  work_shift_id: string;
  assignment_type: 'employee' | 'department' | 'position';
  target_id: string;
  effective_from: string;
  effective_to: string;
}

export function ShiftAssignmentManager() {
  const { profile } = useAuth();
  const { data: assignments, isLoading: assignmentsLoading } = useShiftAssignments();
  const { data: workShifts } = useWorkShifts();
  const { data: employees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();
  const { createAssignment, deleteAssignment } = useShiftAssignmentMutations();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AssignmentForm>({
    work_shift_id: '',
    assignment_type: 'employee',
    target_id: '',
    effective_from: format(new Date(), 'dd/MM/yyyy'),
    effective_to: ''
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      // Parse dd/MM/yyyy format and convert to yyyy-MM-dd for database
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      return format(parsedDate, 'yyyy-MM-dd');
    } catch {
      return dateString;
    }
  };

  const displayDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.work_shift_id || !formData.target_id || !profile?.employee_id) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      });
      return;
    }

    const assignmentData = {
      work_shift_id: formData.work_shift_id,
      effective_from: formatDate(formData.effective_from),
      effective_to: formData.effective_to ? formatDate(formData.effective_to) : undefined,
      created_by: profile.employee_id,
      ...(formData.assignment_type === 'employee' && { employee_id: formData.target_id }),
      ...(formData.assignment_type === 'department' && { department_id: formData.target_id }),
      ...(formData.assignment_type === 'position' && { position_id: formData.target_id })
    };

    try {
      await createAssignment.mutateAsync(assignmentData);
      setShowForm(false);
      setFormData({
        work_shift_id: '',
        assignment_type: 'employee',
        target_id: '',
        effective_from: format(new Date(), 'dd/MM/yyyy'),
        effective_to: ''
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const getTargetOptions = () => {
    switch (formData.assignment_type) {
      case 'employee':
        return employees?.map(emp => ({ id: emp.id, name: `${emp.full_name} - ${emp.employee_code}` })) || [];
      case 'department':
        return departments?.map(dept => ({ id: dept.id, name: dept.name })) || [];
      case 'position':
        return positions?.map(pos => ({ id: pos.id, name: pos.name })) || [];
      default:
        return [];
    }
  };

  const getAssignmentTargetName = (assignment: any) => {
    if (assignment.employees) {
      return `${assignment.employees.full_name} - ${assignment.employees.employee_code}`;
    } else if (assignment.departments) {
      return assignment.departments.name;
    } else if (assignment.positions) {
      return assignment.positions.name;
    }
    return 'N/A';
  };

  const getAssignmentType = (assignment: any) => {
    if (assignment.employee_id) return 'Nhân viên';
    if (assignment.department_id) return 'Phòng ban';
    if (assignment.position_id) return 'Vị trí';
    return 'N/A';
  };

  const getAssignmentIcon = (assignment: any) => {
    if (assignment.employee_id) return <Users className="h-4 w-4" />;
    if (assignment.department_id) return <Building className="h-4 w-4" />;
    if (assignment.position_id) return <Briefcase className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  if (assignmentsLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Phân công ca làm việc</h3>
          <p className="text-sm text-gray-600">Gán ca làm việc cho nhân viên, phòng ban hoặc vị trí</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Phân công ca
        </Button>
      </div>

      {/* Form phân công */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tạo phân công ca mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Ca làm việc *</Label>
                  <Select 
                    value={formData.work_shift_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, work_shift_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ca làm việc" />
                    </SelectTrigger>
                    <SelectContent>
                      {workShifts?.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.name} ({shift.start_time} - {shift.end_time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Loại phân công</Label>
                  <Select 
                    value={formData.assignment_type} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      assignment_type: value as 'employee' | 'department' | 'position',
                      target_id: '' 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Nhân viên</SelectItem>
                      <SelectItem value="department">Phòng ban</SelectItem>
                      <SelectItem value="position">Vị trí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>
                  {formData.assignment_type === 'employee' && 'Nhân viên *'}
                  {formData.assignment_type === 'department' && 'Phòng ban *'}
                  {formData.assignment_type === 'position' && 'Vị trí *'}
                </Label>
                <Select 
                  value={formData.target_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, target_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Chọn ${
                      formData.assignment_type === 'employee' ? 'nhân viên' :
                      formData.assignment_type === 'department' ? 'phòng ban' : 'vị trí'
                    }`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getTargetOptions().map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="effective_from">Ngày bắt đầu (dd/mm/yyyy) *</Label>
                  <Input
                    id="effective_from"
                    value={formData.effective_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, effective_from: e.target.value }))}
                    placeholder="dd/mm/yyyy"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="effective_to">Ngày kết thúc (dd/mm/yyyy)</Label>
                  <Input
                    id="effective_to"
                    value={formData.effective_to}
                    onChange={(e) => setFormData(prev => ({ ...prev, effective_to: e.target.value }))}
                    placeholder="dd/mm/yyyy (để trống nếu vô thời hạn)"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createAssignment.isPending}>
                  Tạo phân công
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      work_shift_id: '',
                      assignment_type: 'employee',
                      target_id: '',
                      effective_from: format(new Date(), 'dd/MM/yyyy'),
                      effective_to: ''
                    });
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Danh sách phân công */}
      <div className="space-y-4">
        {assignments?.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getAssignmentIcon(assignment)}
                    <div>
                      <h4 className="font-medium">{getAssignmentTargetName(assignment)}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">{getAssignmentType(assignment)}</Badge>
                        {assignment.work_shifts && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{assignment.work_shifts.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {displayDate(assignment.effective_from)}
                        {assignment.effective_to && ` - ${displayDate(assignment.effective_to)}`}
                        {!assignment.effective_to && ' - Vô thời hạn'}
                      </span>
                    </div>
                    {assignment.work_shifts && (
                      <span>
                        {assignment.work_shifts.start_time} - {assignment.work_shifts.end_time}
                      </span>
                    )}
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận hủy phân công</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc muốn hủy phân công ca này cho "{getAssignmentTargetName(assignment)}"?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteAssignment.mutateAsync(assignment.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Xác nhận
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!assignments || assignments.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có phân công ca nào</p>
            <p className="text-sm">Nhấn "Phân công ca" để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
}
