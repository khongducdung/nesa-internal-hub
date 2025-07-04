
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCompetencyFramework } from '@/hooks/useCompetencyFrameworks';
import { useEmployees } from '@/hooks/useEmployees';
import { formatDateForDisplay } from '@/utils/formatters';

interface CompetencyFrameworkViewDialogProps {
  open: boolean;
  onClose: () => void;
  frameworkId?: string;
  employeeId?: string;
}

export function CompetencyFrameworkViewDialog({ open, onClose, frameworkId, employeeId }: CompetencyFrameworkViewDialogProps) {
  const { data: framework, isLoading } = useCompetencyFramework(frameworkId || '');
  const { data: employees } = useEmployees();
  
  const employee = employees?.find(emp => emp.id === employeeId);

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
          {employee && (
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <Avatar className="h-14 w-14">
                <AvatarImage src={employee.avatar_url || undefined} alt={employee.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium">{employee.full_name}</h4>
                <p className="text-sm text-muted-foreground">Mã NV: {employee.employee_code}</p>
                <p className="text-sm text-muted-foreground">{employee.positions?.name || 'N/A'}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{framework.name}</h3>
              <p className="text-sm text-muted-foreground">Vị trí: {framework.positions?.name || 'N/A'}</p>
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
            <p>Ngày tạo: {formatDateForDisplay(framework.created_at)}</p>
            <p>Cập nhật lần cuối: {formatDateForDisplay(framework.updated_at)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
