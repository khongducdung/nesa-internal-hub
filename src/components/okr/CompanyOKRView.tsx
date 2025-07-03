// Company OKR View - Display and manage company-level OKRs
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Target, 
  TrendingUp, 
  Users, 
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';

import { useCompanyOKRs } from '@/hooks/useOKRSystem';
import { CreateOKRDialog } from './CreateOKRDialog';
import { EditOKRDialog } from './EditOKRDialog';
import { DeleteOKRDialog } from './DeleteOKRDialog';
import { OKRDetailView } from './OKRDetailView';
import type { OKRObjective } from '@/types/okr';

export function CompanyOKRView() {
  const { data: companyOKRs = [], isLoading } = useCompanyOKRs();
  const [selectedOKR, setSelectedOKR] = useState<OKRObjective | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingOKR, setEditingOKR] = useState<OKRObjective | null>(null);
  const [deletingOKR, setDeletingOKR] = useState<OKRObjective | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedOKR) {
    return <OKRDetailView okr={selectedOKR} onClose={() => setSelectedOKR(null)} />;
  }

  const getStatusBadge = (status: string, progress: number) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
    }
    if (progress >= 70) {
      return <Badge className="bg-blue-100 text-blue-800">Đúng tiến độ</Badge>;
    }
    if (progress >= 30) {
      return <Badge className="bg-yellow-100 text-yellow-800">Có rủi ro</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Chậm tiến độ</Badge>;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            OKRs Công ty
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi các mục tiêu cấp công ty
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo OKR Công ty
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng số OKR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyOKRs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {companyOKRs.filter(okr => okr.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Đúng tiến độ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {companyOKRs.filter(okr => okr.progress >= 70 && okr.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cần chú ý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {companyOKRs.filter(okr => okr.progress < 70 && okr.status === 'active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OKRs List */}
      {companyOKRs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có OKR công ty nào
            </h3>
            <p className="text-gray-600 mb-4">
              Tạo OKR đầu tiên để thiết lập mục tiêu cấp công ty
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo OKR đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {companyOKRs.map((okr) => (
            <Card key={okr.id} className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{okr.title}</CardTitle>
                    {getStatusBadge(okr.status, okr.progress)}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOKR(okr)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingOKR(okr)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeletingOKR(okr)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm text-gray-600">
                  {okr.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tiến độ tổng thể</span>
                    <span className="text-2xl font-bold text-blue-600">{okr.progress}%</span>
                  </div>
                  <Progress value={okr.progress} className="h-2" />
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{okr.key_results?.length || 0} Key Results</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{(okr as any).child_okrs_count || 0} OKR liên kết</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Hoàn thành: {new Date(okr.end_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  {/* Key Results */}
                  {okr.key_results && okr.key_results.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Key Results:</h4>
                      {okr.key_results.map((kr, index) => (
                        <div key={kr.id} className="border rounded p-3 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{kr.title}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                kr.status === 'completed' ? 'bg-green-100 text-green-800' :
                                kr.status === 'on_track' ? 'bg-blue-100 text-blue-800' :
                                kr.status === 'at_risk' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {kr.status === 'completed' ? 'Hoàn thành' :
                               kr.status === 'on_track' ? 'Đúng tiến độ' :
                               kr.status === 'at_risk' ? 'Có rủi ro' : 'Chưa bắt đầu'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span>{kr.current_value.toLocaleString()} / {kr.target_value.toLocaleString()} {kr.unit}</span>
                            <Progress value={kr.progress} className="flex-1 h-1" />
                            <span className="font-medium">{kr.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Aligned OKRs Preview */}
                  {((okr as any).child_okrs_count || 0) > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          OKRs liên kết ({(okr as any).child_okrs_count || 0})
                        </span>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Xem tất cả
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Các OKR phòng ban và cá nhân đang liên kết với mục tiêu này
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateOKRDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
      
      <EditOKRDialog 
        open={!!editingOKR} 
        onOpenChange={(open) => !open && setEditingOKR(null)}
        okr={editingOKR}
      />
      
      <DeleteOKRDialog 
        open={!!deletingOKR} 
        onOpenChange={(open) => !open && setDeletingOKR(null)}
        okr={deletingOKR}
      />
    </div>
  );
}