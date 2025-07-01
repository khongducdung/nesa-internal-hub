
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Calendar, User, FileText, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { useMyPerformanceAssignments } from '@/hooks/usePerformance';

export function MyKPITasks() {
  const { data: assignments, isLoading } = useMyPerformanceAssignments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải công việc...</div>
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có công việc nào</h3>
          <p className="text-gray-500">
            Hiện tại chưa có KPI nào được giao cho bạn
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'evaluated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return 'Mới giao';
      case 'in_progress': return 'Đang thực hiện';
      case 'submitted': return 'Đã nộp báo cáo';
      case 'evaluated': return 'Đã đánh giá';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Danh sách công việc KPI của tôi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi và báo cáo tiến độ các KPI được giao
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Target className="h-4 w-4" />
          <span>Tổng cộng: {assignments.length} công việc</span>
        </div>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bảng công việc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Công việc</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Chu kỳ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Mục tiêu</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tiến độ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Điểm số</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => {
                  const latestReport = assignment.performance_reports?.[0];
                  const latestEvaluation = assignment.performance_evaluations?.[0];
                  const progressPercent = assignment.kpi_target > 0 && latestReport
                    ? (latestReport.actual_quantity / assignment.kpi_target) * 100
                    : 0;

                  return (
                    <tr key={assignment.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {assignment.work_groups?.name || 'Không có tên'}
                            </div>
                            {assignment.description && (
                              <div className="text-sm text-gray-500 mt-1">
                                {assignment.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{assignment.performance_cycles?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium">{assignment.kpi_target} {assignment.kpi_unit}</div>
                          <div className="text-gray-500">
                            Thực tế: {latestReport?.actual_quantity || 0} {assignment.kpi_unit}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-20">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{Math.min(progressPercent, 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={Math.min(progressPercent, 100)} className="h-2" />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(assignment.status)}>
                          {getStatusLabel(assignment.status)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {latestEvaluation?.final_score ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-600">
                              {latestEvaluation.final_score.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500">điểm</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Chưa đánh giá</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {assignment.status === 'assigned' || assignment.status === 'in_progress' ? (
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-1" />
                              Báo cáo
                            </Button>
                          ) : assignment.status === 'submitted' ? (
                            <div className="flex items-center gap-1 text-sm text-orange-600">
                              <Clock className="h-4 w-4" />
                              Chờ đánh giá
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              Hoàn thành
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Tổng công việc',
            value: assignments.length,
            icon: Target,
            color: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Đang thực hiện',
            value: assignments.filter(a => a.status === 'in_progress' || a.status === 'assigned').length,
            icon: TrendingUp,
            color: 'from-yellow-500 to-yellow-600'
          },
          {
            title: 'Chờ đánh giá',
            value: assignments.filter(a => a.status === 'submitted').length,
            icon: Clock,
            color: 'from-orange-500 to-orange-600'
          },
          {
            title: 'Hoàn thành',
            value: assignments.filter(a => a.status === 'evaluated').length,
            icon: CheckCircle2,
            color: 'from-green-500 to-green-600'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
