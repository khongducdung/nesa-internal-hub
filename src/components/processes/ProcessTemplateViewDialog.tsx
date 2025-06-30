
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, Users, Link, FileText, User, X } from 'lucide-react';
import { ProcessTemplateWithDetails } from '@/hooks/useProcessTemplates';

interface ProcessTemplateViewDialogProps {
  template: ProcessTemplateWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (template: ProcessTemplateWithDetails) => void;
}

export function ProcessTemplateViewDialog({ template, open, onOpenChange, onEdit }: ProcessTemplateViewDialogProps) {
  if (!template) return null;

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
        return 'Tất cả nhân viên';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    onEdit(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900 pr-8">
              {template.name}
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
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Danh mục</label>
                <div className="mt-1">
                  {template.process_categories && (
                    <Badge 
                      variant="outline" 
                      className="text-sm border-0 px-3 py-1"
                      style={{ 
                        backgroundColor: template.process_categories.color + '20',
                        color: template.process_categories.color 
                      }}
                    >
                      {template.process_categories.name}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                <div className="mt-1">
                  {getStatusBadge(template.status || 'draft')}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Độ ưu tiên</label>
                <div className="mt-1">
                  {getPriorityBadge(template.priority || 'medium')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Đối tượng áp dụng</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{getTargetTypeLabel(template.target_type || 'general')}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Ngày tạo</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(template.created_at || '')}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Người tạo</label>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Từ khóa</label>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-3">Nội dung hướng dẫn</label>
            <div 
              className="prose max-w-none bg-gray-50 p-6 rounded-lg border"
              dangerouslySetInnerHTML={{ __html: template.content || 'Chưa có nội dung' }}
            />
          </div>

          {/* External Links */}
          {template.external_links && template.external_links.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-3">Liên kết tham khảo</label>
              <div className="space-y-2">
                {template.external_links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">{link.title}</div>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {template.attachments && template.attachments.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-3">Tệp đính kèm</label>
              <div className="space-y-2">
                {template.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">{attachment.name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
