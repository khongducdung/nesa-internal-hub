
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Play, Eye, Clock, Target, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProcessTemplateWithDetails } from '@/hooks/useProcessTemplates';

interface ProcessTemplateCardProps {
  template: ProcessTemplateWithDetails;
  onEdit: (template: ProcessTemplateWithDetails) => void;
  onRun: (template: ProcessTemplateWithDetails) => void;
  onView: (template: ProcessTemplateWithDetails) => void;
}

export function ProcessTemplateCard({ template, onEdit, onRun, onView }: ProcessTemplateCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Lưu trữ</Badge>;
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'department':
        return 'Phòng ban';
      case 'position':
        return 'Vị trí';
      case 'employee':
        return 'Nhân viên';
      default:
        return 'Chung';
    }
  };

  const stepsCount = Array.isArray(template.steps) ? template.steps.length : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {template.name}
              </CardTitle>
              {template.process_categories && (
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: template.process_categories.color,
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
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              {template.status === 'published' && (
                <DropdownMenuItem onClick={() => onRun(template)}>
                  <Play className="h-4 w-4 mr-2" />
                  Chạy quy trình
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {template.description || 'Không có mô tả'}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span>{stepsCount} bước</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(template.estimated_duration || 0)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{getTargetTypeLabel(template.target_type || 'general')}</span>
          </div>
          <div className="text-xs">
            v{template.version || 1}
          </div>
        </div>

        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onView(template)}>
            <Eye className="h-4 w-4 mr-2" />
            Xem
          </Button>
          {template.status === 'published' && (
            <Button size="sm" onClick={() => onRun(template)}>
              <Play className="h-4 w-4 mr-2" />
              Chạy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
