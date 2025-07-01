
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Target, Calendar, TrendingUp, Edit, Plus, X, Users, Zap, CheckCircle, AlertTriangle, Clock, Building2, User, Eye, Trash2, Link2 } from 'lucide-react';
import { useOKRData, OKRObjective } from '@/hooks/useOKRData';
import { useAuth } from '@/hooks/useAuth';
import { OKRViewDialog } from './OKRViewDialog';
import { OKREditDialog } from './OKREditDialog';
import { useToast } from '@/hooks/use-toast';

export function MyOKRTasks() {
  const { myOKRs, companyOKRs, currentCycle, createOKR, updateOKR, deleteOKR, updateKeyResult, loading } = useOKRData();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [createOKROpen, setCreateOKROpen] = useState(false);
  const [updateProgressOpen, setUpdateProgressOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState<OKRObjective | null>(null);
  const [selectedKR, setSelectedKR] = useState<any>(null);

  const getStatusBadge = (status: string, progress: number) => {
    if (status === 'completed') return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Hoàn thành</Badge>;
    if (progress >= 80) return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><TrendingUp className="h-3 w-3" />Vượt tiến độ</Badge>;
    if (progress >= 60) return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Đúng tiến độ</Badge>;
    if (progress >= 40) return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Cần chú ý</Badge>;
    return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><Clock className="h-3 w-3" />Chậm tiến độ</Badge>;
  };

  const handleCreateOKR = async (okrData: Partial<OKRObjective>) => {
    await createOKR({
      ...okrData,
      owner_type: 'individual',
      owner_id: profile?.id,
      department_id: profile?.department_id,
    });

    toast({
      title: "Thành công",
      description: "Đã tạo OKR cá nhân mới",
    });

    setCreateOKROpen(false);
  };

  const handleUpdateProgress = async (newValue: number, notes?: string) => {
    if (!selectedOKR || !selectedKR) return;

    const progress = Math.min(100, Math.round((newValue / selectedKR.target_value) * 100));
    const status = progress >= 100 ? 'completed' : progress >= 70 ? 'on_track' : progress >= 40 ? 'at_risk' : 'not_started';
    
    await updateKeyResult(selectedOKR.id, selectedKR.id, {
      current_value: newValue,
      progress,
      status,
      notes
    });

    toast({
      title: "Cập nhật thành công",
      description: "Tiến độ Key Result đã được cập nhật",
    });

    setUpdateProgressOpen(false);
    setSelectedOKR(null);
    setSelectedKR(null);
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

  // Calculate overall performance metrics
  const totalOKRs = myOKRs.length;
  const completedOKRs = myOKRs.filter(okr => okr.status === 'completed').length;
  const averageProgress = totalOKRs > 0 ? Math.round(myOKRs.reduce((sum, okr) => sum + okr.progress, 0) / totalOKRs) : 0;
  const onTrackOKRs = myOKRs.filter(okr => okr.progress >= 60).length;

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng OKRs</p>
                <p className="text-2xl font-bold text-gray-900">{totalOKRs}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiến độ trung bình</p>
                <p className="text-2xl font-bold text-green-600">{averageProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đúng tiến độ</p>
                <p className="text-2xl font-bold text-blue-600">{onTrackOKRs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-orange-600">{completedOKRs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">OKRs của tôi</h2>
            <p className="text-sm text-gray-500">
              Chu kỳ: {currentCycle?.name} • {myOKRs.length} mục tiêu cá nhân
            </p>
          </div>
        </div>
        
        <Button onClick={() => setCreateOKROpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Tạo OKR
        </Button>
      </div>

      {/* My OKRs */}
      <div className="space-y-6">
        {myOKRs.map((okr) => (
          <Card key={okr.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{okr.title}</CardTitle>
                      {getStatusBadge(okr.status, okr.progress)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{okr.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{okr.cycle}</span>
                      </div>
                      {okr.parent_okr_id && (
                        <div className="flex items-center space-x-1">
                          <Link2 className="h-4 w-4" />
                          <span>Liên kết OKR Công ty</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">{okr.progress}%</div>
                    <Progress value={okr.progress} className="w-20 h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOKR(okr)}>
                      <Eye className="h-4 w-4" />
                    </Button>
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
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 ml-13">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
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
                      <Button
                        size="sm" 
                        variant="outline"
                        className="mt-1 text-xs"
                        onClick={() => {
                          setSelectedOKR(okr);
                          setSelectedKR(kr);
                          setUpdateProgressOpen(true);
                        }}
                      >
                        Cập nhật tiến độ
                      </Button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có OKR nào</h3>
              <p className="text-gray-500 mb-4">
                Bắt đầu tạo OKR cá nhân để theo dõi mục tiêu và phát triển bản thân
              </p>
              <Button onClick={() => setCreateOKROpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Tạo OKR đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Update Progress Dialog */}
      <Dialog open={updateProgressOpen} onOpenChange={setUpdateProgressOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật tiến độ</DialogTitle>
          </DialogHeader>
          {selectedKR && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedKR.title}</p>
                <p className="text-sm text-gray-600">
                  Hiện tại: {selectedKR.current_value.toLocaleString()} / {selectedKR.target_value.toLocaleString()} {selectedKR.unit}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Giá trị mới</Label>
                <Input
                  type="number"
                  placeholder="Nhập giá trị hiện tại"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = parseFloat((e.target as HTMLInputElement).value) || 0;
                      handleUpdateProgress(value);
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setUpdateProgressOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => {
                  const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                  const value = parseFloat(input?.value) || 0;
                  handleUpdateProgress(value);
                }}>
                  Cập nhật
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
      
      {/* Create OKR Dialog using OKREditDialog */}
      <OKREditDialog 
        okr={null} 
        isOpen={createOKROpen} 
        onClose={() => setCreateOKROpen(false)}
        onSave={handleCreateOKR}
      />
    </div>
  );
}
