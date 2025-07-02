
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Link } from 'lucide-react';
import { useCreateOKR, useParentOKRs } from '@/hooks/useOKRSimple';
import { useDepartments } from '@/hooks/useDepartments';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CreateOKRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOwnerType?: 'company' | 'department' | 'individual';
}

interface KeyResultFormData {
  title: string;
  description: string;
  target_value: number;
  unit: string;
  weight: number;
}

export function CreateOKRDialog({ open, onOpenChange, defaultOwnerType = 'individual' }: CreateOKRDialogProps) {
  const { toast } = useToast();
  const { profile, isAdmin } = useAuth();
  const createOKRMutation = useCreateOKR();
  const { data: departments = [] } = useDepartments();
  const { data: employees = [] } = useEmployees();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner_type: defaultOwnerType,
    department_id: '',
    employee_id: '',
    parent_okr_id: '',
  });

  const { data: parentOKRs = [], isLoading: parentOKRsLoading } = useParentOKRs(formData.owner_type);

  const [keyResults, setKeyResults] = useState<KeyResultFormData[]>([
    {
      title: '',
      description: '',
      target_value: 0,
      unit: '',
      weight: 100,
    }
  ]);

  console.log('CreateOKRDialog - formData:', formData);
  console.log('CreateOKRDialog - parentOKRs:', parentOKRs);
  console.log('CreateOKRDialog - parentOKRsLoading:', parentOKRsLoading);

  const addKeyResult = () => {
    setKeyResults([...keyResults, {
      title: '',
      description: '',
      target_value: 0,
      unit: '',
      weight: 100,
    }]);
  };

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((_, i) => i !== index));
    }
  };

  const updateKeyResult = (index: number, updates: Partial<KeyResultFormData>) => {
    setKeyResults(keyResults.map((kr, i) => 
      i === index ? { ...kr, ...updates } : kr
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Key results:', keyResults);
    
    if (!formData.title || keyResults.some(kr => !kr.title || !kr.unit || kr.target_value <= 0)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    try {
      const data: any = {
        title: formData.title,
        description: formData.description,
        owner_type: formData.owner_type,
        parent_okr_id: formData.parent_okr_id || undefined,
        key_results: keyResults.filter(kr => kr.title && kr.unit && kr.target_value > 0),
      };

      // Set owner-specific fields
      if (formData.owner_type === 'department') {
        data.department_id = formData.department_id || profile?.department_id;
      } else if (formData.owner_type === 'individual') {
        data.employee_id = formData.employee_id || profile?.employee_id;
      }

      console.log('Final data to create OKR:', data);

      await createOKRMutation.mutateAsync(data);

      toast({
        title: "Thành công",
        description: "Đã tạo OKR mới thành công!",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        owner_type: defaultOwnerType,
        department_id: '',
        employee_id: '',
        parent_okr_id: '',
      });
      setKeyResults([{
        title: '',
        description: '',
        target_value: 0,
        unit: '',
        weight: 100,
      }]);

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating OKR:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo OKR. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const resetParentSelection = () => {
    setFormData({ ...formData, parent_okr_id: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo OKR mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề OKR *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Tăng doanh thu 30%"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_type">Loại OKR *</Label>
                  <Select
                    value={formData.owner_type}
                    onValueChange={(value: 'company' | 'department' | 'individual') => {
                      setFormData({ ...formData, owner_type: value, parent_okr_id: '' });
                      resetParentSelection();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {isAdmin && <SelectItem value="company">OKR Công ty</SelectItem>}
                      <SelectItem value="department">OKR Phòng ban</SelectItem>
                      <SelectItem value="individual">OKR Cá nhân</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

              {/* Hierarchical Linking - ALWAYS SHOW for dept and individual */}
              {(formData.owner_type === 'department' || formData.owner_type === 'individual') && (
                <div className="space-y-2 border-t pt-4">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <Link className="h-4 w-4" />
                    Liên kết với OKR cấp trên
                  </Label>
                  
                  {parentOKRsLoading ? (
                    <div className="text-sm text-gray-500">Đang tải danh sách OKR...</div>
                  ) : parentOKRs.length > 0 ? (
                    <Select
                      value={formData.parent_okr_id}
                      onValueChange={(value) => setFormData({ ...formData, parent_okr_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          formData.owner_type === 'department' 
                            ? "Chọn OKR Công ty để liên kết" 
                            : "Chọn OKR Phòng ban để liên kết"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Không liên kết</SelectItem>
                        {parentOKRs.map((okr) => (
                          <SelectItem key={okr.id} value={okr.id}>
                            {okr.title} ({okr.progress}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                      {formData.owner_type === 'department' 
                        ? "Chưa có OKR Công ty nào để liên kết. Vui lòng tạo OKR Công ty trước."
                        : "Chưa có OKR Phòng ban nào để liên kết. Vui lòng tạo OKR Phòng ban trước."
                      }
                    </div>
                  )}
                </div>
              )}

              {/* Owner-specific fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.owner_type === 'department' && (
                  <div className="space-y-2">
                    <Label htmlFor="department">Phòng ban</Label>
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

                {formData.owner_type === 'individual' && isAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="employee">Nhân viên</Label>
                    <Select
                      value={formData.employee_id}
                      onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân viên" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.full_name} ({emp.employee_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Key Results *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addKeyResult}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm KR
              </Button>
            </div>

            {keyResults.map((kr, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Key Result #{index + 1}</CardTitle>
                    {keyResults.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyResult(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tiêu đề KR *</Label>
                      <Input
                        value={kr.title}
                        onChange={(e) => updateKeyResult(index, { title: e.target.value })}
                        placeholder="Ví dụ: Đạt 100 triệu doanh thu"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Trọng số (%)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={kr.weight}
                        onChange={(e) => updateKeyResult(index, { weight: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea
                      value={kr.description}
                      onChange={(e) => updateKeyResult(index, { description: e.target.value })}
                      placeholder="Mô tả chi tiết về Key Result này"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mục tiêu *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={kr.target_value}
                        onChange={(e) => updateKeyResult(index, { target_value: Number(e.target.value) })}
                        placeholder="100"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Đơn vị *</Label>
                      <Input
                        value={kr.unit}
                        onChange={(e) => updateKeyResult(index, { unit: e.target.value })}
                        placeholder="triệu VND, %, khách hàng..."
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createOKRMutation.isPending}>
              {createOKRMutation.isPending ? 'Đang tạo...' : 'Tạo OKR'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
