
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateKPIFramework } from '@/hooks/useKPI';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useToast } from '@/hooks/use-toast';
import { FRAMEWORK_TYPES } from '@/types/kpi';

interface KPIFrameworkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KPIFrameworkFormDialog({ open, onOpenChange }: KPIFrameworkFormDialogProps) {
  const { toast } = useToast();
  const createFrameworkMutation = useCreateKPIFramework();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    framework_type: '',
    target_level: '',
    department_id: '',
    position_id: '',
  });

  const TARGET_LEVELS = [
    { value: 'strategic', label: 'Chiến lược' },
    { value: 'operational', label: 'Vận hành' },
    { value: 'tactical', label: 'Chiến thuật' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.framework_type || !formData.target_level) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFrameworkMutation.mutateAsync({
        name: formData.name,
        description: formData.description || null,
        framework_type: formData.framework_type as any,
        target_level: formData.target_level as any,
        department_id: formData.department_id || null,
        position_id: formData.position_id || null,
        is_active: true,
        created_by: '', // Will be filled by hook
      });

      toast({
        title: "Thành công",
        description: "Đã tạo khung KPI mới",
      });

      setFormData({
        name: '',
        description: '',
        framework_type: '',
        target_level: '',
        department_id: '',
        position_id: '',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo khung KPI",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo khung KPI mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên khung KPI *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên khung KPI"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="framework_type">Loại khung *</Label>
              <Select
                value={formData.framework_type}
                onValueChange={(value) => setFormData({ ...formData, framework_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại khung" />
                </SelectTrigger>
                <SelectContent>
                  {FRAMEWORK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
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
              placeholder="Mô tả về khung KPI này"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_level">Cấp độ áp dụng *</Label>
              <Select
                value={formData.target_level}
                onValueChange={(value) => setFormData({ ...formData, target_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cấp độ" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban (tùy chọn)</Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) => setFormData({ ...formData, department_id: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tất cả phòng ban</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Vị trí (tùy chọn)</Label>
              <Select
                value={formData.position_id}
                onValueChange={(value) => setFormData({ ...formData, position_id: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tất cả vị trí</SelectItem>
                  {positions.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createFrameworkMutation.isPending}>
              {createFrameworkMutation.isPending ? 'Đang tạo...' : 'Tạo khung KPI'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
