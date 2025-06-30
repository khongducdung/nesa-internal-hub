
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompetencyFramework } from '@/hooks/useCompetencyFrameworks';

interface CompetencyFrameworkViewDialogProps {
  open: boolean;
  onClose: () => void;
  frameworkId?: string;
}

export function CompetencyFrameworkViewDialog({ open, onClose, frameworkId }: CompetencyFrameworkViewDialogProps) {
  const { data: framework, isLoading } = useCompetencyFramework(frameworkId || '');

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <Badge variant="secondary">Cơ bản</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>;
      case 'advanced':
        return <Badge className="bg-orange-100 text-orange-800">Cao</Badge>;
      case 'expert':
        return <Badge className="bg-red-100 text-red-800">Chuyên gia</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Ngưng hoạt động</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Nháp</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">Đang tải...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!framework) {
    return null;
  }

  const competencies = framework.competencies as any[] || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết khung năng lực</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{framework.name}</h3>
              <p className="text-sm text-gray-600">Vị trí: {framework.positions?.name || 'N/A'}</p>
            </div>
            <div className="flex justify-end">
              {getStatusBadge(framework.status || 'active')}
            </div>
          </div>

          {framework.description && (
            <div>
              <h4 className="font-medium mb-2">Mô tả</h4>
              <p className="text-gray-700">{framework.description}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Năng lực yêu cầu ({competencies.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {competencies.map((competency, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{competency.name}</h5>
                    <div className="flex gap-2">
                      {getLevelBadge(competency.level)}
                      <Badge variant="outline">Trọng số: {competency.weight}</Badge>
                    </div>
                  </div>
                  {competency.description && (
                    <p className="text-sm text-gray-600">{competency.description}</p>
                  )}
                </Card>
              ))}
              
              {competencies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Chưa có năng lực nào được định nghĩa.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-sm text-gray-500">
            <p>Ngày tạo: {new Date(framework.created_at).toLocaleDateString('vi-VN')}</p>
            <p>Cập nhật lần cuối: {new Date(framework.updated_at).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
