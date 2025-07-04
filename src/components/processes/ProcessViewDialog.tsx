
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileText,
  Calendar,
  User,
  Users,
  Building2,
  Globe,
  Edit2
} from 'lucide-react';
import { Process } from '@/hooks/useProcesses';
import { useAuth } from '@/hooks/useAuth';

interface ProcessViewDialogProps {
  process: Process | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (process: Process) => void;
}

export function ProcessViewDialog({ process, open, onOpenChange, onEdit }: ProcessViewDialogProps) {
  const { user, isAdmin } = useAuth();

  if (!process) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      draft: 'Nháp',
      active: 'Hoạt động',
      inactive: 'Không hoạt động'
    };
    
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.draft}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'employee': return <User className="h-4 w-4" />;
      case 'department': return <Building2 className="h-4 w-4" />;
      case 'position': return <Users className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getTargetLabel = (targetType: string) => {
    switch (targetType) {
      case 'employee': return 'Nhân viên cụ thể';
      case 'department': return 'Phòng ban';
      case 'position': return 'Vị trí';
      default: return 'Áp dụng cho tất cả';
    }
  };

  const canEdit = isAdmin || process.created_by === user?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              Chi tiết quy trình
            </DialogTitle>
            {canEdit && (
              <Button 
                size="sm" 
                onClick={() => onEdit(process)}
                className="ml-4"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{process.name}</h2>
              {process.description && (
                <p className="text-gray-600 mt-2">{process.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {getStatusBadge(process.status)}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getTargetIcon(process.target_type)}
                <span>{getTargetLabel(process.target_type)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Content */}
          {process.content && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nội dung quy trình
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-sm text-gray-700">
                  {process.content}
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Meta Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Thông tin
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Người tạo</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {process.created_by_user?.full_name || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {new Date(process.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {new Date(process.updated_at).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <div>
                  {getStatusBadge(process.status)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
