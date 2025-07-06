
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, Users, User, BookOpen, FileText, Clock } from 'lucide-react';
import { TrainingProgram } from '@/hooks/useTrainingPrograms';
import { formatDate } from '@/utils/formatters';

interface TrainingProgramViewDialogProps {
  program: TrainingProgram | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (program: TrainingProgram) => void;
}

export function TrainingProgramViewDialog({ program, open, onOpenChange, onEdit }: TrainingProgramViewDialogProps) {
  if (!program) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang mở</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Đã hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const handleEdit = () => {
    onEdit(program);
    onOpenChange(false);
  };

  const calculateDuration = () => {
    const start = new Date(program.start_date);
    const end = new Date(program.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900 pr-8">
              {program.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Program Status and Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                <div className="mt-1">
                  {getStatusBadge(program.status)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Giảng viên</label>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{program.trainer || 'Chưa xác định'}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Số lượng tối đa</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{program.max_participants || 'Không giới hạn'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày bắt đầu</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(program.start_date)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Ngày kết thúc</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(program.end_date)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Thời gian đào tạo</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{calculateDuration()} ngày</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Ngày tạo</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(program.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {program.description && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-3">Mô tả chương trình</label>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">{program.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Program Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Chương trình</h3>
              </div>
              <p className="text-sm text-blue-700">
                Thời gian: {calculateDuration()} ngày
              </p>
              <p className="text-sm text-blue-700">
                Trạng thái: {program.status === 'active' ? 'Đang mở đăng ký' : 
                           program.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-900">Học viên</h3>
              </div>
              <p className="text-sm text-green-700">
                Tối đa: {program.max_participants || 'Không giới hạn'}
              </p>
              <p className="text-sm text-green-700">
                Hiện tại: 0 học viên
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium text-purple-900">Giảng viên</h3>
              </div>
              <p className="text-sm text-purple-700">
                {program.trainer || 'Chưa xác định'}
              </p>
              <p className="text-sm text-purple-700">
                Phụ trách chương trình
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-3">Lịch trình</label>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Bắt đầu chương trình</p>
                  <p className="text-sm text-gray-500">{formatDate(program.start_date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Kết thúc chương trình</p>
                  <p className="text-sm text-gray-500">{formatDate(program.end_date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa chương trình
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
