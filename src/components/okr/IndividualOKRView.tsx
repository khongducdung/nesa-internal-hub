// Individual OKR View - Display and manage individual OKRs
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Plus, Target, TrendingUp, AlertCircle, CheckCircle, Eye, Calendar, MessageCircle, Edit, Trash2 } from 'lucide-react';

import { useMyOKRs, useUpdateKeyResultProgress } from '@/hooks/useOKRSystem';
import { OKRDetailView } from './OKRDetailView';
import { OKRGamificationPanel } from './OKRGamificationPanel';
import { CreateOKRDialog } from './CreateOKRDialog';
import { EditOKRDialog } from './EditOKRDialog';
import { DeleteOKRDialog } from './DeleteOKRDialog';
import { OKRCheckInDialog } from './OKRCheckInDialog';
import { KeyResultProgressDialog } from './KeyResultProgressDialog';
import type { OKRObjective, KeyResult } from '@/types/okr';

export function IndividualOKRView() {
  const { data: myOKRs = [], isLoading } = useMyOKRs();
  const [selectedOKR, setSelectedOKR] = useState<OKRObjective | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingOKR, setEditingOKR] = useState<OKRObjective | null>(null);
  const [deletingOKR, setDeletingOKR] = useState<OKRObjective | null>(null);
  const [checkInOKR, setCheckInOKR] = useState<OKRObjective | null>(null);
  const [editingKeyResult, setEditingKeyResult] = useState<KeyResult | null>(null);

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
            <User className="h-6 w-6" />
            OKRs của tôi
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý các mục tiêu cá nhân của bạn ({myOKRs.length} OKR)
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo OKR cá nhân
        </Button>
      </div>

      {/* Gamification Panel */}
      <OKRGamificationPanel compact />

      {/* Statistics */}
      {myOKRs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">OKRs của tôi</p>
                  <p className="text-2xl font-bold">{myOKRs.length}</p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600">
                    {myOKRs.filter(okr => okr.status === 'completed').length}
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
                    {myOKRs.filter(okr => okr.progress >= 70 && okr.status !== 'completed').length}
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
                    {myOKRs.length > 0 
                      ? Math.round(myOKRs.reduce((sum, okr) => sum + okr.progress, 0) / myOKRs.length)
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
      {myOKRs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Chưa có OKR cá nhân nào
            </h3>
            <p className="text-muted-foreground mb-4">
              Tạo OKR đầu tiên để thiết lập mục tiêu cá nhân và liên kết với mục tiêu phòng ban
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo OKR đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myOKRs.map((okr) => (
            <Card key={okr.id} className="border-l-4 border-l-purple-600 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        <User className="h-3 w-3 mr-1" />
                        Cá nhân
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {okr.quarter} {okr.year}
                      </Badge>
                      {okr.employee?.full_name && (
                        <Badge variant="outline">
                          {okr.employee.full_name}
                        </Badge>
                      )}
                      {okr.parent_okr_id && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Liên kết OKR phòng ban
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mb-2">{okr.title}</CardTitle>
                    <CardDescription>{okr.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCheckInOKR(okr)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Check-in
                    </Button>
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

      <OKRCheckInDialog 
        open={!!checkInOKR} 
        onOpenChange={(open) => !open && setCheckInOKR(null)}
        okr={checkInOKR}
      />

      <KeyResultProgressDialog 
        open={!!editingKeyResult} 
        onOpenChange={(open) => !open && setEditingKeyResult(null)}
        keyResult={editingKeyResult}
      />
    </div>
  );
}