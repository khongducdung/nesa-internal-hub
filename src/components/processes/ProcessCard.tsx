
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2,
  Users,
  Building2,
  User,
  Globe
} from 'lucide-react';
import { ProcessWithDetails } from '@/hooks/useProcesses';
import { useAuth } from '@/hooks/useAuth';

interface ProcessCardProps {
  process: ProcessWithDetails;
  onView: (process: ProcessWithDetails) => void;
  onEdit: (process: ProcessWithDetails) => void;
  onDelete: (process: ProcessWithDetails) => void;
}

export function ProcessCard({ process, onView, onEdit, onDelete }: ProcessCardProps) {
  const { user, isAdmin } = useAuth();

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-gray-100 text-gray-800 border-gray-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      pending: 'Chờ xử lý',
      active: 'Hoạt động',
      inactive: 'Không hoạt động'
    };
    
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.pending}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTargetIcon = () => {
    if (process.department_id) return <Building2 className="h-4 w-4" />;
    if (process.position_id) return <Users className="h-4 w-4" />;
    if (process.assigned_user_id) return <User className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const getTargetLabel = () => {
    if (process.department_id) return 'Phòng ban';
    if (process.position_id) return 'Vị trí';
    if (process.assigned_user_id) return 'Nhân viên';
    return 'Tất cả';
  };

  const canEdit = isAdmin || process.created_by === user?.id;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                {process.name}
              </CardTitle>
              {process.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {process.description}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(process)}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              {canEdit && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(process)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(process)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa quy trình
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getStatusBadge(process.status)}
            
            <div className="flex items-center gap-1 text-sm text-gray-600">
              {getTargetIcon()}
              <span>{getTargetLabel()}</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">
              Tạo bởi: {process.created_by_user?.full_name || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(process.created_at).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
