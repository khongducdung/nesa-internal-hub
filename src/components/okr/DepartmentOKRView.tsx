// Department OKR View - Display and manage department-level OKRs
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Target, TrendingUp, AlertCircle, CheckCircle, Eye, Calendar, Edit, Trash2 } from 'lucide-react';

import { useDepartmentOKRs } from '@/hooks/useOKRSystem';
import { OKRDetailView } from './OKRDetailView';
import { CreateOKRDialog } from './CreateOKRDialog';
import { EditOKRDialog } from './EditOKRDialog';
import { DeleteOKRDialog } from './DeleteOKRDialog';
import type { OKRObjective } from '@/types/okr';

export function DepartmentOKRView() {
  const { data: departmentOKRs = [], isLoading } = useDepartmentOKRs();
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

  const getStatusColor = (progress: number, status: string) => {
    if (status === 'completed') return 'text-green-600';
    if (progress >= 70) return 'text-blue-600';
    if (progress >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (progress: number, status: string) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4" />;
    if (progress >= 70) return <TrendingUp className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            OKRs Phòng ban
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý các mục tiêu cấp phòng ban ({departmentOKRs.length} OKR)
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo OKR Phòng ban
        </Button>
      </div>

      {/* Statistics */}
      {departmentOKRs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng số OKR</p>
                  <p className="text-2xl font-bold">{departmentOKRs.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600">
                    {departmentOKRs.filter(okr => okr.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đúng tiến độ</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {departmentOKRs.filter(okr => okr.progress >= 70 && okr.status !== 'completed').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tiến độ TB</p>
                  <p className="text-2xl font-bold">
                    {departmentOKRs.length > 0 
                      ? Math.round(departmentOKRs.reduce((sum, okr) => sum + okr.progress, 0) / departmentOKRs.length)
                      : 0}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content */}
      {departmentOKRs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Chưa có OKR phòng ban nào
            </h3>
            <p className="text-muted-foreground mb-4">
              Tạo OKR đầu tiên cho phòng ban của bạn để liên kết với mục tiêu công ty
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo OKR đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {departmentOKRs.map((okr) => (
            <Card key={okr.id} className="border-l-4 border-l-green-600 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Users className="h-3 w-3 mr-1" />
                        Phòng ban
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {okr.quarter} {okr.year}
                      </Badge>
                      {okr.department?.name && (
                        <Badge variant="outline">
                          {okr.department.name}
                        </Badge>
                      )}
                      {okr.parent_okr_id && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Liên kết OKR công ty
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mb-2">{okr.title}</CardTitle>
                    <CardDescription>{okr.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOKR(okr)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Chi tiết
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingOKR(okr)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeletingOKR(okr)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(okr.progress, okr.status)}
                        <span className={`font-medium ${getStatusColor(okr.progress, okr.status)}`}>
                          {okr.progress}% hoàn thành
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {okr.key_results?.length || 0} Key Results
                      </span>
                    </div>
                    <Progress value={okr.progress} className="h-2" />
                  </div>

                  {/* Key Results Summary */}
                  {okr.key_results && okr.key_results.length > 0 && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{okr.key_results.filter(kr => kr.status === 'completed').length} hoàn thành</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>{okr.key_results.filter(kr => kr.status === 'on_track').length} đúng tiến độ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span>{okr.key_results.filter(kr => kr.status === 'at_risk').length} có rủi ro</span>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Bắt đầu: {new Date(okr.start_date).toLocaleDateString('vi-VN')}</span>
                    <span>Kết thúc: {new Date(okr.end_date).toLocaleDateString('vi-VN')}</span>
                    <span className={okr.time_to_deadline && okr.time_to_deadline < 30 ? 'text-orange-600 font-medium' : ''}>
                      Còn {okr.time_to_deadline || 0} ngày
                    </span>
                  </div>
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