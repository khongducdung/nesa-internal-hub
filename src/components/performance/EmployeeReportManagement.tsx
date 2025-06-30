
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Send, Target, Calendar, User } from 'lucide-react';
import { useMyPerformanceAssignments, useCreatePerformanceReport } from '@/hooks/usePerformance';

export function EmployeeReportManagement() {
  const { data: assignments, isLoading } = useMyPerformanceAssignments();
  const createReport = useCreatePerformanceReport();
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [formData, setFormData] = useState({
    actual_quantity: 0,
    report_content: ''
  });

  const handleSubmitReport = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowReportForm(true);
    setFormData({
      actual_quantity: 0,
      report_content: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment) return;

    await createReport.mutateAsync({
      performance_assignment_id: selectedAssignment.id,
      actual_quantity: formData.actual_quantity,
      report_content: formData.report_content,
      attachments: []
    });

    setShowReportForm(false);
    setSelectedAssignment(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  // Lọc các assignment có thể báo cáo (assigned hoặc in_progress)
  const reportableAssignments = assignments?.filter(a => 
    a.status === 'assigned' || a.status === 'in_progress'
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Báo cáo công việc của tôi</h2>
        <p className="text-sm text-gray-500 mt-1">
          Báo cáo tiến độ và kết quả công việc được giao
        </p>
      </div>

      {/* My Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportableAssignments.map((assignment) => {
          const latestReport = assignment.performance_reports?.[0];
          const progressPercent = assignment.kpi_target > 0 && latestReport
            ? (latestReport.actual_quantity / assignment.kpi_target) * 100
            : 0;

          return (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">{assignment.work_groups?.name}</CardTitle>
                </div>
                <Badge variant={
                  assignment.status === 'in_progress' ? 'secondary' : 'outline'
                }>
                  {assignment.status === 'in_progress' ? 'Đang thực hiện' : 'Mới giao'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">KPI mục tiêu:</span>
                    <span className="font-medium">{assignment.kpi_target} {assignment.kpi_unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Đã hoàn thành:</span>
                    <span className="font-medium">
                      {latestReport?.actual_quantity || 0} {assignment.kpi_unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Chu kỳ:</span>
                    <span className="font-medium">{assignment.performance_cycles?.name}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tiến độ</span>
                    <span>{Math.min(progressPercent, 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(progressPercent, 100)} className="h-2" />
                </div>

                {assignment.description && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Mô tả:</p>
                    <p>{assignment.description}</p>
                  </div>
                )}

                <Button 
                  onClick={() => handleSubmitReport(assignment)}
                  className="w-full"
                  variant={assignment.status === 'in_progress' ? 'default' : 'outline'}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {assignment.status === 'in_progress' ? 'Cập nhật báo cáo' : 'Bắt đầu công việc'}
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {reportableAssignments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có công việc nào</h3>
            <p className="text-gray-500">
              Chưa có công việc nào được giao hoặc tất cả đã hoàn thành
            </p>
          </div>
        )}
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Báo cáo công việc - {selectedAssignment?.work_groups?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Assignment Info */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-gray-900">Thông tin công việc</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">KPI mục tiêu:</span>
                  <div className="font-medium">
                    {selectedAssignment?.kpi_target} {selectedAssignment?.kpi_unit}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Chu kỳ:</span>
                  <div className="font-medium">{selectedAssignment?.performance_cycles?.name}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Mô tả:</span>
                  <div className="font-medium">{selectedAssignment?.description || 'Không có'}</div>
                </div>
              </div>
            </div>

            {/* Report Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actual_quantity">
                  Số lượng thực tế hoàn thành ({selectedAssignment?.kpi_unit}) *
                </Label>
                <Input
                  id="actual_quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.actual_quantity}
                  onChange={(e) => setFormData({...formData, actual_quantity: parseFloat(e.target.value) || 0})}
                  placeholder="Nhập số lượng đã hoàn thành"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report_content">Báo cáo chi tiết *</Label>
                <Textarea
                  id="report_content"
                  value={formData.report_content}
                  onChange={(e) => setFormData({...formData, report_content: e.target.value})}
                  placeholder="Mô tả chi tiết về công việc đã thực hiện, khó khăn gặp phải, kết quả đạt được..."
                  rows={5}
                  required
                />
              </div>

              {/* Progress Preview */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Xem trước tiến độ</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ hoàn thành:</span>
                    <span className="font-medium">
                      {selectedAssignment?.kpi_target > 0 
                        ? ((formData.actual_quantity / selectedAssignment.kpi_target) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={selectedAssignment?.kpi_target > 0 
                      ? Math.min((formData.actual_quantity / selectedAssignment.kpi_target) * 100, 100)
                      : 0
                    } 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowReportForm(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={createReport.isPending}>
                {createReport.isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
