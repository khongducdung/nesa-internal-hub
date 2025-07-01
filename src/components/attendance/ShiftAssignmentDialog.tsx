
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building, Briefcase } from 'lucide-react';

interface ShiftAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ShiftAssignmentDialog({ open, onClose }: ShiftAssignmentDialogProps) {
  const [assignmentType, setAssignmentType] = useState<'employee' | 'department' | 'position'>('employee');
  const [selectedShift, setSelectedShift] = useState('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <SelectItem value="morning">Ca sáng (08:00 - 17:00)</SelectItem>
                <SelectItem value="parttime">Ca bán thời gian (08:00 - 12:00)</SelectItem>
                <SelectItem value="flexible">Ca linh hoạt (08:00 - 17:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phân công cho</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={assignmentType === 'employee' ? 'default' : 'outline'}
                onClick={() => setAssignmentType('employee')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Nhân viên
              </Button>
              <Button
                variant={assignmentType === 'department' ? 'default' : 'outline'}
                onClick={() => setAssignmentType('department')}
                className="flex items-center gap-2"
              >
                <Building className="h-4 w-4" />
                Phòng ban
              </Button>
              <Button
                variant={assignmentType === 'position' ? 'default' : 'outline'}
                onClick={() => setAssignmentType('position')}
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Vị trí
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày bắt đầu</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Ngày kết thúc (tùy chọn)</Label>
              <Input type="date" />
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {assignmentType === 'employee' && 'Chọn nhân viên'}
                  {assignmentType === 'department' && 'Chọn phòng ban'}
                  {assignmentType === 'position' && 'Chọn vị trí'}
                </Label>

                <div className="max-h-40 overflow-y-auto space-y-2">
                  {assignmentType === 'employee' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="emp1" />
                        <Label htmlFor="emp1">Nguyễn Văn A - NV001</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="emp2" />
                        <Label htmlFor="emp2">Trần Thị B - NV002</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="emp3" />
                        <Label htmlFor="emp3">Lê Văn C - NV003</Label>
                      </div>
                    </>
                  )}

                  {assignmentType === 'department' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dept1" />
                        <Label htmlFor="dept1">Phòng Nhân sự</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dept2" />
                        <Label htmlFor="dept2">Phòng IT</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dept3" />
                        <Label htmlFor="dept3">Phòng Kế toán</Label>
                      </div>
                    </>
                  )}

                  {assignmentType === 'position' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pos1" />
                        <Label htmlFor="pos1">Nhân viên</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pos2" />
                        <Label htmlFor="pos2">Trưởng phòng</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pos3" />
                        <Label htmlFor="pos3">Giám đốc</Label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button>
              Phân công
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
