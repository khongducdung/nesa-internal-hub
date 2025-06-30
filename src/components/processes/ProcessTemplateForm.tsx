
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Link, Upload, FileText } from 'lucide-react';
import { useProcessCategories } from '@/hooks/useProcessCategories';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useEmployees } from '@/hooks/useEmployees';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface ProcessTemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function ProcessTemplateForm({ open, onOpenChange, onSubmit, initialData }: ProcessTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    category_id: initialData?.category_id || '',
    target_type: initialData?.target_type || 'general',
    target_ids: initialData?.target_ids || [],
    priority: initialData?.priority || 'medium',
    estimated_duration: initialData?.estimated_duration || 60,
    tags: initialData?.tags || [],
    external_links: initialData?.external_links || [],
    status: initialData?.status || 'draft'
  });

  const [newTag, setNewTag] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const { data: categories } = useProcessCategories();
  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();
  const { data: employees } = useEmployees();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tạo steps từ content để tương thích với schema hiện tại
    const processData = {
      ...formData,
      steps: [{ title: 'Nội dung hướng dẫn', description: formData.content, required: true }]
    };
    onSubmit(processData);
    onOpenChange(false);
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
      setFormData(prev => ({
        ...prev,
        external_links: [...prev.external_links, { ...newLink }]
      }));
      setNewLink({ title: '', url: '' });
    }
  };

  const removeExternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      external_links: prev.external_links.filter((_, i) => i !== index)
    }));
  };

  const getTargetOptions = () => {
    switch (formData.target_type) {
      case 'department':
        return departments?.map(dept => ({ id: dept.id, name: dept.name })) || [];
      case 'position':
        return positions?.map(pos => ({ id: pos.id, name: pos.name })) || [];
      case 'employee':
        return employees?.map(emp => ({ id: emp.id, name: emp.full_name })) || [];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? 'Chỉnh sửa tài liệu hướng dẫn' : 'Tạo tài liệu hướng dẫn mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Nội dung chính</TabsTrigger>
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="attachments">Tài liệu đính kèm</TabsTrigger>
              <TabsTrigger value="targets">Đối tượng áp dụng</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
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
                <Label htmlFor="description" className="text-base font-medium">Mô tả ngắn</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn gọn về nội dung tài liệu..."
                  rows={2}
                  className="mt-2"
                />
              </div>

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
            </TabsContent>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color || '#6B7280' }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                      <SelectItem value="archived">Lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Độ ưu tiên</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
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
                  <Label htmlFor="duration">Thời gian đọc ước tính (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label>Từ khóa (Tags)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(index)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
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
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
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
                <h3 className="text-lg font-semibold mb-4">Tệp đính kèm</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">Kéo thả file vào đây hoặc click để chọn</p>
                  <p className="text-sm text-gray-500">Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Tối đa 10MB)</p>
                  <Button type="button" variant="outline" className="mt-4">
                    <FileText className="h-4 w-4 mr-2" />
                    Chọn tệp
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="targets" className="space-y-4">
              <div>
                <Label htmlFor="target_type">Đối tượng áp dụng</Label>
                <Select value={formData.target_type} onValueChange={(value) => setFormData(prev => ({ ...prev, target_type: value, target_ids: [] }))}>
                  <SelectTrigger>
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

              {formData.target_type !== 'general' && (
                <div>
                  <Label>Chọn đối tượng cụ thể</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3 mt-2">
                    {getTargetOptions().map((option) => (
                      <label key={option.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={formData.target_ids.includes(option.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                target_ids: [...prev.target_ids, option.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                target_ids: prev.target_ids.filter(id => id !== option.id)
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{option.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {initialData ? 'Cập nhật' : 'Tạo tài liệu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
