
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, TrendingUp, Users, Building2, Eye, Edit, Trash2 } from 'lucide-react';
import { useOKRData } from '@/hooks/useOKRData';
import { OKREditDialog } from './OKREditDialog';
import { OKRViewDialog } from './OKRViewDialog';
import type { OKRObjective } from '@/hooks/useOKRData';

export function OKRManagement() {
  const { 
    companyOKRs, 
    myOKRs, 
    departmentOKRs, 
    loading, 
    createOKR, 
    updateOKR, 
    deleteOKR,
    currentCycle 
  } = useOKRData();

  const [selectedOKR, setSelectedOKR] = useState<OKRObjective | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-okrs');

  const handleCreateOKR = () => {
    setSelectedOKR(null);
    setIsEditDialogOpen(true);
  };

  const handleEditOKR = (okr: OKRObjective) => {
    setSelectedOKR(okr);
    setIsEditDialogOpen(true);
  };

  const handleViewOKR = (okr: OKRObjective) => {
    setSelectedOKR(okr);
    setIsViewDialogOpen(true);
  };

  const handleSaveOKR = async (okrData: Partial<OKRObjective>) => {
    console.log('Saving OKR:', okrData);
    if (selectedOKR) {
      await updateOKR(selectedOKR.id, okrData);
    } else {
      await createOKR({
        ...okrData,
        owner_type: 'individual'
      });
    }
  };

  const handleDeleteOKR = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa OKR này?')) {
      await deleteOKR(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'active': return 'Đang hoạt động';
      case 'draft': return 'Nháp';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const renderOKRCard = (okr: OKRObjective) => (
    <Card key={okr.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-600" />
              <Badge variant="outline" className={getStatusColor(okr.status)}>
                {getStatusText(okr.status)}
              </Badge>
            </div>
            <CardTitle className="text-lg">{okr.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{okr.description}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewOKR(okr)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditOKR(okr)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteOKR(okr.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Tiến độ</span>
              <span className="font-medium">{okr.progress}%</span>
            </div>
            <Progress value={okr.progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{okr.key_results.length} Key Results</span>
            <span>{okr.cycle}</span>
          </div>

          {okr.parent_okr_id && (
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">
                Liên kết với OKR cấp cao
              </p>
            </div>
          )}

          {okr.aligned_okrs && okr.aligned_okrs.length > 0 && (
            <div className="p-2 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 font-medium">
                Có {okr.aligned_okrs.length} OKR liên kết
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý OKR</h2>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý các mục tiêu chính của bạn
          </p>
        </div>
        <Button onClick={handleCreateOKR} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tạo OKR mới
        </Button>
      </div>

      {currentCycle && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                Chu kỳ hiện tại: {currentCycle.name}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-okrs" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            OKR của tôi ({myOKRs.length})
          </TabsTrigger>
          <TabsTrigger value="department-okrs" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            OKR Phòng ban ({departmentOKRs.length})
          </TabsTrigger>
          <TabsTrigger value="company-okrs" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            OKR Công ty ({companyOKRs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-okrs" className="space-y-4">
          {myOKRs.length === 0 ? (
            <Card className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có OKR nào
              </h3>
              <p className="text-gray-600 mb-4">
                Hãy tạo OKR đầu tiên để bắt đầu theo dõi mục tiêu của bạn
              </p>
              <Button onClick={handleCreateOKR}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo OKR đầu tiên
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myOKRs.map(renderOKRCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="department-okrs" className="space-y-4">
          {departmentOKRs.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có OKR phòng ban nào
              </h3>
              <p className="text-gray-600">
                Các OKR phòng ban sẽ hiển thị ở đây
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentOKRs.map(renderOKRCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="company-okrs" className="space-y-4">
          {companyOKRs.length === 0 ? (
            <Card className="p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có OKR công ty nào
              </h3>
              <p className="text-gray-600">
                Các OKR công ty sẽ hiển thị ở đây
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companyOKRs.map(renderOKRCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <OKREditDialog
        okr={selectedOKR}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveOKR}
      />

      <OKRViewDialog
        okr={selectedOKR}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </div>
  );
}
