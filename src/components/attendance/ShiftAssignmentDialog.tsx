import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building, Briefcase, Calendar } from 'lucide-react';
import { useWorkShifts } from '@/hooks/useWorkShifts';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useShiftAssignmentMutations } from '@/hooks/useShiftAssignmentMutations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format, parse } from 'date-fns';
interface ShiftAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
}
export function ShiftAssignmentDialog({
  open,
  onClose
}: ShiftAssignmentDialogProps) {
  const {
    profile
  } = useAuth();
  const {
    data: workShifts
  } = useWorkShifts();
  const {
    data: employees
  } = useEmployees();
  const {
    data: departments
  } = useDepartments();
  const {
    data: positions
  } = usePositions();
  const {
    createAssignment
  } = useShiftAssignmentMutations();
  const {
    toast
  } = useToast();
  const [assignmentType, setAssignmentType] = useState<'employee' | 'department' | 'position'>('employee');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [effectiveFrom, setEffectiveFrom] = useState(format(new Date(), 'dd/MM/yyyy'));
  const [effectiveTo, setEffectiveTo] = useState('');
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      return format(parsedDate, 'yyyy-MM-dd');
    } catch {
      return dateString;
    }
  };
  const getTargetOptions = () => {
    switch (assignmentType) {
      case 'employee':
        return employees?.map(emp => ({
          id: emp.id,
          name: `${emp.full_name} - ${emp.employee_code}`,
          subtitle: emp.departments?.name || 'N/A'
        })) || [];
      case 'department':
        return departments?.map(dept => ({
          id: dept.id,
          name: dept.name,
          subtitle: dept.description || 'Phòng ban'
        })) || [];
      case 'position':
        return positions?.map(pos => ({
          id: pos.id,
          name: pos.name,
          subtitle: pos.departments?.name || 'Vị trí'
        })) || [];
      default:
        return [];
    }
  };
  const handleSubmit = async () => {
    if (!selectedShift || selectedTargets.length === 0 || !profile?.employee_id) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn ca làm việc và ít nhất một đối tượng',
        variant: 'destructive'
      });
      return;
    }
    try {
      for (const targetId of selectedTargets) {
        const assignmentData = {
          work_shift_id: selectedShift,
          effective_from: formatDate(effectiveFrom),
          effective_to: effectiveTo ? formatDate(effectiveTo) : undefined,
          created_by: profile.employee_id,
          ...(assignmentType === 'employee' && {
            employee_id: targetId
          }),
          ...(assignmentType === 'department' && {
            department_id: targetId
          }),
          ...(assignmentType === 'position' && {
            position_id: targetId
          })
        };
        await createAssignment.mutateAsync(assignmentData);
      }
      toast({
        title: 'Thành công',
        description: `Đã phân công ca cho ${selectedTargets.length} đối tượng`
      });

      // Reset form
      setSelectedShift('');
      setSelectedTargets([]);
      setEffectiveFrom(format(new Date(), 'dd/MM/yyyy'));
      setEffectiveTo('');
      onClose();
    } catch (error) {
      console.error('Error creating assignments:', error);
    }
  };
  const handleTargetToggle = (targetId: string) => {
    setSelectedTargets(prev => prev.includes(targetId) ? prev.filter(id => id !== targetId) : [...prev, targetId]);
  };
  const targetOptions = getTargetOptions();
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Phân công ca làm việc</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Chọn ca làm việc</Label>
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn ca làm việc" />
              </SelectTrigger>
              <SelectContent>
                {workShifts?.map(shift => <SelectItem key={shift.id} value={shift.id}>
                    {shift.name} ({shift.start_time} - {shift.end_time})
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phân công cho</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={assignmentType === 'employee' ? 'default' : 'outline'} onClick={() => {
              setAssignmentType('employee');
              setSelectedTargets([]);
            }} className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nhân viên
              </Button>
              <Button variant={assignmentType === 'department' ? 'default' : 'outline'} onClick={() => {
              setAssignmentType('department');
              setSelectedTargets([]);
            }} className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Phòng ban
              </Button>
              <Button variant={assignmentType === 'position' ? 'default' : 'outline'} onClick={() => {
              setAssignmentType('position');
              setSelectedTargets([]);
            }} className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Vị trí
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effective_from">Ngày bắt đầu</Label>
              <Input id="effective_from" value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} placeholder="dd/mm/yyyy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effective_to">Ngày kết thúc</Label>
              <Input id="effective_to" value={effectiveTo} onChange={e => setEffectiveTo(e.target.value)} placeholder="dd/mm/yyyy (để trống nếu vô thời hạn)" />
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    {assignmentType === 'employee' && 'Chọn nhân viên'}
                    {assignmentType === 'department' && 'Chọn phòng ban'}
                    {assignmentType === 'position' && 'Chọn vị trí'}
                  </Label>
                  <span className="text-sm text-gray-500">
                    Đã chọn: {selectedTargets.length}/{targetOptions.length}
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {targetOptions.map(option => <div key={option.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedTargets.includes(option.id) ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => handleTargetToggle(option.id)}>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-gray-500">{option.subtitle}</div>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 ${selectedTargets.includes(option.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                        {selectedTargets.includes(option.id) && <div className="w-full h-full bg-blue-500 rounded flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>}
                      </div>
                    </div>)}

                  {targetOptions.length === 0 && <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {assignmentType === 'employee' && 'Không có nhân viên nào'}
                        {assignmentType === 'department' && 'Không có phòng ban nào'}
                        {assignmentType === 'position' && 'Không có vị trí nào'}
                      </p>
                    </div>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedShift || selectedTargets.length === 0 || createAssignment.isPending}>
              Phân công ({selectedTargets.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}