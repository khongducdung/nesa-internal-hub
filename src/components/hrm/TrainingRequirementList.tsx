
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrainingRequirements } from '@/hooks/useTrainingRequirements';
import { TrainingRequirementForm } from './TrainingRequirementForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, ExternalLink, Clock, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function TrainingRequirementList() {
  const { data: requirements, isLoading } = useTrainingRequirements();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredRequirements = requirements?.filter(req =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'general': return 'Tất cả';
      case 'department': return 'Phòng ban';
      case 'position': return 'Chức vụ';
      case 'employee': return 'Cá nhân';
      default: return targetType;
    }
  };

  const getTargetTypeColor = (targetType: string) => {
    switch (targetType) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'department': return 'bg-green-100 text-green-800';
      case 'position': return 'bg-purple-100 text-purple-800';
      case 'employee': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-50 text-green-700 border-green-200">
        Hoạt động
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-50 text-gray-600 border-gray-200">
        Tạm dừng
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Yêu cầu đào tạo</h2>
          <p className="text-gray-600 mt-1">Quản lý các chương trình đào tạo bắt buộc cho nhân viên</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tạo yêu cầu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo yêu cầu đào tạo mới</DialogTitle>
            </DialogHeader>
            <TrainingRequirementForm onSuccess={() => setShowCreateForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm chương trình đào tạo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {requirements && requirements.length > 0 && (
          <div className="text-sm text-gray-500">
            Tổng cộng: {requirements.length} chương trình
          </div>
        )}
      </div>

      {/* Training Requirements Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50/50">
                <TableHead className="font-semibold text-gray-900 w-[40%]">Chương trình đào tạo</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[15%]">Đối tượng</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[15%]">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    Thời hạn
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[15%]">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[15%]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequirements && filteredRequirements.length > 0 ? (
                filteredRequirements.map((requirement) => (
                  <TableRow key={requirement.id} className="border-gray-100 hover:bg-gray-50/50 group">
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900 leading-tight">
                          {requirement.name}
                        </div>
                        {requirement.description && (
                          <div className="text-sm text-gray-600 line-clamp-2 max-w-md leading-relaxed">
                            {requirement.description}
                          </div>
                        )}
                        {requirement.reason && (
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                            <span className="font-medium">Lý do:</span> {requirement.reason}
                          </div>
                        )}
                        {requirement.auto_assign_after_days > 0 && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            Tự động giao sau {requirement.auto_assign_after_days} ngày
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge className={`${getTargetTypeColor(requirement.target_type)} border-0 font-medium`}>
                        <Users className="h-3 w-3 mr-1" />
                        {getTargetTypeLabel(requirement.target_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {requirement.duration_days} ngày
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {getStatusBadge(requirement.is_active)}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {requirement.course_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(requirement.course_url, '_blank')}
                          className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Xem khóa học
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Chưa có link</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="text-gray-500">
                        {searchTerm ? 'Không tìm thấy chương trình đào tạo phù hợp' : 'Chưa có chương trình đào tạo nào'}
                      </div>
                      {!searchTerm && (
                        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="mt-2">
                              <Plus className="h-4 w-4 mr-2" />
                              Tạo chương trình đầu tiên
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Summary */}
      {filteredRequirements && filteredRequirements.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div>
            Hiển thị {filteredRequirements.length} chương trình
            {searchTerm && ` (lọc từ ${requirements?.length} tổng cộng)`}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Đang hoạt động: {filteredRequirements.filter(r => r.is_active).length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Tạm dừng: {filteredRequirements.filter(r => !r.is_active).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
