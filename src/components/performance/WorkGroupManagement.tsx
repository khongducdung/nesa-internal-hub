
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import { useWorkGroups, useCreateWorkGroup } from '@/hooks/usePerformance';
import { useAuth } from '@/hooks/useAuth';

export function WorkGroupManagement() {
  const { data: workGroups, isLoading } = useWorkGroups();
  const createWorkGroup = useCreateWorkGroup();
  const { profile } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    salary_percentage: 0
  });

  const totalPercentage = workGroups?.reduce((sum, group) => sum + group.salary_percentage, 0) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.employee_id) return;

    const newTotal = totalPercentage + formData.salary_percentage;
    if (newTotal > 100) {
      alert('Tổng tỷ lệ % lương không được vượt quá 100%');
      return;
    }

    await createWorkGroup.mutateAsync({
      ...formData,
      created_by: profile.employee_id
    });

    setFormData({ name: '', description: '', salary_percentage: 0 });
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Quản lý nhóm công việc</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tạo và quản lý các nhóm công việc với tỷ lệ % lương tương ứng
          </p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhóm công việc
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo nhóm công việc mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên nhóm công việc *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_percentage">Tỷ lệ % lương *</Label>
                <Input
                  id="salary_percentage"
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={formData.salary_percentage}
                  onChange={(e) => setFormData({...formData, salary_percentage: parseFloat(e.target.value) || 0})}
                  required
                />
                <p className="text-xs text-gray-500">
                  Đã sử dụng: {totalPercentage.toFixed(2)}% | Còn lại: {(100 - totalPercentage).toFixed(2)}%
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={createWorkGroup.isPending}>
                  {createWorkGroup.isPending ? 'Đang tạo...' : 'Tạo nhóm công việc'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tổng quan tỷ lệ lương</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900">
              {totalPercentage.toFixed(2)}%
            </div>
            <Badge variant={totalPercentage === 100 ? 'default' : totalPercentage > 100 ? 'destructive' : 'secondary'}>
              {totalPercentage === 100 ? 'Hoàn tất' : totalPercentage > 100 ? 'Vượt quá' : 'Chưa đủ'}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className={`h-2 rounded-full transition-all ${
                totalPercentage > 100 ? 'bg-red-500' : 
                totalPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workGroups?.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">{group.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {group.description && (
                <p className="text-sm text-gray-600 mb-3">{group.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Tỷ lệ lương</span>
                <Badge variant="outline" className="font-semibold">
                  {group.salary_percentage}%
                </Badge>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Tạo: {new Date(group.created_at).toLocaleDateString('vi-VN')}
              </div>
            </CardContent>
          </Card>
        ))}

        {!workGroups?.length && (
          <div className="col-span-full text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có nhóm công việc nào</h3>
            <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
              Tạo nhóm công việc đầu tiên để bắt đầu phân công và đánh giá hiệu suất
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo nhóm công việc đầu tiên
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
