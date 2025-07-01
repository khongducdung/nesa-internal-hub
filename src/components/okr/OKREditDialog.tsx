
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Save, Target, Link2 } from 'lucide-react';
import { OKRObjective, useOKRData } from '@/hooks/useOKRData';

interface OKREditDialogProps {
  okr: OKRObjective | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (okrData: Partial<OKRObjective>) => void;
}

type KeyResultFormData = {
  id: string;
  title: string;
  target_value: string;
  current_value: string;
  unit: string;
  weight: number;
  progress: number;
  status: 'not_started' | 'on_track' | 'at_risk' | 'completed';
};

type FormData = {
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  parent_okr_id: string;
  key_results: KeyResultFormData[];
};

export function OKREditDialog({ okr, isOpen, onClose, onSave }: OKREditDialogProps) {
  const { companyOKRs, departmentOKRs } = useOKRData();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'active',
    parent_okr_id: '',
    key_results: [{ id: '', title: '', target_value: '', current_value: '', unit: '', weight: 100, progress: 0, status: 'not_started' }]
  });

  useEffect(() => {
    if (okr) {
      setFormData({
        title: okr.title,
        description: okr.description,
        status: okr.status,
        parent_okr_id: okr.parent_okr_id || '',
        key_results: okr.key_results.map(kr => ({
          id: kr.id,
          title: kr.title,
          target_value: kr.target_value.toString(),
          current_value: kr.current_value.toString(),
          unit: kr.unit,
          weight: kr.weight,
          progress: kr.progress,
          status: kr.status
        }))
      });
    }
  }, [okr]);

  const addKeyResult = () => {
    setFormData({
      ...formData,
      key_results: [...formData.key_results, {
        id: `new_${Date.now()}`,
        title: '',
        target_value: '',
        current_value: '',
        unit: '',
        weight: 100,
        progress: 0,
        status: 'not_started'
      }]
    });
  };

  const updateKeyResult = (index: number, field: string, value: string | number) => {
    const updated = formData.key_results.map((kr, i) => {
      if (i === index) {
        const newKr = { ...kr, [field]: value };
        // Auto-calculate progress if current_value or target_value changes
        if (field === 'current_value' || field === 'target_value') {
          const current = field === 'current_value' ? parseFloat(value as string) || 0 : parseFloat(kr.current_value) || 0;
          const target = field === 'target_value' ? parseFloat(value as string) || 1 : parseFloat(kr.target_value) || 1;
          newKr.progress = Math.min(100, Math.round((current / target) * 100));
          newKr.status = newKr.progress >= 100 ? 'completed' : newKr.progress >= 70 ? 'on_track' : newKr.progress >= 40 ? 'at_risk' : 'not_started';
        }
        return newKr;
      }
      return kr;
    });
    setFormData({ ...formData, key_results: updated });
  };

  const removeKeyResult = (index: number) => {
    setFormData({
      ...formData,
      key_results: formData.key_results.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    const keyResults = formData.key_results
      .filter(kr => kr.title && kr.target_value)
      .map(kr => ({
        id: kr.id || `kr_${Date.now()}_${Math.random()}`,
        title: kr.title,
        target_value: parseFloat(kr.target_value) || 0,
        current_value: parseFloat(kr.current_value) || 0,
        unit: kr.unit || '',
        weight: kr.weight || 100,
        progress: kr.progress,
        status: kr.status
      }));

    const totalProgress = keyResults.reduce((sum, kr) => sum + (kr.progress * kr.weight / 100), 0);

    onSave({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      parent_okr_id: formData.parent_okr_id || undefined,
      key_results: keyResults,
      progress: Math.round(totalProgress)
    });

    onClose();
  };

  if (!okr) return null;

  // Get available parent OKRs (higher level than current OKR)
  const availableParentOKRs = [
    ...companyOKRs.filter(o => o.id !== okr.id && okr.owner_type !== 'company'),
    ...departmentOKRs.filter(o => o.id !== okr.id && okr.owner_type === 'individual')
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Chỉnh sửa OKR
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="key-results">Key Results</TabsTrigger>
            <TabsTrigger value="alignment">Liên kết OKR</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề OKR *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập tiêu đề OKR..."
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về OKR..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value: 'draft' | 'active' | 'completed' | 'cancelled') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="key-results" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Key Results ({formData.key_results.length})</Label>
                <Button onClick={addKeyResult} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm KR
                </Button>
              </div>

              <div className="space-y-3">
                {formData.key_results.map((kr, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Key Result {index + 1}</Label>
                          {formData.key_results.length > 1 && (
                            <Button
                              onClick={() => removeKeyResult(index)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
                            <Input
                              placeholder="Tiêu đề Key Result"
                              value={kr.title}
                              onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Giá trị hiện tại"
                              value={kr.current_value}
                              onChange={(e) => updateKeyResult(index, 'current_value', e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Mục tiêu"
                              value={kr.target_value}
                              onChange={(e) => updateKeyResult(index, 'target_value', e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Đơn vị"
                              value={kr.unit}
                              onChange={(e) => updateKeyResult(index, 'unit', e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Trọng số (%)"
                              value={kr.weight}
                              onChange={(e) => updateKeyResult(index, 'weight', parseInt(e.target.value) || 100)}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Tiến độ:</span>
                            <Badge variant="outline" className={
                              kr.status === 'completed' ? 'bg-green-100 text-green-800' :
                              kr.status === 'on_track' ? 'bg-blue-100 text-blue-800' :
                              kr.status === 'at_risk' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {kr.progress}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alignment" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Liên kết với OKR cấp cao
                </Label>
                <Select value={formData.parent_okr_id} onValueChange={(value) => setFormData({ ...formData, parent_okr_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn OKR cấp cao để liên kết (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không liên kết</SelectItem>
                    {availableParentOKRs.map((parentOKR) => (
                      <SelectItem key={parentOKR.id} value={parentOKR.id}>
                        <div className="flex items-center gap-2">
                          {parentOKR.owner_type === 'company' ? '🏢' : '👥'} {parentOKR.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Liên kết OKR với mục tiêu cấp cao để tạo sự đồng bộ trong tổ chức
                </p>
              </div>

              {okr.aligned_okrs && okr.aligned_okrs.length > 0 && (
                <div className="space-y-2">
                  <Label>OKR đã liên kết ({okr.aligned_okrs.length})</Label>
                  <div className="space-y-2">
                    {okr.aligned_okrs.map((alignedOKR) => (
                      <div key={alignedOKR.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{alignedOKR.owner_type === 'individual' ? '👤' : '👥'}</span>
                            <span className="font-medium text-green-800">{alignedOKR.title}</span>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            {alignedOKR.progress}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
