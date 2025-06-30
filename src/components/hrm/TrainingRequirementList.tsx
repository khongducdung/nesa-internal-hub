
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrainingRequirements } from '@/hooks/useTrainingRequirements';
import { TrainingRequirementForm } from './TrainingRequirementForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Calendar, Users, ExternalLink } from 'lucide-react';

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
      <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Tạm dừng</Badge>
    );
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
          <h2 className="text-xl font-semibold">Yêu cầu đào tạo</h2>
          <p className="text-gray-600">Quản lý các yêu cầu đào tạo cho nhân viên</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
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
          className="pl-10"
        />
      </div>

      {/* Requirements List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequirements?.map((requirement) => (
          <Card key={requirement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{requirement.name}</CardTitle>
                  {getStatusBadge(requirement.is_active)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {requirement.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {requirement.description}
                </p>
              )}

              {requirement.reason && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Lý do:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{requirement.reason}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {requirement.duration_days} ngày
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {getTargetTypeLabel(requirement.target_type)}
                  </span>
                </div>
              </div>

              {requirement.auto_assign_after_days > 0 && (
                <div className="text-sm">
                  <span className="text-gray-700 font-medium">Tự động giao sau: </span>
                  <span className="text-gray-600">{requirement.auto_assign_after_days} ngày</span>
                </div>
              )}

              {requirement.course_url && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(requirement.course_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem khóa học
                  </Button>
                </div>
              )}

              <div className="text-xs text-gray-500 pt-2 border-t">
                Tạo: {new Date(requirement.created_at).toLocaleDateString('vi-VN')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequirements?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Không tìm thấy yêu cầu đào tạo nào</p>
        </div>
      )}
    </div>
  );
}
