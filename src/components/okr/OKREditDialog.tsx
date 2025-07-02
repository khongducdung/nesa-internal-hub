
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOKRData } from '@/hooks/useOKRData';
import { useAuth } from '@/hooks/useAuth';
import { useDepartments } from '@/hooks/useDepartments';
import { useEmployees } from '@/hooks/useEmployees';

interface OKREditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okr?: any;
  defaultOwnerType?: 'company' | 'department' | 'individual';
  defaultDepartmentId?: string;
}

export function OKREditDialog({ 
  open, 
  onOpenChange, 
  okr, 
  defaultOwnerType = 'individual',
  defaultDepartmentId 
}: OKREditDialogProps) {
  const { toast } = useToast();
  const { createOKR, updateOKR, currentCycle } = useOKRData();
  const { profile, isAdmin } = useAuth();
  const { data: departments = [] } = useDepartments();
  const { data: employees = [] } = useEmployees();

  const isManager = profile?.employee_level === 'level_1' || profile?.employee_level === 'level_2';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner_type: defaultOwnerType,
    department_id: defaultDepartmentId || '',
    employee_id: '',
    status: 'draft',
    parent_okr_id: '',
  });

  useEffect(() => {
    if (okr) {
      setFormData({
        title: okr.title || '',
        description: okr.description || '',
        owner_type: okr.owner_type || 'individual',
        department_id: okr.department_id || '',
        employee_id: okr.employee_id || '',
        status: okr.status || 'draft',
        parent_okr_id: okr.parent_okr_id || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        owner_type: defaultOwnerType,
        department_id: defaultDepartmentId || '',
        employee_id: '',
        status: 'draft',
        parent_okr_id: '',
      });
    }
  }, [okr, defaultOwnerType, defaultDepartmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề OKR",
        variant: "destructive",
      });
      return;
    }

    if (!currentCycle) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy chu kỳ OKR hiện tại",
        variant: "destructive",
      });
      return;
    }

    try {
      const okrData = {
        ...formData,
        // Xác định owner_id dựa trên owner_type
        owner_id: formData.owner_type === 'company' 
          ? 'company'
          : formData.owner_type === 'department'
          ? formData.department_id
          : formData.employee_id || profile?.employee_id,
        // Chỉ set department_id nếu là department OKR
        department_id: formData.owner_type === 'department' ? formData.department_id : undefined,
        // Chỉ set employee_id nếu là individual OKR
        employee_id: formData.owner_type === 'individual' ? (formData.employee_id || profile?.employee_id) : undefined,
      };

      if (okr) {
        await updateOKR(okr.id, okrData);
        toast({
          title: "Thành công",
          description: "OKR đã được cập nhật",
        });
      } else {
        await createOKR(okrData);
        toast({
          title: "Thành công", 
          description: "OKR mới đã được tạo",
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving OKR:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu OKR. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Xác định các options owner_type dựa trên quyền
  const getOwnerTypeOptions = () => {
    const options = [
      { value: 'individual', label: 'Cá nhân' }
    ];

    if (isManager || isAdmin) {
      options.push({ value: 'department', label: 'Phòng ban' });
    }

    if (isAdmin) {
      options.push({ value: 'company', label: 'Công ty' });
    }

    return options;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {okr ? 'Chỉnh sửa OKR' : 'Tạo OKR mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề OKR *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề OKR"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả chi tiết về OKR này"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner_type">Loại OKR *</Label>
              <Select
                value={formData.owner_type}
                onValueChange={(value) => setFormData({ ...formData, owner_type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại OKR" />
                </SelectTrigger>
                <SelectContent>
                  {getOwnerTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="active">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Department selection for department OKRs */}
          {formData.owner_type === 'department' && (
            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban *</Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) => setFormData({ ...formData, department_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Employee selection for individual OKRs (only for admin/manager) */}
          {formData.owner_type === 'individual' && (isAdmin || isManager) && (
            <div className="space-y-2">
              <Label htmlFor="employee">Nhân viên (để trống nếu là OKR của bạn)</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => setFormData({ ...formData, employee_id: value === 'self' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Của tôi</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">
              {okr ? 'Cập nhật' : 'Tạo OKR'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
