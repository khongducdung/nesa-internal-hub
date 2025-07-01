
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import { useWorkGroups, useCreateWorkGroup } from '@/hooks/usePerformance';
import { useAuth } from '@/hooks/useAuth';

export function KPIWorkGroupManagement() {
  const { data: workGroups, isLoading } = useWorkGroups();
  const createWorkGroup = useCreateWorkGroup();
  const { profile } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.employee_id) return;

    await createWorkGroup.mutateAsync({
      ...formData,
      created_by: profile.employee_id
    });

    setFormData({ name: '', description: '' });
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
          <h2 className="text-lg font-semibold text-gray-900">Quản lý nhóm công việc KPI</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tạo và quản lý các nhóm công việc để phân loại KPI theo từng lĩnh vực
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
              <DialogTitle>Tạo nhóm công việc KPI mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên nhóm công việc *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="VD: Kinh doanh, Kỹ thuật, Hỗ trợ khách hàng"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Mô tả chi tiết về nhóm công việc này"
                  rows={3}
                />
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

      {/* Work Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workGroups?.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
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
              <div className="text-xs text-gray-400 mt-2">
                Tạo: {new Date(group.created_at).toLocaleDateString('vi-VN')}
              </div>
            </CardContent>
          </Card>
        ))}

        {!workGroups?.length && (
          <div className="col-span-full text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có nhóm công việc KPI nào</h3>
            <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
              Tạo nhóm công việc đầu tiên để bắt đầu phân loại và quản lý KPI
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
