
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePerformanceDashboard } from '@/hooks/usePerformance';
import { TrendingUp, Users, Target, Star, BarChart3, AlertCircle } from 'lucide-react';

export function KPIDashboard() {
  const { data: assignments, isLoading, error } = usePerformanceDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dashboard KPI...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Lỗi: {error.message}</div>
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dữ liệu KPI</h3>
          <p className="text-gray-500">
            Chưa có nhân viên nào được phân công KPI hoặc bạn chưa là quản lý
          </p>
        </div>
      </div>
    );
  }

  // Tính toán stats an toàn
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'evaluated').length;
  const pendingAssignments = assignments.filter(a => a.status === 'assigned').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'submitted').length;

  // Tính điểm trung bình
  const evaluatedAssignments = assignments.filter(a => 
    Array.isArray(a.performance_evaluations) && a.performance_evaluations.length > 0
  );
  
  const avgScore = evaluatedAssignments.length > 0 
    ? evaluatedAssignments.reduce((sum, a) => {
        const latestEval = a.performance_evaluations[0];
        return sum + (latestEval?.final_score || 0);
      }, 0) / evaluatedAssignments.length
    : 0;

  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Dashboard KPI</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tổng quan hiệu suất KPI của team
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng KPI</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              KPI đã phân công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Đã đánh giá xong
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ đánh giá</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgressAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Đã nộp báo cáo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {avgScore > 0 ? avgScore.toFixed(1) : '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Từ {evaluatedAssignments.length} đánh giá
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tổng quan tiến độ KPI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tỷ lệ hoàn thành</span>
                <span>{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{pendingAssignments}</div>
                <div className="text-gray-500">Chưa bắt đầu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{inProgressAssignments}</div>
                <div className="text-gray-500">Chờ đánh giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedAssignments}</div>
                <div className="text-gray-500">Hoàn thành</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee KPI List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách nhân viên KPI ({assignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const latestReport = Array.isArray(assignment.performance_reports) && assignment.performance_reports.length > 0 
                ? assignment.performance_reports[0] 
                : null;
              const latestEvaluation = Array.isArray(assignment.performance_evaluations) && assignment.performance_evaluations.length > 0 
                ? assignment.performance_evaluations[0] 
                : null;
              
              const kpiProgress = latestReport && assignment.kpi_target > 0 
                ? (latestReport.actual_quantity / assignment.kpi_target) * 100 
                : 0;

              return (
                <div key={assignment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {assignment.employees?.full_name || 'Chưa có tên'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {assignment.employees?.employee_code || 'N/A'} • {assignment.work_groups?.name || 'N/A'}
                      </p>
                    </div>
                    <Badge variant={
                      assignment.status === 'evaluated' ? 'default' :
                      assignment.status === 'submitted' ? 'secondary' :
                      assignment.status === 'in_progress' ? 'outline' : 'destructive'
                    }>
                      {assignment.status === 'evaluated' ? 'Đã đánh giá' :
                       assignment.status === 'submitted' ? 'Chờ đánh giá' :
                       assignment.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">KPI Target:</span>
                      <div className="font-medium">
                        {assignment.kpi_target} {assignment.kpi_unit || 'đơn vị'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Thực tế:</span>
                      <div className="font-medium">
                        {latestReport?.actual_quantity || 0} {assignment.kpi_unit || 'đơn vị'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Điểm số:</span>
                      <div className="font-medium">
                        {latestEvaluation?.final_score ? `${latestEvaluation.final_score.toFixed(1)} điểm` : 'Chưa đánh giá'}
                      </div>
                    </div>
                  </div>

                  {assignment.kpi_target > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tiến độ KPI</span>
                        <span>{Math.min(kpiProgress, 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(kpiProgress, 100)} className="h-2" />
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Chu kỳ: {assignment.performance_cycles?.name || 'N/A'}</span>
                    <span>Ngày giao: {new Date(assignment.assigned_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
