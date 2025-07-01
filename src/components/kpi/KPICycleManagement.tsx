
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { usePerformanceCycles, useCreatePerformanceCycle } from '@/hooks/usePerformance';
import { useAuth } from '@/hooks/useAuth';

export function KPICycleManagement() {
  const { data: cycles, isLoading } = usePerformanceCycles();
  const createCycle = useCreatePerformanceCycle();
  const { profile } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    status: 'draft' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.employee_id) return;

    await createCycle.mutateAsync({
      ...formData,
      created_by: profile.employee_id
    });

    setFormData({ name: '', start_date: '', end_date: '', status: 'draft' });
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
          <h2 className="text-lg font-semibold text-gray-900">Quản lý chu kỳ KPI</h2>
          <p className="text-sm text-gray-500 mt-1">
            Thiết lập các chu kỳ đánh giá KPI theo tháng, quý hoặc năm
          </p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo chu kỳ KPI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo chu kỳ KPI mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên chu kỳ *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="VD: KPI Tháng 1/2025, KPI Quý 1/2025"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Ngày bắt đầu *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Ngày kết thúc *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={createCycle.isPending}>
                  {createCycle.isPending ? 'Đang tạo...' : 'Tạo chu kỳ'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cycles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cycles?.map((cycle) => {
          const isActive = cycle.status === 'active';
          const isCompleted = cycle.status === 'completed';
          const startDate = new Date(cycle.start_date);
          const endDate = new Date(cycle.end_date);
          const now = new Date();
          const isInProgress = now >= startDate && now <= endDate;

          return (
            <Card key={cycle.id} className={`hover:shadow-md transition-shadow ${
              isActive ? 'ring-2 ring-blue-500 border-blue-200' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">{cycle.name}</CardTitle>
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
              <CardContent className="pt-0 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Trạng thái</span>
                  <Badge variant={
                    isCompleted ? 'default' : 
                    isActive ? 'secondary' : 'outline'
                  }>
                    {isCompleted ? 'Hoàn thành' : 
                     isActive ? 'Đang diễn ra' : 'Nháp'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bắt đầu:</span>
                    <span>{startDate.toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kết thúc:</span>
                    <span>{endDate.toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                {isInProgress && (
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                    Chu kỳ đang diễn ra
                  </div>
                )}

                <div className="text-xs text-gray-400">
                  Tạo: {new Date(cycle.created_at).toLocaleDateString('vi-VN')}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {!cycles?.length && (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chu kỳ KPI nào</h3>
            <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
              Tạo chu kỳ KPI đầu tiên để bắt đầu quản lý hiệu suất nhân viên
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo chu kỳ đầu tiên
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
