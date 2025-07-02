import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useKPIs, useMyKPIActionPlans } from '@/hooks/useKPI';
import { calculateKPIProgress, getKPIProgressStatus, getPerformanceRatingColor } from '@/types/kpi';

export function KPIDashboard() {
  const { data: kpis = [], isLoading: kpisLoading } = useKPIs();
  const { data: actionPlans = [], isLoading: actionPlansLoading } = useMyKPIActionPlans();

  if (kpisLoading || actionPlansLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24"></CardHeader>
            <CardContent className="h-20"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Tính toán thống kê
  const totalKPIs = kpis.length;
  const activeKPIs = kpis.filter(kpi => kpi.status === 'active').length;
  const completedKPIs = kpis.filter(kpi => kpi.status === 'completed').length;
  
  // Tính điểm trung bình
  const kpisWithProgress = kpis.filter(kpi => kpi.current_target && kpi.latest_measurement);
  const averageProgress = kpisWithProgress.length > 0 
    ? kpisWithProgress.reduce((sum, kpi) => {
        const progress = calculateKPIProgress(
          kpi.latest_measurement?.measured_value || 0,
          kpi.current_target?.target_value || 1
        );
        return sum + progress;
      }, 0) / kpisWithProgress.length
    : 0;

  // Phân loại KPI theo trạng thái hiệu suất
  const excellentKPIs = kpisWithProgress.filter(kpi => {
    const progress = calculateKPIProgress(
      kpi.latest_measurement?.measured_value || 0,
      kpi.current_target?.target_value || 1
    );
    return progress >= 100;
  }).length;

  const onTrackKPIs = kpisWithProgress.filter(kpi => {
    const progress = calculateKPIProgress(
      kpi.latest_measurement?.measured_value || 0,
      kpi.current_target?.target_value || 1
    );
    return progress >= 80 && progress < 100;
  }).length;

  const atRiskKPIs = kpisWithProgress.filter(kpi => {
    const progress = calculateKPIProgress(
      kpi.latest_measurement?.measured_value || 0,
      kpi.current_target?.target_value || 1
    );
    return progress < 80;
  }).length;

  // Action plans statistics
  const pendingActionPlans = actionPlans.filter(plan => plan.status === 'pending').length;
  const inProgressActionPlans = actionPlans.filter(plan => plan.status === 'in_progress').length;
  const overdueActionPlans = actionPlans.filter(plan => 
    plan.due_date && new Date(plan.due_date) < new Date() && plan.status !== 'completed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng KPI</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKPIs}</div>
            <p className="text-xs text-muted-foreground">
              {activeKPIs} đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ trung bình</CardTitle>
            {averageProgress >= 80 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
            <Progress value={averageProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KPI hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{excellentKPIs}</div>
            <p className="text-xs text-muted-foreground">
              Đạt hoặc vượt mục tiêu
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cần chú ý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atRiskKPIs}</div>
            <p className="text-xs text-muted-foreground">
              Dưới 80% mục tiêu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* KPI Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất KPI</CardTitle>
            <CardDescription>Phân loại theo mức độ đạt mục tiêu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm">Xuất sắc (≥100%)</span>
              </div>
              <span className="font-medium">{excellentKPIs}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm">Tốt (80-99%)</span>
              </div>
              <span className="font-medium">{onTrackKPIs}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-sm">Cần cải thiện (&lt;80%)</span>
              </div>
              <span className="font-medium">{atRiskKPIs}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kế hoạch cải tiến</CardTitle>
            <CardDescription>Trạng thái các kế hoạch hành động</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Chờ thực hiện</span>
              </div>
              <Badge variant="secondary">{pendingActionPlans}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm">Đang thực hiện</span>
              </div>
              <Badge>{inProgressActionPlans}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm">Quá hạn</span>
              </div>
              <Badge variant="destructive">{overdueActionPlans}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>KPI nổi bật</CardTitle>
          <CardDescription>Top 5 KPI có hiệu suất cao nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kpisWithProgress
              .sort((a, b) => {
                const progressA = calculateKPIProgress(
                  a.latest_measurement?.measured_value || 0,
                  a.current_target?.target_value || 1
                );
                const progressB = calculateKPIProgress(
                  b.latest_measurement?.measured_value || 0,
                  b.current_target?.target_value || 1
                );
                return progressB - progressA;
              })
              .slice(0, 5)
              .map((kpi) => {
                const progress = calculateKPIProgress(
                  kpi.latest_measurement?.measured_value || 0,
                  kpi.current_target?.target_value || 1
                );
                const status = getKPIProgressStatus(progress);
                
                return (
                  <div key={kpi.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{kpi.name}</h4>
                        <Badge 
                          variant={status === 'excellent' ? 'default' : 'secondary'}
                          style={{ backgroundColor: getPerformanceRatingColor(status) }}
                        >
                          {progress.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {kpi.latest_measurement?.measured_value || 0} / {kpi.current_target?.target_value || 0} {kpi.unit}
                      </p>
                    </div>
                    <div className="w-24">
                      <Progress value={Math.min(progress, 100)} />
                    </div>
                  </div>
                );
              })}
            
            {kpisWithProgress.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có dữ liệu KPI để hiển thị</p>
                <p className="text-sm">Hãy tạo KPI và nhập dữ liệu đo lường</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}