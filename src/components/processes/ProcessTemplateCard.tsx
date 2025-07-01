
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Eye, Calendar, Users, Link, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProcessTemplateWithDetails } from '@/hooks/useProcessTemplates';

interface ProcessTemplateCardProps {
  template: ProcessTemplateWithDetails;
  onEdit: (template: ProcessTemplateWithDetails) => void;
  onView: (template: ProcessTemplateWithDetails) => void;
}

export function ProcessTemplateCard({ template, onEdit, onView }: ProcessTemplateCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Đang áp dụng</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Tạm dừng</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Cao</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Thấp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'department':
        return 'Phòng ban';
      case 'position':
        return 'Vị trí';
      case 'employee':
        return 'Nhân viên cụ thể';
      default:
        return 'Tất cả';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const hasAttachments = template.external_links && template.external_links.length > 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                {template.name}
              </CardTitle>
              {template.process_categories && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-0 px-2 py-1"
                  style={{ 
                    backgroundColor: template.process_categories.color + '20',
                    color: template.process_categories.color 
                  }}
                >
                  {template.process_categories.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(template.status || 'draft')}
              {getPriorityBadge(template.priority || 'medium')}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(template)}>
                <Eye className="h-4 w-4 mr-2" />
                Xem nội dung
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Ngày tạo: {formatDate(template.created_at || '')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>Người tạo</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{getTargetTypeLabel(template.target_type || 'general')}</span>
          </div>
          {hasAttachments && (
            <div className="flex items-center space-x-1">
              <Link className="h-4 w-4" />
              <span>{template.external_links.length} liên kết</span>
            </div>
          )}
        </div>

        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onView(template)}>
            <Eye className="h-4 w-4 mr-2" />
            Xem
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(template)}>
            <Edit className="h-4 w-4 mr-2" />
            Sửa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
