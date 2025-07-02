import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building2, Target, TrendingUp, Plus, Edit, Eye, Users, Calendar, CheckCircle, AlertTriangle, Clock, Trash2, Link2 } from 'lucide-react';
import { useOKRData, OKRObjective } from '@/hooks/useOKRData';
import { useAuth } from '@/hooks/useAuth';
import { OKRViewDialog } from './OKRViewDialog';
import { OKREditDialog } from './OKREditDialog';
import { useToast } from '@/hooks/use-toast';

export function CompanyOKRView() {
  const { companyOKRs, currentCycle, createOKR, updateOKR, deleteOKR, updateKeyResult, loading } = useOKRData();
  const { profile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState<OKRObjective | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    key_results: [{ title: '', target_value: '', unit: '', weight: 100 }]
  });

  const getStatusBadge = (status: string, progress: number) => {
    if (status === 'completed') return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Hoàn thành</Badge>;
    if (progress >= 80) return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><TrendingUp className="h-3 w-3" />Vượt tiến độ</Badge>;
    if (progress >= 60) return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Đúng tiến độ</Badge>;
    if (progress >= 40) return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Cần chú ý</Badge>;
    return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><Clock className="h-3 w-3" />Chậm tiến độ</Badge>;
  };

  const addKeyResult = () => {
    setFormData({
      ...formData,
      key_results: [...formData.key_results, { title: '', target_value: '', unit: '', weight: 100 }]
    });
  };

  const updateKeyResultForm = (index: number, field: string, value: string | number) => {
    const updated = formData.key_results.map((kr, i) => 
      i === index ? { ...kr, [field]: value } : kr
    );
    setFormData({ ...formData, key_results: updated });
  };

  const handleCreateOKR = async () => {
    if (!formData.title) return;

    const keyResults = formData.key_results
      .filter(kr => kr.title && kr.target_value)
      .map((kr, index) => ({
        id: `kr_${Date.now()}_${index}`,
        okr_id: '',
        title: kr.title,
        target_value: parseFloat(kr.target_value) || 0,
        current_value: 0,
        unit: kr.unit || '',
        weight: kr.weight || 100,
        progress: 0,
        status: 'not_started' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

    await createOKR({
      ...formData,
      owner_type: 'company',
      key_results: keyResults
    });

    toast({
      title: "Thành công",
      description: "Đã tạo OKR công ty mới",
    });

    setFormData({
      title: '',
      description: '',
      key_results: [{ title: '', target_value: '', unit: '', weight: 100 }]
    });
    setCreateDialogOpen(false);
  };

  const handleUpdateProgress = async (okrId: string, keyResultId: string, newValue: number) => {
    const okr = companyOKRs.find(o => o.id === okrId);
    const keyResult = okr?.key_results.find(kr => kr.id === keyResultId);
    
    if (keyResult) {
      const progress = Math.min(100, Math.round((newValue / keyResult.target_value) * 100));
      const status = progress >= 100 ? 'completed' : progress >= 70 ? 'on_track' : progress >= 40 ? 'at_risk' : 'not_started';
      
      await updateKeyResult(okrId, keyResultId, {
        current_value: newValue,
        progress,
        status
      });

      toast({
        title: "Cập nhật thành công",
        description: "Tiến độ Key Result đã được cập nhật",
      });
    }
  };

  const handleViewOKR = (okr: OKRObjective) => {
    setSelectedOKR(okr);
    setViewDialogOpen(true);
  };

  const handleEditOKR = (okr: OKRObjective) => {
    setSelectedOKR(okr);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (okrData: Partial<OKRObjective>) => {
    if (selectedOKR) {
      await updateOKR(selectedOKR.id, okrData);
      toast({
        title: "Cập nhật thành công",
        description: "OKR đã được cập nhật",
      });
    }
  };

  const handleDeleteOKR = async (okrId: string) => {
    await deleteOKR(okrId);
    toast({
      title: "Xóa thành công",
      description: "OKR đã được xóa khỏi hệ thống",
    });
  };

  // Mock department OKRs aligned with company OKRs
  const departmentOKRs = [
    {
      id: '1',
      department: 'Phòng Kinh Doanh',
      okr_title: 'Tăng 40% doanh số Q1 2024',
      progress: 75,
      contributes_to: 'Tăng trưởng doanh thu 50% trong năm 2024',
      owner: 'Nguyễn Văn A',
      status: 'on_track'
    },
    {
      id: '2',
      department: 'Phòng Kỹ Thuật',
      okr_title: 'Phát triển 3 sản phẩm mới',
      progress: 67,
      contributes_to: 'Tăng trưởng doanh thu 50% trong năm 2024',
      owner: 'Trần Thị B',
      status: 'on_track'
    },
    {
      id: '3',
      department: 'Phòng Chăm Sóc KH',
      okr_title: 'Cải thiện chất lượng dịch vụ',
      progress: 90,
      contributes_to: 'Nâng cao chất lượng dịch vụ khách hàng',
      owner: 'Lê Văn C',
      status: 'ahead'
    }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">OKRs Công ty</h2>
            <p className="text-sm text-gray-600">
              Chu kỳ: {currentCycle?.name} • {companyOKRs.length} mục tiêu đang hoạt động
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tạo OKR Công ty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo OKR Công ty mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiêu đề OKR *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="VD: Tăng trưởng doanh thu 50% trong năm 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mô tả</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Mô tả chi tiết về mục tiêu..."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Key Results</label>
                    <Button type="button" onClick={addKeyResult} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Thêm KR
                    </Button>
                  </div>
                  
                  {formData.key_results.map((kr, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-6">
                        <Input
                          placeholder={`Key Result ${index + 1}`}
                          value={kr.title}
                          onChange={(e) => updateKeyResultForm(index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="Mục tiêu"
                          value={kr.target_value}
                          onChange={(e) => updateKeyResultForm(index, 'target_value', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="Đơn vị"
                          value={kr.unit}
                          onChange={(e) => updateKeyResultForm(index, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Tỷ trọng"
                          value={kr.weight}
                          onChange={(e) => updateKeyResultForm(index, 'weight', parseInt(e.target.value) || 100)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateOKR} className="bg-blue-600 hover:bg-blue-700">
                    Tạo OKR
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Company OKRs */}
      <div className="space-y-4">
        {companyOKRs.map((okr) => (
          <Card key={okr.id} className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{okr.title}</CardTitle>
                    {getStatusBadge(okr.status, okr.progress)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{okr.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{typeof okr.cycle === 'object' ? okr.cycle.name : okr.cycle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{okr.key_results.length} Key Results</span>
                    </div>
                    {okr.aligned_okrs && okr.aligned_okrs.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Link2 className="h-4 w-4" />
                        <span>{okr.aligned_okrs.length} OKR liên kết</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{okr.progress}%</div>
                    <Progress value={okr.progress} className="w-24 h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOKR(okr)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleEditOKR(okr)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa OKR</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa OKR "{okr.title}"? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteOKR(okr.id)} className="bg-red-600 hover:bg-red-700">
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Key Results:
                </h4>
                {okr.key_results.map((kr) => (
                  <div key={kr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">{kr.title}</p>
                      <div className="flex items-center space-x-3">
                        <Progress value={kr.progress} className="flex-1 h-2" />
                        <span className="text-sm text-gray-600 min-w-[3rem]">{kr.progress}%</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {kr.current_value.toLocaleString()} / {kr.target_value.toLocaleString()} {kr.unit}
                      </p>
                      {isAdmin && (
                        <Input
                          type="number"
                          className="w-20 h-6 text-xs mt-1"
                          value={kr.current_value}
                          onChange={(e) => handleUpdateProgress(okr.id, kr.id, parseFloat(e.target.value) || 0)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department OKRs Alignment */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">OKRs Phòng Ban</h3>
          <Badge variant="outline" className="ml-2">{departmentOKRs.length} phòng ban tham gia</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentOKRs.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                    <p className="text-xs text-gray-500">{dept.owner}</p>
                  </div>
                  {getStatusBadge(dept.status, dept.progress)}
                </div>
                
                <p className="text-sm text-gray-800 mb-3 font-medium">{dept.okr_title}</p>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Tiến độ</span>
                    <span className="text-sm font-medium text-green-600">{dept.progress}%</span>
                  </div>
                  <Progress value={dept.progress} className="h-2" />
                </div>
                
                <div className="text-xs text-gray-500 p-2 bg-green-50 rounded">
                  <strong>Đóng góp vào:</strong> {dept.contributes_to}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <OKRViewDialog 
        okr={selectedOKR} 
        isOpen={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)} 
      />
      
      <OKREditDialog 
        okr={selectedOKR} 
        isOpen={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
