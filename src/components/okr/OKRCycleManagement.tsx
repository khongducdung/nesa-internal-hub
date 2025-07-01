
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';

export function OKRCycleManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  // Mock data - sẽ thay thế bằng API call
  const cycles = [
    {
      id: 1,
      name: 'Q1 2024',
      description: 'Chu kỳ OKR Quý 1 năm 2024',
      start_date: '2024-01-01',
      end_date: '2024-03-31',
      status: 'active',
      objectives_count: 24,
      completion_rate: 76
    },
    {
      id: 2,
      name: 'Q4 2023',
      description: 'Chu kỳ OKR Quý 4 năm 2023',
      start_date: '2023-10-01',
      end_date: '2023-12-31',
      status: 'completed',
      objectives_count: 18,
      completion_rate: 85
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating OKR cycle:', formData);
    setFormData({ name: '', description: '', start_date: '', end_date: '' });
    setShowCreateForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Nháp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Quản lý chu kỳ OKR</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tạo và quản lý các chu kỳ thời gian cho việc thực hiện OKR
          </p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo chu kỳ OKR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo chu kỳ OKR mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên chu kỳ *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="VD: Q1 2024, Năm 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Mô tả chi tiết về chu kỳ OKR này"
                  rows={3}
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
                <Button type="submit">
                  Tạo chu kỳ
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cycles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cycles.map((cycle) => (
          <Card key={cycle.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">{cycle.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(cycle.status)}
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {cycle.description && (
                <p className="text-sm text-gray-600 mb-4">{cycle.description}</p>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Thời gian</span>
                  </div>
                  <span className="font-medium">
                    {new Date(cycle.start_date).toLocaleDateString('vi-VN')} - {new Date(cycle.end_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Số lượng Objectives</span>
                  <span className="font-medium text-blue-600">{cycle.objectives_count}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tỷ lệ hoàn thành</span>
                  <span className="font-medium text-green-600">{cycle.completion_rate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {cycles.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chu kỳ OKR nào</h3>
            <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
              Tạo chu kỳ OKR đầu tiên để bắt đầu quản lý mục tiêu của tổ chức
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo chu kỳ OKR đầu tiên
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
