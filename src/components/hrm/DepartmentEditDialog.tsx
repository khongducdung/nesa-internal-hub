
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useDepartments } from '@/hooks/useDepartments';
import { useUpdateDepartment } from '@/hooks/useDepartmentMutations';

interface DepartmentEditDialogProps {
  departmentId: string;
  open: boolean;
  onClose: () => void;
}

export function DepartmentEditDialog({ departmentId, open, onClose }: DepartmentEditDialogProps) {
  const { data: departments } = useDepartments();
  const updateDepartment = useUpdateDepartment();
  
  const department = departments?.find(dept => dept.id === departmentId);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        status: (department.status as 'active' | 'inactive' | 'pending') || 'active',
      });
    }
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateDepartment.mutateAsync({ id: departmentId, data: formData });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phòng ban</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tên phòng ban *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
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
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
              placeholder="Nhập mô tả phòng ban..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={updateDepartment.isPending}>
              {updateDepartment.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
