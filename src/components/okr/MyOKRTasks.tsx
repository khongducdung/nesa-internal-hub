
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Calendar, TrendingUp, Edit, Plus, X, Users, Zap } from 'lucide-react';

export function MyOKRTasks() {
  const [createOKROpen, setCreateOKROpen] = useState(false);
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

  // Mock data - sẽ thay thế bằng API call
  const myOKRs = [
    {
      id: 1,
      objective: 'Tăng trưởng doanh thu bán hàng Q1',
      cycle: 'Q1 2024',
      progress: 75,
      status: 'on_track',
      due_date: '2024-03-31',
      key_results: [
        { title: 'Tăng 25% doanh thu so với Q4', progress: 80, target: '25%', current: '20%' },
        { title: 'Thu hút 100 khách hàng mới', progress: 70, target: '100', current: '70' },
        { title: 'Tăng tỷ lệ chuyển đổi lên 20%', progress: 75, target: '20%', current: '15%' }
      ]
    },
    {
      id: 2,
      objective: 'Cải thiện quy trình làm việc',
      cycle: 'Q1 2024',
      progress: 60,
      status: 'at_risk',
      due_date: '2024-03-31',
      key_results: [
        { title: 'Triển khai 3 quy trình mới', progress: 50, target: '3', current: '1.5' },
        { title: 'Giảm 30% thời gian xử lý', progress: 65, target: '30%', current: '19.5%' },
        { title: 'Đạt 95% độ hài lòng nhân viên', progress: 65, target: '95%', current: '87%' }
      ]
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

  const handleCreateOKR = () => {
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
    setCreateOKROpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <Badge className="bg-green-100 text-green-800">Đúng tiến độ</Badge>;
      case 'at_risk':
        return <Badge className="bg-orange-100 text-orange-800">Có rủi ro</Badge>;
      case 'off_track':
        return <Badge className="bg-red-100 text-red-800">Chậm tiến độ</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">OKR của tôi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách các Objectives được giao và tiến độ thực hiện
          </p>
        </div>
        <Dialog open={createOKROpen} onOpenChange={setCreateOKROpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo OKR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Tạo OKR nhanh chóng
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
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

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setCreateOKROpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateOKR} className="bg-blue-600 hover:bg-blue-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Tạo OKR
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {myOKRs.map((okr) => (
          <Card key={okr.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{okr.objective}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{okr.cycle}</span>
                      </div>
                      <span>Hạn: {new Date(okr.due_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{okr.progress}%</div>
                    <Progress value={okr.progress} className="w-20 h-2" />
                  </div>
                  {getStatusBadge(okr.status)}
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 ml-13">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Key Results:
                </h4>
                {okr.key_results.map((kr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">{kr.title}</p>
                      <div className="flex items-center space-x-3">
                        <Progress value={kr.progress} className="flex-1 h-2" />
                        <span className="text-sm text-gray-600 min-w-[3rem]">{kr.progress}%</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{kr.current} / {kr.target}</p>
                      <div className={`w-3 h-3 rounded-full ${getProgressColor(kr.progress)} mt-1 ml-auto`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {myOKRs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có OKR nào được giao</h3>
              <p className="text-gray-500">
                Bạn chưa được phân công bất kỳ Objectives nào trong chu kỳ hiện tại
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
