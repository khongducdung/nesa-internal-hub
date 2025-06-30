
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrainingPrograms } from '@/hooks/useTrainingPrograms';
import { SimpleTrainingProgramForm } from './SimpleTrainingProgramForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';

export function TrainingProgramList() {
  const { data: programs, isLoading } = useTrainingPrograms();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredPrograms = programs?.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Đã hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Chương trình đào tạo</h2>
          <p className="text-gray-600">Quản lý các chương trình đào tạo</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo chương trình mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo chương trình đào tạo mới</DialogTitle>
            </DialogHeader>
            <SimpleTrainingProgramForm onSuccess={() => setShowCreateForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Tìm kiếm chương trình..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrograms?.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{program.name}</CardTitle>
                  {getStatusBadge(program.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {program.description && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {program.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 font-medium">Bắt đầu: </span>
                  <span className="text-gray-600">
                    {new Date(program.start_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Kết thúc: </span>
                  <span className="text-gray-600">
                    {new Date(program.end_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              {program.trainer && (
                <div className="text-sm">
                  <span className="text-gray-700 font-medium">Giảng viên: </span>
                  <span className="text-gray-600">{program.trainer}</span>
                </div>
              )}

              {program.max_participants && (
                <div className="text-sm">
                  <span className="text-gray-700 font-medium">Số lượng tối đa: </span>
                  <span className="text-gray-600">{program.max_participants} người</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Không tìm thấy chương trình đào tạo nào</p>
        </div>
      )}
    </div>
  );
}
