
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePerformanceDashboard } from '@/hooks/usePerformance';
import { TrendingUp, Users, Target, Star, Calendar, AlertCircle } from 'lucide-react';

export function PerformanceDashboard() {
  const { data: assignments, isLoading } = usePerformanceDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  const stats = React.useMemo(() => {
    if (!assignments) return null;

    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.status === 'evaluated').length;
    const pendingAssignments = assignments.filter(a => a.status === 'assigned').length;
    const inProgressAssignments = assignments.filter(a => a.status === 'in_progress' || a.status === 'submitted').length;

    const evaluatedAssignments = assignments.filter(a => 
      a.performance_evaluations && a.performance_evaluations.length > 0
    );
    
    const avgScore = evaluatedAssignments.length > 0 
      ? evaluatedAssignments.reduce((sum, a) => {
          const latestEval = a.performance_evaluations?.[0];
          return sum + (latestEval?.final_score || 0);
        }, 0) / evaluatedAssignments.length
      : 0;

    return {
      totalAssignments,
      completedAssignments,
      pendingAssignments,
      inProgressAssignments,
      avgScore,
      completionRate: totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0
    };
  }, [assignments]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng phân công</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssignments || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.completedAssignments || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang thực hiện</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.inProgressAssignments || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.avgScore ? stats.avgScore.toFixed(1) : '0.0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tổng quan tiến độ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tỷ lệ hoàn thành</span>
                <span>{stats?.completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats?.completionRate || 0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Performance List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách nhân viên được quản lý
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments?.map((assignment) => {
              const latestReport = assignment.performance_reports?.[0];
              const latestEvaluation = assignment.performance_evaluations?.[0];
              const kpiProgress = latestReport && assignment.kpi_target > 0 
                ? (latestReport.actual_quantity / assignment.kpi_target) * 100 
                : 0;

              return (
                <div key={assignment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {assignment.employees?.full_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {assignment.employees?.employee_code} • {assignment.work_groups?.name}
                      </p>
                    </div>
                    <Badge variant={
                      assignment.status === 'evaluated' ? 'default' :
                      assignment.status === 'submitted' ? 'secondary' :
                      assignment.status === 'in_progress' ? 'outline' : 'destructive'
                    }>
                      {assignment.status === 'evaluated' ? 'Đã đánh giá' :
                       assignment.status === 'submitted' ? 'Đã nộp báo cáo' :
                       assignment.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">KPI Target:</span>
                      <div className="font-medium">
                        {assignment.kpi_target} {assignment.kpi_unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Thực tế:</span>
                      <div className="font-medium">
                        {latestReport?.actual_quantity || 0} {assignment.kpi_unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Điểm số:</span>
                      <div className="font-medium">
                        {latestEvaluation?.final_score?.toFixed(1) || 'Chưa đánh giá'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tiến độ KPI</span>
                      <span>{kpiProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(kpiProgress, 100)} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Chu kỳ: {assignment.performance_cycles?.name}</span>
                    <span>Tỷ lệ lương: {assignment.salary_percentage}%</span>
                  </div>
                </div>
              );
            })}

            {!assignments?.length && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Chưa có nhân viên nào được phân công công việc</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
