
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { useProcessCategories, useCreateProcessCategory } from '@/hooks/useProcessCategories';

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CategorySelector({ value, onValueChange }: CategorySelectorProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#6B7280'
  });

  const { data: categories } = useProcessCategories();
  const createMutation = useCreateProcessCategory();

  const handleCreateCategory = async () => {
    if (newCategory.name.trim()) {
      try {
        await createMutation.mutateAsync({
          ...newCategory,
          created_by: '00000000-0000-0000-0000-000000000000'
        });
        setShowCreateDialog(false);
        setNewCategory({ name: '', description: '', color: '#6B7280' });
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
  };

  return (
    <>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color || '#6B7280' }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
          <div className="border-t mt-1 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm danh mục mới
            </Button>
          </div>
        </SelectContent>
      </Select>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo danh mục mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên danh mục *</label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh mục..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Màu sắc</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  className="w-8 h-8 border rounded cursor-pointer"
                />
                <Input
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#6B7280"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateCategory} disabled={!newCategory.name.trim()}>
                Tạo danh mục
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
