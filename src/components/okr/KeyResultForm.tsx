
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { useOKRData } from '@/hooks/useOKRData';
import { useDepartments } from '@/hooks/useDepartments';

// Use a simplified interface for form data
export interface KeyResultFormData {
  id?: string;
  title: string;
  description: string;
  target_value: number;
  unit: string;
  weight: number;
  due_date?: string;
  linked_okr_id?: string;
  linked_department_id?: string;
  linked_kr_id?: string;
}

interface KeyResultFormProps {
  keyResults: KeyResultFormData[];
  onKeyResultsChange: (keyResults: KeyResultFormData[]) => void;
  ownerType: 'company' | 'department' | 'individual';
}

export function KeyResultForm({ keyResults, onKeyResultsChange, ownerType }: KeyResultFormProps) {
  const { getAllOKRs } = useOKRData();
  const { data: departments = [] } = useDepartments();

  const addKeyResult = () => {
    const newKR: KeyResultFormData = {
      title: '',
      description: '',
      target_value: 0,
      unit: '',
      weight: 100,
      due_date: '',
    };
    onKeyResultsChange([...keyResults, newKR]);
  };

  const updateKeyResult = (index: number, updates: Partial<KeyResultFormData>) => {
    const updated = keyResults.map((kr, i) => 
      i === index ? { ...kr, ...updates } : kr
    );
    onKeyResultsChange(updated);
  };

  const removeKeyResult = (index: number) => {
    onKeyResultsChange(keyResults.filter((_, i) => i !== index));
  };

  // Get available OKRs for linking based on hierarchy
  const getAvailableOKRsForLinking = () => {
    const allOKRs = getAllOKRs();
    
    // For individual OKRs, can link to department OKRs
    if (ownerType === 'individual') {
      return allOKRs.filter(okr => okr.owner_type === 'department');
    }
    
    // For department OKRs, can link to company OKRs  
    if (ownerType === 'department') {
      return allOKRs.filter(okr => okr.owner_type === 'company');
    }
    
    // Company OKRs typically don't link to higher level
    return [];
  };

  const availableOKRs = getAvailableOKRsForLinking();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Key Results *</Label>
        <Button type="button" variant="outline" size="sm" onClick={addKeyResult}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm KR
        </Button>
      </div>

      {keyResults.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 text-center mb-4">
              Chưa có Key Result nào. Mỗi OKR cần có ít nhất 1 Key Result để đo lường tiến độ.
            </p>
            <Button type="button" variant="outline" onClick={addKeyResult}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm Key Result đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}

      {keyResults.map((kr, index) => (
        <Card key={index} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Key Result #{index + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeKeyResult(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`kr-title-${index}`}>Tiêu đề KR *</Label>
                <Input
                  id={`kr-title-${index}`}
                  value={kr.title}
                  onChange={(e) => updateKeyResult(index, { title: e.target.value })}
                  placeholder="Ví dụ: Tăng doanh thu lên 100 triệu"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`kr-weight-${index}`}>Trọng số (%)</Label>
                <Input
                  id={`kr-weight-${index}`}
                  type="number"
                  min="1"
                  max="100"
                  value={kr.weight}
                  onChange={(e) => updateKeyResult(index, { weight: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`kr-description-${index}`}>Mô tả</Label>
              <Textarea
                id={`kr-description-${index}`}
                value={kr.description}
                onChange={(e) => updateKeyResult(index, { description: e.target.value })}
                placeholder="Mô tả chi tiết về Key Result này"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`kr-target-${index}`}>Mục tiêu *</Label>
                <Input
                  id={`kr-target-${index}`}
                  type="number"
                  step="0.01"
                  value={kr.target_value}
                  onChange={(e) => updateKeyResult(index, { target_value: Number(e.target.value) })}
                  placeholder="100"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`kr-unit-${index}`}>Đơn vị *</Label>
                <Input
                  id={`kr-unit-${index}`}
                  value={kr.unit}
                  onChange={(e) => updateKeyResult(index, { unit: e.target.value })}
                  placeholder="triệu VND, %, khách hàng..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`kr-due-date-${index}`}>Hạn hoàn thành</Label>
                <Input
                  id={`kr-due-date-${index}`}
                  type="date"
                  value={kr.due_date}
                  onChange={(e) => updateKeyResult(index, { due_date: e.target.value })}
                />
              </div>
            </div>

            {/* Enhanced Linking System */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900">Liên kết phân cấp</h4>
              
              {/* Company KR linking to departments */}
              {ownerType === 'company' && (
                <div className="space-y-2">
                  <Label htmlFor={`kr-dept-link-${index}`}>
                    Liên kết đến phòng ban *
                    <span className="text-sm text-gray-500 ml-2">
                      (KR này sẽ ảnh hưởng đến phòng ban nào?)
                    </span>
                  </Label>
                  <Select
                    value={kr.linked_department_id || ''}
                    onValueChange={(value) => updateKeyResult(index, { linked_department_id: value || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Không liên kết cụ thể</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Upward OKR linking */}
              {availableOKRs.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor={`kr-okr-link-${index}`}>
                    {ownerType === 'individual' ? 'Liên kết đến OKR phòng ban *' : 'Liên kết đến OKR cấp cao'}
                    <span className="text-sm text-gray-500 ml-2">
                      (KR này đóng góp vào OKR nào?)
                    </span>
                  </Label>
                  <Select
                    value={kr.linked_okr_id || ''}
                    onValueChange={(value) => updateKeyResult(index, { linked_okr_id: value || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn OKR để liên kết" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Không liên kết</SelectItem>
                      {availableOKRs.map((okr) => (
                        <SelectItem key={okr.id} value={okr.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{okr.title}</span>
                            <span className="text-xs text-gray-500">
                              {okr.owner_type === 'company' ? 'Công ty' : 
                               okr.owner_type === 'department' ? 'Phòng ban' : 'Cá nhân'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {keyResults.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
          <span>Tổng trọng số: {keyResults.reduce((sum, kr) => sum + kr.weight, 0)}%</span>
          {keyResults.reduce((sum, kr) => sum + kr.weight, 0) !== 100 && (
            <span className="text-amber-600">⚠️ Khuyến nghị tổng trọng số = 100%</span>
          )}
        </div>
      )}
    </div>
  );
}
