
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Link } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { CategorySelector } from './CategorySelector';
import { TargetSelector } from './TargetSelector';
import { FileAttachments } from './FileAttachments';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ProcessTemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  inline?: boolean;
}

export function ProcessTemplateForm({ open, onOpenChange, onSubmit, initialData, inline = false }: ProcessTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    category_id: '',
    target_type: 'general',
    target_ids: [],
    priority: 'medium',
    tags: [],
    external_links: [],
    status: 'published',
    attachments: []
  });

  const [newTag, setNewTag] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        content: initialData.content || '',
        category_id: initialData.category_id || '',
        target_type: initialData.target_type || 'general',
        target_ids: initialData.target_ids || [],
        priority: initialData.priority || 'medium',
        tags: initialData.tags || [],
        external_links: initialData.external_links || [],
        status: initialData.status || 'published',
        attachments: initialData.attachments || []
      });
    } else {
      // Reset form when no initial data
      setFormData({
        name: '',
        content: '',
        category_id: '',
        target_type: 'general',
        target_ids: [],
        priority: 'medium',
        tags: [],
        external_links: [],
        status: 'published',
        attachments: []
      });
    }
  }, [initialData]);

  const validateForm = () => {
    // Kiểm tra user đã đăng nhập chưa
    if (!user) {
      toast({
        title: "Lỗi xác thực",
        description: "Bạn cần đăng nhập để thực hiện chức năng này",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng nhập tiêu đề tài liệu",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.category_id) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng chọn danh mục",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng nhập nội dung hướng dẫn",
        variant: "destructive",
      });
      return false;
    }

    // Validate external links
    for (let i = 0; i < formData.external_links.length; i++) {
      const link = formData.external_links[i];
      if (!link.title.trim()) {
        toast({
          title: "Lỗi validation",
          description: `Vui lòng nhập tiêu đề cho liên kết thứ ${i + 1}`,
          variant: "destructive",
        });
        return false;
      }
      if (!link.url.trim()) {
        toast({
          title: "Lỗi validation",
          description: `Vui lòng nhập URL cho liên kết thứ ${i + 1}`,
          variant: "destructive",
        });
        return false;
      }
      // Basic URL validation
      try {
        new URL(link.url);
      } catch {
        toast({
          title: "Lỗi validation",
          description: `URL không hợp lệ cho liên kết thứ ${i + 1}: ${link.url}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    console.log('Form submission attempted with data:', formData);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      
      if (!inline) {
        onOpenChange(false);
      } else if (!initialData) {
        // Reset form for inline mode only when creating new (not editing)
        setFormData({
          name: '',
          content: '',
          category_id: '',
          target_type: 'general',
          target_ids: [],
          priority: 'medium',
          tags: [],
          external_links: [],
          status: 'published',
          attachments: []
        });
        setNewTag('');
        setNewLink({ title: '', url: '' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Error handling is done in the parent component and mutations
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addExternalLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      // Basic URL validation
      try {
        new URL(newLink.url);
        setFormData(prev => ({
          ...prev,
          external_links: [...prev.external_links, { ...newLink }]
        }));
        setNewLink({ title: '', url: '' });
      } catch {
        toast({
          title: "Lỗi validation",
          description: "URL không hợp lệ",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng nhập đầy đủ tiêu đề và URL",
        variant: "destructive",
      });
    }
  };

  const removeExternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      external_links: prev.external_links.filter((_, i) => i !== index)
    }));
  };

  // Kiểm tra user đã đăng nhập chưa
  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Cần đăng nhập</h3>
        <p className="text-gray-500">Bạn cần đăng nhập để sử dụng chức năng này</p>
      </div>
    );
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông tin cơ bản */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium">Tiêu đề tài liệu *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nhập tiêu đề tài liệu hướng dẫn..."
            className="mt-2 text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Danh mục *</Label>
          <div className="mt-2">
            <CategorySelector
              value={formData.category_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            />
          </div>
        </div>
      </div>

      {/* Hàng thứ hai với 4 trường */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Đang áp dụng</SelectItem>
              <SelectItem value="draft">Tạm dừng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Độ ưu tiên</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Thấp</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="high">Cao</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="target_type">Đối tượng áp dụng</Label>
          <Select value={formData.target_type} onValueChange={(value) => setFormData(prev => ({ ...prev, target_type: value, target_ids: [] }))}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Tất cả nhân viên</SelectItem>
              <SelectItem value="department">Theo phòng ban</SelectItem>
              <SelectItem value="position">Theo vị trí</SelectItem>
              <SelectItem value="employee">Nhân viên cụ thể</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Từ khóa (Tags)</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Thêm từ khóa..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(index)} />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Đối tượng áp dụng cụ thể */}
      {formData.target_type !== 'general' && (
        <div>
          <Label>Chọn đối tượng cụ thể</Label>
          <div className="mt-2">
            <TargetSelector
              targetType={formData.target_type}
              selectedIds={formData.target_ids}
              onSelectionChange={(ids) => setFormData(prev => ({ ...prev, target_ids: ids }))}
            />
          </div>
        </div>
      )}

      {/* Nội dung hướng dẫn */}
      <div>
        <Label className="text-base font-medium mb-3 block">Nội dung hướng dẫn chi tiết *</Label>
        <RichTextEditor
          value={formData.content}
          onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
          placeholder="Soạn thảo nội dung hướng dẫn chi tiết..."
          minHeight="400px"
          className="border rounded-lg"
        />
      </div>

      {/* Tài liệu đính kèm */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên kết tham khảo</h3>
          <div className="space-y-2 mb-4">
            {formData.external_links.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{link.title}</div>
                    <div className="text-sm text-gray-500">{link.url}</div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExternalLink(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Tiêu đề liên kết..."
              value={newLink.title}
              onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="URL..."
              value={newLink.url}
              onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>
          <Button type="button" onClick={addExternalLink} size="sm" className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Thêm liên kết
          </Button>
        </div>

        <div>
          <FileAttachments
            attachments={formData.attachments}
            onAttachmentsChange={(attachments) => setFormData(prev => ({ ...prev, attachments }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        {!inline && (
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Hủy
          </Button>
        )}
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : (initialData ? 'Cập nhật' : 'Tạo tài liệu')}
        </Button>
      </div>
    </form>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? 'Chỉnh sửa tài liệu hướng dẫn' : 'Tạo tài liệu hướng dẫn mới'}
          </DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
