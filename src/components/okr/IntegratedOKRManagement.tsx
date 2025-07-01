
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X, Users, Target, Calendar, Zap, TrendingUp, CheckCircle, AlertCircle, Star } from 'lucide-react';

export function IntegratedOKRManagement() {
  const [activeTab, setActiveTab] = useState('quick-create');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cycle: 'Q1 2024',
    department: '',
    collaborators: [] as string[],
    key_results: [{ title: '', target_value: '', unit: '', weight: 100 }],
    type: 'individual' // individual, collaborative, department
  });

  // Sample data
  const availableCollaborators = [
    { id: '1', name: 'Nguyễn Văn A', department: 'Kinh Doanh', avatar: '🧑‍💼' },
    { id: '2', name: 'Trần Thị B', department: 'Kỹ Thuật', avatar: '👩‍💻' },
    { id: '3', name: 'Lê Văn C', department: 'Marketing', avatar: '🧑‍🎨' },
    { id: '4', name: 'Phạm Thị D', department: 'Nhân Sự', avatar: '👩‍💼' }
  ];

  const departments = ['Kinh Doanh', 'Kỹ Thuật', 'Marketing', 'Nhân Sự', 'Tài Chính'];
  const cycles = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];

  const existingOKRs = [
    {
      id: '1',
      title: 'Tăng doanh thu 30%',
      progress: 75,
      cycle: 'Q1 2024',
      type: 'individual',
      collaborators: [],
      keyResults: 3,
      status: 'on_track'
    },
    {
      id: '2', 
      title: 'Phát triển sản phẩm mới',
      progress: 45,
      cycle: 'Q1 2024',
      type: 'collaborative',
      collaborators: ['Nguyễn Văn A', 'Trần Thị B'],
      keyResults: 4,
      status: 'at_risk'
    },
    {
      id: '3',
      title: 'Cải thiện quy trình làm việc',
      progress: 90,
      cycle: 'Q1 2024', 
      type: 'department',
      collaborators: [],
      keyResults: 2,
      status: 'ahead'
    }
  ];

  const addKeyResult = () => {
    setFormData({
      ...formData,
      key_results: [...formData.key_results, { title: '', target_value: '', unit: '', weight: 100 }]
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

  const handleQuickCreate = () => {
    console.log('Creating OKR:', formData);
    // Reset form
    setFormData({
      title: '',
      description: '',
      cycle: 'Q1 2024',
      department: '',
      collaborators: [],
      key_results: [{ title: '', target_value: '', unit: '', weight: 100 }],
      type: 'individual'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at_risk': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'ahead': return <Star className="h-4 w-4 text-blue-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-700 border-green-200';
      case 'at_risk': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ahead': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'collaborative': return <Users className="h-4 w-4" />;
      case 'department': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý OKR Tổng hợp</h2>
          <p className="text-gray-600 mt-1">
            Tạo, quản lý và theo dõi OKR cá nhân, cộng tác và phòng ban tại một nơi
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Calendar className="h-4 w-4 mr-2" />
            Xem lịch sử
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick-create" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Tạo OKR nhanh
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Quản lý OKR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-create" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-orange-500" />
                Tạo OKR nhanh chóng
              </CardTitle>
              <p className="text-sm text-gray-600">
                Thiết lập nhanh OKR với các tùy chọn thông minh
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OKR Type Selection */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'individual', label: 'Cá nhân', icon: Target, desc: 'OKR cho riêng tôi' },
                  { value: 'collaborative', label: 'Cộng tác', icon: Users, desc: 'Làm việc cùng đồng nghiệp' },
                  { value: 'department', label: 'Phòng ban', icon: TrendingUp, desc: 'Mục tiêu chung phòng ban' }
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all border-2 ${
                        formData.type === type.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, type: type.value})}
                    >
                      <CardContent className="p-4 text-center">
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${
                          formData.type === type.value ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tiêu đề OKR *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="VD: Tăng doanh thu 50% trong Q1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chu kỳ</Label>
                  <Select value={formData.cycle} onValueChange={(value) => setFormData({...formData, cycle: value})}>
                    <SelectTrigger>
                      <SelectValue />
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
                <Label>Mô tả (tùy chọn)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Mô tả chi tiết về mục tiêu..."
                  rows={2}
                />
              </div>

              {/* Collaborators for collaborative type */}
              {formData.type === 'collaborative' && (
                <div className="space-y-3">
                  <Label>Người cộng tác</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.collaborators.map(collabId => {
                      const collaborator = availableCollaborators.find(c => c.id === collabId);
                      return collaborator ? (
                        <Badge key={collabId} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                          <span>{collaborator.avatar}</span>
                          {collaborator.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent ml-1"
                            onClick={() => removeCollaborator(collabId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <Select onValueChange={addCollaborator}>
                    <SelectTrigger>
                      <SelectValue placeholder="Thêm người cộng tác" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCollaborators
                        .filter(c => !formData.collaborators.includes(c.id))
                        .map(collaborator => (
                          <SelectItem key={collaborator.id} value={collaborator.id}>
                            <div className="flex items-center gap-2">
                              <span>{collaborator.avatar}</span>
                              {collaborator.name} - {collaborator.department}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Department for department type */}
              {formData.type === 'department' && (
                <div className="space-y-2">
                  <Label>Phòng ban</Label>
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
              )}

              {/* Key Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Key Results (tối đa 5)</Label>
                  <Button 
                    type="button" 
                    onClick={addKeyResult} 
                    size="sm" 
                    variant="outline"
                    disabled={formData.key_results.length >= 5}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm KR
                  </Button>
                </div>

                {formData.key_results.map((kr, index) => (
                  <Card key={index} className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                      <div className="md:col-span-6">
                        <Input
                          placeholder={`Key Result ${index + 1}`}
                          value={kr.title}
                          onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Mục tiêu"
                          value={kr.target_value}
                          onChange={(e) => updateKeyResult(index, 'target_value', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Đơn vị"
                          value={kr.unit}
                          onChange={(e) => updateKeyResult(index, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={kr.weight}
                          onChange={(e) => updateKeyResult(index, 'weight', parseInt(e.target.value) || 100)}
                        />
                      </div>
                      {formData.key_results.length > 1 && (
                        <div className="md:col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData({
                              ...formData,
                              key_results: formData.key_results.filter((_, i) => i !== index)
                            })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleQuickCreate} className="bg-blue-600 hover:bg-blue-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Tạo OKR nhanh
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {existingOKRs.map((okr) => (
              <Card key={okr.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(okr.type)}
                      <Badge variant="outline" className={getStatusColor(okr.status)}>
                        {getStatusIcon(okr.status)}
                        <span className="ml-1">
                          {okr.status === 'on_track' && 'Đúng hướng'}
                          {okr.status === 'at_risk' && 'Có rủi ro'}
                          {okr.status === 'ahead' && 'Vượt tiến độ'}
                        </span>
                      </Badge>
                    </div>
                    <Badge variant="secondary">{okr.cycle}</Badge>
                  </div>
                  <CardTitle className="text-lg">{okr.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tiến độ</span>
                        <span className="font-medium">{okr.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{ width: `${okr.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{okr.keyResults} Key Results</span>
                      {okr.collaborators.length > 0 && (
                        <span>{okr.collaborators.length} cộng tác viên</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Cập nhật tiến độ
                      </Button>
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
