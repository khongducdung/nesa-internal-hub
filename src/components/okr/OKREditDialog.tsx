
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
import { KeyResultForm, KeyResultFormData } from './KeyResultForm';
import { OKRCycleForm } from './OKRCycleForm';
import { Plus } from 'lucide-react';

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
  const { createOKR, updateOKR, currentCycle, cycles } = useOKRData();
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
    cycle_id: currentCycle?.id || '',
  });

  const [keyResults, setKeyResults] = useState<KeyResultFormData[]>([]);
  const [showCycleForm, setShowCycleForm] = useState(false);

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
        cycle_id: okr.cycle_id || currentCycle?.id || '',
      });
      
      // Load existing key results
      if (okr.key_results) {
        setKeyResults(okr.key_results.map((kr: any) => ({
          id: kr.id,
          title: kr.title,
          description: kr.description || '',
          target_value: kr.target_value,
          unit: kr.unit,
          weight: kr.weight,
          due_date: kr.due_date || '',
          linked_okr_id: kr.linked_okr_id || '',
          linked_department_id: kr.linked_department_id || '',
        })));
      }
    } else {
      setFormData({
        title: '',
        description: '',
        owner_type: defaultOwnerType,
        department_id: defaultDepartmentId || '',
        employee_id: '',
        status: 'draft',
        parent_okr_id: '',
        cycle_id: currentCycle?.id || '',
      });
      setKeyResults([]);
    }
  }, [okr, defaultOwnerType, defaultDepartmentId, currentCycle]);

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

    if (keyResults.length === 0) {
      toast({
        title: "Lỗi", 
        description: "OKR phải có ít nhất 1 Key Result",
        variant: "destructive",
      });
      return;
    }

    // Validate key results
    for (const kr of keyResults) {
      if (!kr.title.trim() || !kr.unit.trim() || kr.target_value <= 0) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin cho tất cả Key Results",
          variant: "destructive",
        });
        return;
      }
    }

    if (!formData.cycle_id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn chu kỳ OKR",
        variant: "destructive",
      });
      return;
    }

    // Validate hierarchical linking for individual OKRs
    if (formData.owner_type === 'individual') {
      const hasLinkedKR = keyResults.some(kr => kr.linked_okr_id);
      if (!hasLinkedKR) {
        toast({
          title: "Lỗi",
          description: "OKR cá nhân phải có ít nhất 1 Key Result liên kết với OKR phòng ban hoặc công ty",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const okrData = {
        ...formData,
        // Determine owner_id based on owner_type
        owner_id: formData.owner_type === 'company' 
          ? 'company'
          : formData.owner_type === 'department'
          ? formData.department_id
          : formData.employee_id || profile?.employee_id,
        // Only set department_id if it's a department OKR
        department_id: formData.owner_type === 'department' ? formData.department_id : undefined,
        // Only set employee_id if it's an individual OKR
        employee_id: formData.owner_type === 'individual' ? (formData.employee_id || profile?.employee_id) : undefined,
        status: formData.status as 'draft' | 'active' | 'completed' | 'cancelled',
        key_results: keyResults as any[],
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

  // Determine owner type options based on permissions
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {okr ? 'Chỉnh sửa OKR' : 'Tạo OKR mới'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề OKR (Objective) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: Tăng trưởng doanh thu bền vững"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết về mục tiêu này"
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
                <Label htmlFor="cycle">Chu kỳ OKR *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.cycle_id}
                    onValueChange={(value) => setFormData({ ...formData, cycle_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chu kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      {cycles.map((cycle) => (
                        <SelectItem key={cycle.id} value={cycle.id}>
                          {cycle.name} ({cycle.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isAdmin && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowCycleForm(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  value={formData.employee_id || 'self'}
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

            {/* Hierarchical Linking Information */}
            {formData.owner_type === 'individual' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Yêu cầu liên kết phân cấp</h4>
                <p className="text-xs text-blue-700">
                  OKR cá nhân phải có ít nhất 1 Key Result liên kết với OKR phòng ban hoặc công ty để đảm bảo sự đồng bộ trong tổ chức.
                </p>
              </div>
            )}

            {formData.owner_type === 'company' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 mb-2">🏢 Liên kết phòng ban</h4>
                <p className="text-xs text-green-700">
                  Khuyến nghị liên kết các Key Results của công ty với các phòng ban cụ thể để tạo sự rõ ràng trong trách nhiệm thực hiện.
                </p>
              </div>
            )}

            {/* Key Results Form */}
            <KeyResultForm 
              keyResults={keyResults}
              onKeyResultsChange={setKeyResults}
              ownerType={formData.owner_type}
            />

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

      <OKRCycleForm 
        open={showCycleForm}
        onOpenChange={setShowCycleForm}
        onCycleCreated={() => {
          // Refresh cycles data
          window.location.reload();
        }}
      />
    </>
  );
}
