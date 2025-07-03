// Create OKR Dialog - Dialog for creating new OKRs
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOKR, useCompanyOKRs, useDepartmentOKRs } from '@/hooks/useOKRSystem';
import { useToast } from '@/hooks/use-toast';

interface CreateOKRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface KeyResultForm {
  title: string;
  description: string;
  target_value: number;
  unit: string;
  weight: number;
}

export function CreateOKRDialog({ open, onOpenChange }: CreateOKRDialogProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const createOKR = useCreateOKR();
  const { data: companyOKRs = [] } = useCompanyOKRs();
  const { data: departmentOKRs = [] } = useDepartmentOKRs();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner_type: 'individual' as 'company' | 'department' | 'individual',
    department_id: '',
    employee_id: '',
    parent_okr_id: ''
  });

  const [keyResults, setKeyResults] = useState<KeyResultForm[]>([
    { title: '', description: '', target_value: 0, unit: '', weight: 100 }
  ]);

  const addKeyResult = () => {
    setKeyResults(prev => [...prev, { title: '', description: '', target_value: 0, unit: '', weight: 0 }]);
  };

  const removeKeyResult = (index: number) => {
    setKeyResults(prev => prev.filter((_, i) => i !== index));
  };

  const updateKeyResult = (index: number, field: keyof KeyResultForm, value: string | number) => {
    setKeyResults(prev => prev.map((kr, i) => 
      i === index ? { ...kr, [field]: value } : kr
    ));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề OKR"
      });
      return;
    }

    if (keyResults.some(kr => !kr.title.trim() || kr.target_value <= 0 || !kr.unit.trim())) {
      toast({
        variant: "destructive", 
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin Key Results"
      });
      return;
    }

    if (totalWeight !== 100) {
      toast({
        variant: "destructive",
        title: "Lỗi", 
        description: "Tổng trọng số Key Results phải bằng 100%"
      });
      return;
    }

    createOKR.mutate({
      title: formData.title,
      description: formData.description,
      owner_type: formData.owner_type,
      department_id: formData.department_id || undefined,
      employee_id: formData.employee_id || undefined,
      parent_okr_id: formData.parent_okr_id || undefined,
      key_results: keyResults.map(kr => ({
        title: kr.title,
        description: kr.description,
        target_value: kr.target_value,
        unit: kr.unit,
        weight: kr.weight
      }))
    }, {
      onSuccess: () => {
        onOpenChange(false);
        // Reset form
        setFormData({
          title: '',
          description: '',
          owner_type: 'individual',
          department_id: '',
          employee_id: '',
          parent_okr_id: ''
        });
        setKeyResults([{ title: '', description: '', target_value: 0, unit: '', weight: 100 }]);
      }
    });
  };

  const totalWeight = keyResults.reduce((sum, kr) => sum + kr.weight, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Tạo OKR mới
          </DialogTitle>
          <DialogDescription>
            Thiết lập mục tiêu mới với các Key Results cụ thể
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề OKR *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ví dụ: Tăng doanh thu 30% trong Q4 2024"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về mục tiêu này..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="owner_type">Loại OKR *</Label>
                <Select 
                  value={formData.owner_type} 
                  onValueChange={(value: 'company' | 'department' | 'individual') => 
                    setFormData(prev => ({ ...prev, owner_type: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn loại OKR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">OKR Công ty</SelectItem>
                    <SelectItem value="department">OKR Phòng ban</SelectItem>
                    <SelectItem value="individual">OKR Cá nhân</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Parent OKR Selection */}
              {formData.owner_type !== 'company' && (
                <div>
                  <Label htmlFor="parent_okr">Liên kết với OKR (không bắt buộc)</Label>
                  <Select 
                    value={formData.parent_okr_id} 
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, parent_okr_id: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn OKR cha để liên kết" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.owner_type === 'department' && companyOKRs.map((okr) => (
                        <SelectItem key={okr.id} value={okr.id}>
                          [Công ty] {okr.title}
                        </SelectItem>
                      ))}
                      {formData.owner_type === 'individual' && (
                        <>
                          {companyOKRs.map((okr) => (
                            <SelectItem key={okr.id} value={okr.id}>
                              [Công ty] {okr.title}
                            </SelectItem>
                          ))}
                          {departmentOKRs.map((okr) => (
                            <SelectItem key={okr.id} value={okr.id}>
                              [Phòng ban] {okr.title}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Liên kết OKR này với mục tiêu cấp cao hơn để tạo tính liên kết
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Key Results</CardTitle>
                <Button onClick={addKeyResult} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm KR
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                Tổng trọng số: {totalWeight}% {totalWeight !== 100 && (
                  <span className="text-red-600">(cần bằng 100%)</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyResults.map((kr, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Key Result #{index + 1}</h4>
                    {keyResults.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeKeyResult(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor={`kr-title-${index}`}>Tiêu đề *</Label>
                      <Input
                        id={`kr-title-${index}`}
                        value={kr.title}
                        onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                        placeholder="Ví dụ: Đạt doanh thu 10 tỷ VND"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`kr-target-${index}`}>Giá trị mục tiêu *</Label>
                      <Input
                        id={`kr-target-${index}`}
                        type="number"
                        value={kr.target_value}
                        onChange={(e) => updateKeyResult(index, 'target_value', parseFloat(e.target.value) || 0)}
                        placeholder="100"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`kr-unit-${index}`}>Đơn vị *</Label>
                      <Input
                        id={`kr-unit-${index}`}
                        value={kr.unit}
                        onChange={(e) => updateKeyResult(index, 'unit', e.target.value)}
                        placeholder="triệu VND, %, khách hàng..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`kr-weight-${index}`}>Trọng số (%) *</Label>
                      <Input
                        id={`kr-weight-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={kr.weight}
                        onChange={(e) => updateKeyResult(index, 'weight', parseFloat(e.target.value) || 0)}
                        placeholder="25"
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <Label htmlFor={`kr-description-${index}`}>Mô tả</Label>
                      <Textarea
                        id={`kr-description-${index}`}
                        value={kr.description}
                        onChange={(e) => updateKeyResult(index, 'description', e.target.value)}
                        placeholder="Mô tả cách đo lường..."
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={totalWeight !== 100 || createOKR.isPending}
            >
              {createOKR.isPending ? 'Đang tạo...' : 'Tạo OKR'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}