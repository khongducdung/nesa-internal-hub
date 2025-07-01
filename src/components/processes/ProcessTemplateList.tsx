
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Calendar, Users, Link, User, Plus, List } from 'lucide-react';
import { ProcessTemplateWithDetails } from '@/hooks/useProcessTemplates';
import { useSettings } from '@/components/ui/settings-context';

interface ProcessTemplateListProps {
  templates: ProcessTemplateWithDetails[];
  isLoading: boolean;
  onEdit: (template: ProcessTemplateWithDetails) => void;
  onView: (template: ProcessTemplateWithDetails) => void;
  onCreateFirst: () => void;
}

export function ProcessTemplateList({ templates, isLoading, onEdit, onView, onCreateFirst }: ProcessTemplateListProps) {
  const { hideDescriptions } = useSettings();

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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <List className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu hướng dẫn</h3>
        {!hideDescriptions && (
          <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo tài liệu hướng dẫn đầu tiên cho nhân viên</p>
        )}
        <Button onClick={onCreateFirst} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tạo tài liệu đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên tài liệu</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Độ ưu tiên</TableHead>
          <TableHead>Đối tượng</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Liên kết</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">
              <div>
                <div 
                  className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onView(template)}
                >
                  {template.name}
                </div>
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        +{template.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell>
              {getStatusBadge(template.status || 'draft')}
            </TableCell>
            <TableCell>
              {getPriorityBadge(template.priority || 'medium')}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{getTargetTypeLabel(template.target_type || 'general')}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(template.created_at || '')}</span>
              </div>
            </TableCell>
            <TableCell>
              {template.external_links && template.external_links.length > 0 && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Link className="h-4 w-4" />
                  <span>{template.external_links.length}</span>
                </div>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(template)}
                className="hover:bg-blue-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
