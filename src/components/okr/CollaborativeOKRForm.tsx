
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Users, Target, Calendar } from 'lucide-react';

export function CollaborativeOKRForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cycle: '',
    department: '',
    collaborators: [] as string[],
    key_results: [{ title: '', target_value: '', unit: '', weight: 100 }]
  });

  const [availableCollaborators] = useState([
    { id: '1', name: 'Nguyễn Văn A', department: 'Kinh Doanh' },
    { id: '2', name: 'Trần Thị B', department: 'Kỹ Thuật' },
    { id: '3', name: 'Lê Văn C', department: 'Marketing' },
    { id: '4', name: 'Phạm Thị D', department: 'Nhân Sự' }
  ]);

  const cycles = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Năm 2024'];
  const departments = ['Kinh Doanh', 'Kỹ Thuật', 'Marketing', 'Nhân Sự', 'Tài Chính'];

  const addKeyResult = () => {
    setFormData({
      ...formData,
      key_results: [...formData.key_results, { title: '', target_value: '', unit: '', weight: 100 }]
    });
  };

  const removeKeyResult = (index: number) => {
    setFormData({
      ...formData,
      key_results: formData.key_results.filter((_, i) => i !== index)
    });
  };

  const updateKeyResult = (index: number, field: string, value: string | number) => {
    const updated = formData.key_results.map((kr, i) => 
      i === index ? { ...kr, [field]: value } : kr
    );
    setFormData({ ...formData, key_results: updated });
  };

  const addCollaborator = (collaboratorId: string) => {
    if (!formData.collaborators.includes(collaboratorId)) {
      setFormData({
        ...formData,
        collaborators: [...formData.collaborators, collaboratorId]
      });
    }
  };

  const removeCollaborator = (collaboratorId: string) => {
    setFormData({
      ...formData,
      collaborators: formData.collaborators.filter(id => id !== collaboratorId)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating collaborative OKR:', formData);
    // Xử lý tạo OKR
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Tạo OKR Cộng Tác
          </CardTitle>
          <p className="text-sm text-gray-600">
            Tạo OKR với sự tham gia của nhiều người và phòng ban
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề OKR *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="VD: Tăng trưởng doanh thu 50%"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cycle">Chu kỳ *</Label>
                <Select value={formData.cycle} onValueChange={(value) => setFormData({...formData, cycle: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chu kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    {cycles.map(cycle => (
                      <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Mô tả chi tiết về mục tiêu này"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban chủ trì</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Collaborators */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <Label>Người tham gia cộng tác</Label>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.collaborators.map(collabId => {
                  const collaborator = availableCollaborators.find(c => c.id === collabId);
                  return collaborator ? (
                    <Badge key={collabId} variant="secondary" className="flex items-center gap-1">
                      {collaborator.name} ({collaborator.department})
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeCollaborator(collabId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null;
                })}
              </div>

              <Select onValueChange={addCollaborator}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Thêm người tham gia" />
                </SelectTrigger>
                <SelectContent>
                  {availableCollaborators
                    .filter(c => !formData.collaborators.includes(c.id))
                    .map(collaborator => (
                      <SelectItem key={collaborator.id} value={collaborator.id}>
                        {collaborator.name} - {collaborator.department}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Key Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <Label>Key Results</Label>
                </div>
                <Button type="button" onClick={addKeyResult} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm Key Result
                </Button>
              </div>

              {formData.key_results.map((kr, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="Tiêu đề Key Result"
                        value={kr.title}
                        onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Giá trị mục tiêu"
                          value={kr.target_value}
                          onChange={(e) => updateKeyResult(index, 'target_value', e.target.value)}
                        />
                        <Input
                          placeholder="Đơn vị (%, triệu, người...)"
                          value={kr.unit}
                          onChange={(e) => updateKeyResult(index, 'unit', e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Trọng số:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={kr.weight}
                            onChange={(e) => updateKeyResult(index, 'weight', parseInt(e.target.value) || 100)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                    {formData.key_results.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyResult(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Lưu nháp
              </Button>
              <Button type="submit">
                <Users className="h-4 w-4 mr-2" />
                Tạo OKR cộng tác
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
