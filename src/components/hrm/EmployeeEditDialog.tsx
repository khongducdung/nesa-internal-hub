
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useEmployees } from '@/hooks/useEmployees';
import { useUpdateEmployee } from '@/hooks/useEmployeeMutations';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';

interface EmployeeEditDialogProps {
  employeeId: string;
  open: boolean;
  onClose: () => void;
}

export function EmployeeEditDialog({ employeeId, open, onClose }: EmployeeEditDialogProps) {
  const { data: employees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();
  const updateEmployee = useUpdateEmployee();
  
  const employee = employees?.find(emp => emp.id === employeeId);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department_id: '',
    position_id: '',
    employee_level: 'level_3' as 'level_1' | 'level_2' | 'level_3',
    work_status: 'active' as 'active' | 'inactive' | 'pending',
    salary: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    notes: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department_id: employee.department_id || '',
        position_id: employee.position_id || '',
        employee_level: employee.employee_level || 'level_3',
        work_status: employee.work_status || 'active',
        salary: employee.salary?.toString() || '',
        address: employee.address || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        notes: employee.notes || '',
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      ...formData,
      salary: formData.salary ? parseFloat(formData.salary) : null,
    };

    await updateEmployee.mutateAsync({ id: employeeId, data: updateData });
    onClose();
  };

  const filteredPositions = positions?.filter(pos => 
    !formData.department_id || pos.department_id === formData.department_id
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Lương (VNĐ)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban</Label>
              <Select 
                value={formData.department_id} 
                onValueChange={(value) => setFormData({...formData, department_id: value, position_id: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Vị trí</Label>
              <Select 
                value={formData.position_id} 
                onValueChange={(value) => setFormData({...formData, position_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPositions?.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employee_level">Cấp bậc</Label>
              <Select 
                value={formData.employee_level} 
                onValueChange={(value: 'level_1' | 'level_2' | 'level_3') => setFormData({...formData, employee_level: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level_1">Cấp 1 (Quản lý)</SelectItem>
                  <SelectItem value="level_2">Cấp 2 (Trưởng nhóm)</SelectItem>
                  <SelectItem value="level_3">Cấp 3 (Nhân viên)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="work_status">Trạng thái</Label>
              <Select 
                value={formData.work_status} 
                onValueChange={(value: 'active' | 'inactive' | 'pending') => setFormData({...formData, work_status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Người liên hệ khẩn cấp</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">SĐT liên hệ khẩn cấp</Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <RichTextEditor
              value={formData.notes}
              onChange={(value) => setFormData({...formData, notes: value})}
              placeholder="Nhập ghi chú về nhân viên..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={updateEmployee.isPending}>
              {updateEmployee.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
