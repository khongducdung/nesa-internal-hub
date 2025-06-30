
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { usePositions } from '@/hooks/usePositions';
import { useUpdatePosition } from '@/hooks/usePositionMutations';
import { useDepartments } from '@/hooks/useDepartments';

interface PositionEditDialogProps {
  positionId: string;
  open: boolean;
  onClose: () => void;
}

export function PositionEditDialog({ positionId, open, onClose }: PositionEditDialogProps) {
  const { data: positions } = usePositions();
  const { data: departments } = useDepartments();
  const updatePosition = useUpdatePosition();
  
  const position = positions?.find(pos => pos.id === positionId);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department_id: '',
    level: 'level_3' as 'level_1' | 'level_2' | 'level_3',
    status: 'active' as 'active' | 'inactive' | 'pending',
  });

  useEffect(() => {
    if (position) {
      setFormData({
        name: position.name || '',
        description: position.description || '',
        department_id: position.department_id || '',
        level: position.level,
        status: (position.status as 'active' | 'inactive' | 'pending') || 'active',
      });
    }
  }, [position]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const departmentId = formData.department_id === 'no_department' || !formData.department_id 
      ? null 
      : formData.department_id;
    
    await updatePosition.mutateAsync({ 
      id: positionId, 
      data: {
        ...formData,
        department_id: departmentId
      }
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa vị trí công việc</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tên vị trí *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Phòng ban</Label>
            <Select 
              value={formData.department_id} 
              onValueChange={(value) => setFormData({...formData, department_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_department">Không có</SelectItem>
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Cấp độ</Label>
            <Select 
              value={formData.level} 
              onValueChange={(value: 'level_1' | 'level_2' | 'level_3') => setFormData({...formData, level: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="level_1">Cấp 1 (Lãnh đạo)</SelectItem>
                <SelectItem value="level_2">Cấp 2 (Quản lý)</SelectItem>
                <SelectItem value="level_3">Cấp 3 (Nhân viên)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'active' | 'inactive' | 'pending') => setFormData({...formData, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
              placeholder="Mô tả về vị trí công việc..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={updatePosition.isPending}>
              {updatePosition.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
