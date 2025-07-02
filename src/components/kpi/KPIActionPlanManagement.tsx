import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckCircle, Clock, AlertTriangle, Target, Users } from 'lucide-react';
import { useKPIs, useKPIActionPlans, useMyKPIActionPlans, useUpdateKPIActionPlan } from '@/hooks/useKPI';
import { KPIActionPlanFormDialog } from './KPIActionPlanFormDialog';
import { ACTION_PLAN_PRIORITIES } from '@/types/kpi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export function KPIActionPlanManagement() {
  const [selectedKPI, setSelectedKPI] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'my-plans' | 'kpi-plans'>('my-plans');
  
  const { toast } = useToast();
  const { data: kpis = [] } = useKPIs();
  const { data: myActionPlans = [] } = useMyKPIActionPlans();
  const { data: kpiActionPlans = [] } = useKPIActionPlans(selectedKPI);
  const updateActionPlan = useUpdateKPIActionPlan();

  const displayedPlans = viewMode === 'my-plans' ? myActionPlans : kpiActionPlans;

  const handleStatusChange = async (planId: string, newStatus: string) => {
    try {
      await updateActionPlan.mutateAsync({ id: planId, status: newStatus });
      toast({
        title: 'Thành công',
        description: 'Cập nhật trạng thái kế hoạch thành công',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật trạng thái',
        variant: 'destructive',
      });
    }
  };

  const handleProgressChange = async (planId: string, progress: number) => {
    try {
      await updateActionPlan.mutateAsync({ id: planId, progress_percentage: progress });
      toast({
        title: 'Thành công',
        description: 'Cập nhật tiến độ thành công',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật tiến độ',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    return ACTION_PLAN_PRIORITIES.find(p => p.value === priority)?.color || '#6B7280';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-primary" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'in_progress':
        return 'Đang thực hiện';
      case 'pending':
        return 'Chờ thực hiện';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý kế hoạch cải tiến</h2>
          <p className="text-muted-foreground">Tạo và theo dõi các kế hoạch cải tiến KPI</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo kế hoạch
        </Button>
      </div>

      {/* View Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Chế độ xem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={viewMode === 'my-plans' ? 'default' : 'outline'}
              onClick={() => setViewMode('my-plans')}
            >
              <Users className="h-4 w-4 mr-2" />
              Kế hoạch của tôi
            </Button>
            <Button
              variant={viewMode === 'kpi-plans' ? 'default' : 'outline'}
              onClick={() => setViewMode('kpi-plans')}
            >
              <Target className="h-4 w-4 mr-2" />
              Theo KPI cụ thể
            </Button>
          </div>

          {viewMode === 'kpi-plans' && (
            <div className="mt-4">
              <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Chọn KPI để xem kế hoạch" />
                </SelectTrigger>
                <SelectContent>
                  {kpis.map((kpi) => (
                    <SelectItem key={kpi.id} value={kpi.id}>
                      {kpi.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Plans List */}
      <div className="space-y-4">
        {displayedPlans.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có kế hoạch cải tiến nào</p>
                <p className="text-sm">Nhấn "Tạo kế hoạch" để bắt đầu</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          displayedPlans.map((plan) => (
            <Card key={plan.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{plan.title}</h3>
                      <Badge 
                        style={{ backgroundColor: getPriorityColor(plan.priority) }}
                        className="text-white"
                      >
                        {ACTION_PLAN_PRIORITIES.find(p => p.value === plan.priority)?.label}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{plan.description}</p>
                    {plan.kpis && (
                      <Badge variant="outline" className="mb-2">
                        KPI: {plan.kpis.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(plan.status)}
                    <span className="text-sm font-medium">{getStatusLabel(plan.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Người thực hiện</p>
                    <p className="font-medium">
                      {plan.assigned_to_employee?.full_name || 'Chưa phân công'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày hết hạn</p>
                    <p className="font-medium">
                      {plan.due_date 
                        ? format(new Date(plan.due_date), 'dd/MM/yyyy', { locale: vi })
                        : 'Chưa xác định'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loại kế hoạch</p>
                    <p className="font-medium">
                      {plan.action_type === 'improvement' && 'Cải thiện'}
                      {plan.action_type === 'corrective' && 'Khắc phục'}
                      {plan.action_type === 'preventive' && 'Phòng ngừa'}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ thực hiện</span>
                    <span>{plan.progress_percentage || 0}%</span>
                  </div>
                  <Progress value={plan.progress_percentage || 0} />
                </div>

                {/* Expected Impact */}
                {plan.expected_impact && (
                  <div className="p-3 bg-muted/50 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Tác động dự kiến:</p>
                    <p className="text-sm">{plan.expected_impact}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {plan.status !== 'completed' && (
                    <>
                      <Select
                        value={plan.status}
                        onValueChange={(value) => handleStatusChange(plan.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ thực hiện</SelectItem>
                          <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                        </SelectContent>
                      </Select>

                      {plan.status === 'in_progress' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={plan.progress_percentage || 0}
                            onChange={(e) => handleProgressChange(plan.id, parseInt(e.target.value))}
                            className="w-20"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Action Plan Dialog */}
      <KPIActionPlanFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        kpiId={selectedKPI}
        kpis={kpis}
      />
    </div>
  );
}