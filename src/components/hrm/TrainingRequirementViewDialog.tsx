
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingRequirement } from '@/hooks/useTrainingRequirements';
import { Edit, ExternalLink, Calendar, Users, Clock, Target } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface TrainingRequirementViewDialogProps {
  requirement: TrainingRequirement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (requirement: TrainingRequirement) => void;
}

export function TrainingRequirementViewDialog({ 
  requirement, 
  open, 
  onOpenChange, 
  onEdit 
}: TrainingRequirementViewDialogProps) {
  if (!requirement) return null;

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'general': return 'Tất cả nhân viên';
      case 'department': return 'Theo phòng ban';
      case 'position': return 'Theo chức vụ';
      case 'employee': return 'Nhân viên cụ thể';
      case 'mixed': return 'Đa dạng';
      default: return targetType;
    }
  };

  const getTargetTypeColor = (targetType: string) => {
    switch (targetType) {
      case 'general': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'department': return 'bg-green-50 text-green-700 border-green-200';
      case 'position': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'employee': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'mixed': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Chi tiết yêu cầu đào tạo</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(requirement)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{requirement.name}</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={`${getTargetTypeColor(requirement.target_type)} font-medium`}>
                    {getTargetTypeLabel(requirement.target_type)}
                  </Badge>
                  {requirement.is_active ? (
                    <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
                      Đang hoạt động
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-medium">
                      Tạm dừng
                    </Badge>
                  )}
                </div>
              </div>

              {requirement.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mô tả</h4>
                  <p className="text-gray-600 leading-relaxed">{requirement.description}</p>
                </div>
              )}

              {requirement.reason && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Lý do đào tạo</h4>
                  <p className="text-gray-600 leading-relaxed">{requirement.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Chi tiết đào tạo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Thời hạn hoàn thành</p>
                      <p className="text-lg font-semibold text-gray-900">{requirement.duration_days} ngày</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tự động giao sau</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {requirement.auto_assign_after_days === 0 ? 'Ngay lập tức' : `${requirement.auto_assign_after_days} ngày`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Khóa học</p>
                    {requirement.course_url ? (
                      <Button
                        variant="outline"
                        onClick={() => window.open(requirement.course_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Mở khóa học
                      </Button>
                    ) : (
                      <p className="text-gray-400 italic">Chưa có liên kết khóa học</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(requirement.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cập nhật lần cuối</p>
                  <p className="font-medium">{formatDate(requirement.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
