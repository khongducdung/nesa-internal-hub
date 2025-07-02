
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Calendar, 
  Users, 
  Building2, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Link2
} from 'lucide-react';
import { OKRObjective, useOKRData } from '@/hooks/useOKRData';

interface OKRViewDialogProps {
  okr: OKRObjective | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OKRViewDialog({ okr, open, onOpenChange }: OKRViewDialogProps) {
  const { getParentOKR } = useOKRData();

  if (!okr) return null;

  const parentOKR = getParentOKR(okr);

  const getStatusBadge = (status: string, progress: number) => {
    if (status === 'completed') return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Hoàn thành</Badge>;
    if (progress >= 80) return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><TrendingUp className="h-3 w-3" />Vượt tiến độ</Badge>;
    if (progress >= 60) return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Đúng tiến độ</Badge>;
    if (progress >= 40) return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Cần chú ý</Badge>;
    return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><Clock className="h-3 w-3" />Chậm tiến độ</Badge>;
  };

  const getOwnerTypeIcon = (ownerType: string) => {
    switch (ownerType) {
      case 'company': return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'department': return <Users className="h-4 w-4 text-green-600" />;
      default: return <Target className="h-4 w-4 text-purple-600" />;
    }
  };

  const getOwnerTypeText = (ownerType: string) => {
    switch (ownerType) {
      case 'company': return 'OKR Công ty';
      case 'department': return 'OKR Phòng ban';
      default: return 'OKR Cá nhân';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getOwnerTypeIcon(okr.owner_type)}
            <div className="flex-1">
              <DialogTitle className="text-xl">{okr.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{getOwnerTypeText(okr.owner_type)}</span>
                {getStatusBadge(okr.status, okr.progress)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-1">{okr.progress}%</div>
              <Progress value={okr.progress} className="w-24 h-2" />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Thông tin cơ bản
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">{okr.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{typeof okr.cycle === 'object' ? okr.cycle.name : okr.cycle}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{okr.key_results?.length || 0} Key Results</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Results */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Key Results ({okr.key_results?.length || 0})
              </h3>
              <div className="space-y-3">
                {okr.key_results?.map((kr, index) => (
                  <div key={kr.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{kr.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <span>Trọng số: {kr.weight}%</span>
                          {kr.due_date && (
                            <>
                              <span>•</span>
                              <span>Hạn: {new Date(kr.due_date).toLocaleDateString('vi-VN')}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {kr.current_value.toLocaleString()} / {kr.target_value.toLocaleString()} {kr.unit}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 ${
                            kr.status === 'completed' ? 'bg-green-100 text-green-800' :
                            kr.status === 'on_track' ? 'bg-blue-100 text-blue-800' :
                            kr.status === 'at_risk' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {kr.status === 'completed' ? 'Hoàn thành' :
                           kr.status === 'on_track' ? 'Đúng hướng' :
                           kr.status === 'at_risk' ? 'Có rủi ro' :
                           'Chưa bắt đầu'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={kr.progress} className="flex-1 h-2" />
                      <span className="text-sm font-medium text-gray-700 min-w-[3rem]">{kr.progress}%</span>
                    </div>
                    {kr.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{kr.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alignment Information */}
          {(parentOKR || (okr.aligned_okrs && okr.aligned_okrs.length > 0)) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-purple-600" />
                  Liên kết OKR
                </h3>
                
                {parentOKR && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Liên kết tới OKR cấp cao:</p>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getOwnerTypeIcon(parentOKR.owner_type)}
                          <span className="font-medium text-blue-800">{parentOKR.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-700">{parentOKR.progress}%</span>
                          <Progress value={parentOKR.progress} className="w-16 h-1" />
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">{getOwnerTypeText(parentOKR.owner_type)}</p>
                    </div>
                  </div>
                )}

                {okr.aligned_okrs && okr.aligned_okrs.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      OKR liên kết ({okr.aligned_okrs.length}):
                    </p>
                    <div className="space-y-2">
                      {okr.aligned_okrs.map((alignedOKR) => (
                        <div key={alignedOKR.id} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getOwnerTypeIcon(alignedOKR.owner_type)}
                              <span className="font-medium text-green-800">{alignedOKR.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-green-700">{alignedOKR.progress}%</span>
                              <Progress value={alignedOKR.progress} className="w-16 h-1" />
                            </div>
                          </div>
                          <p className="text-xs text-green-600 mt-1">{getOwnerTypeText(alignedOKR.owner_type)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                Thời gian
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Ngày tạo:</p>
                  <p className="font-medium">{new Date(okr.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Cập nhật cuối:</p>
                  <p className="font-medium">{new Date(okr.updated_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
