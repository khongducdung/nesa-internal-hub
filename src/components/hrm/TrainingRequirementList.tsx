
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrainingRequirements } from '@/hooks/useTrainingRequirements';
import { TrainingRequirementForm } from './TrainingRequirementForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, ExternalLink } from 'lucide-react';
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
      case 'general': return 'Tất cả nhân viên';
      case 'department': return 'Theo phòng ban';
      case 'position': return 'Theo chức vụ';
      case 'employee': return 'Nhân viên cụ thể';
      default: return targetType;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Đang hoạt động</Badge>
    ) : (
      <Badge variant="secondary">Tạm dừng</Badge>
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
          <p className="text-gray-600 mt-1">Quản lý các yêu cầu đào tạo cho nhân viên</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Tìm kiếm yêu cầu đào tạo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-900">Tên chương trình</TableHead>
                <TableHead className="font-semibold text-gray-900">Đối tượng</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Thời hạn</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequirements && filteredRequirements.length > 0 ? (
                filteredRequirements.map((requirement) => (
                  <TableRow key={requirement.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{requirement.name}</div>
                        {requirement.description && (
                          <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                            {requirement.description}
                          </div>
                        )}
                        {requirement.reason && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Lý do:</span> {requirement.reason}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-gray-700">
                        {getTargetTypeLabel(requirement.target_type)}
                      </div>
                      {requirement.auto_assign_after_days > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Tự động giao sau {requirement.auto_assign_after_days} ngày
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">
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
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Xem khóa học
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">Không có link</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="text-gray-500">
                      {searchTerm ? 'Không tìm thấy yêu cầu đào tạo phù hợp' : 'Chưa có yêu cầu đào tạo nào'}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer info */}
      {filteredRequirements && filteredRequirements.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Hiển thị {filteredRequirements.length} yêu cầu đào tạo
        </div>
      )}
    </div>
  );
}
