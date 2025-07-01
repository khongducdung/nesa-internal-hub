
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Star, User, Target, FileText, Plus, Award, TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react';
import { usePerformanceAssignments, useCreatePerformanceEvaluation, usePerformanceCycles } from '@/hooks/usePerformance';
import { useAuth } from '@/hooks/useAuth';
import { formatNumber } from '@/utils/formatters';

export function KPIEvaluationManagement() {
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const { data: assignments, isLoading } = usePerformanceAssignments(selectedCycle);
  const { data: cycles } = usePerformanceCycles();
  const createEvaluation = useCreatePerformanceEvaluation();
  const { profile } = useAuth();
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [formData, setFormData] = useState({
    quantity_score: 0,
    quality_rating: 5,
    comments: ''
  });

  // Filter assignments that need evaluation (submitted status)
  const pendingEvaluations = assignments?.filter(a => a.status === 'submitted') || [];
  const completedEvaluations = assignments?.filter(a => a.status === 'evaluated') || [];
  
  // Statistics
  const totalEvaluations = assignments?.length || 0;
  const completedCount = completedEvaluations.length;
  const pendingCount = pendingEvaluations.length;
  const averageScore = completedEvaluations.length > 0 
    ? completedEvaluations.reduce((sum, eval) => sum + (eval.performance_evaluations?.[0]?.final_score || 0), 0) / completedEvaluations.length
    : 0;

  const handleEvaluate = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowEvaluationForm(true);
    setFormData({
      quantity_score: 0,
      quality_rating: 5,
      comments: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.employee_id || !selectedAssignment) return;

    await createEvaluation.mutateAsync({
      performance_assignment_id: selectedAssignment.id,
      quantity_score: formData.quantity_score,
      quality_rating: formData.quality_rating,
      comments: formData.comments,
      evaluated_by: profile.employee_id
    });

    setShowEvaluationForm(false);
    setSelectedAssignment(null);
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: 'Xuất sắc', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 80) return { label: 'Tốt', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 60) return { label: 'Đạt yêu cầu', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Cần cải thiện', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý đánh giá KPI</h2>
          <p className="text-sm text-gray-600 mt-1">
            Đánh giá hiệu suất KPI của nhân viên và tính toán điểm số cuối cùng
          </p>
        </div>
      </div>

      {/* Evaluation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                <p className="text-3xl font-bold text-gray-900">{totalEvaluations}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ đánh giá</p>
                <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Điểm trung bình</p>
                <p className="text-3xl font-bold text-purple-600">{formatNumber(averageScore)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cycle Filter */}
      <div className="flex items-center gap-4">
        <Label htmlFor="cycle-filter">Lọc theo chu kỳ:</Label>
        <Select value={selectedCycle} onValueChange={setSelectedCycle}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Tất cả chu kỳ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả chu kỳ</SelectItem>
            {cycles?.map((cycle) => (
              <SelectItem key={cycle.id} value={cycle.id}>
                {cycle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pending Evaluations */}
      {pendingEvaluations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              Đánh giá chờ xử lý ({pendingEvaluations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingEvaluations.map((assignment) => (
                <Card key={assignment.id} className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {assignment.employees?.full_name?.charAt(0) || 'N'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {assignment.employees?.full_name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {assignment.employees?.employee_code}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nhóm:</span>
                          <span className="font-medium">{assignment.work_groups?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Mục tiêu:</span>
                          <span className="font-medium">
                            {formatNumber(assignment.kpi_target)} {assignment.kpi_unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Chu kỳ:</span>
                          <span className="font-medium">{assignment.performance_cycles?.name}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleEvaluate(assignment)}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        size="sm"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Đánh giá ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Tất cả KPI và đánh giá
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="font-medium text-gray-700">Nhân viên</TableHead>
                  <TableHead className="font-medium text-gray-700">KPI</TableHead>
                  <TableHead className="font-medium text-gray-700">Mục tiêu</TableHead>
                  <TableHead className="font-medium text-gray-700">Thực hiện</TableHead>
                  <TableHead className="font-medium text-gray-700">Điểm số</TableHead>
                  <TableHead className="font-medium text-gray-700">Xếp loại</TableHead>
                  <TableHead className="font-medium text-gray-700">Trạng thái</TableHead>
                  <TableHead className="font-medium text-gray-700">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments?.map((assignment) => {
                  const evaluation = assignment.performance_evaluations?.[0];
                  const report = assignment.performance_reports?.[0];
                  const completionRate = report && assignment.kpi_target > 0 
                    ? (report.actual_quantity / assignment.kpi_target) * 100 
                    : 0;
                  const performanceLevel = evaluation?.final_score 
                    ? getPerformanceLevel(evaluation.final_score)
                    : null;

                  return (
                    <TableRow key={assignment.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {assignment.employees?.full_name?.charAt(0) || 'N'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {assignment.employees?.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assignment.employees?.employee_code}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {assignment.work_groups?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignment.performance_cycles?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {formatNumber(assignment.kpi_target)} {assignment.kpi_unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        {report ? (
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatNumber(report.actual_quantity)} {assignment.kpi_unit}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={Math.min(completionRate, 100)} className="flex-1 h-2" />
                              <span className="text-sm text-gray-600 min-w-[3rem]">
                                {formatNumber(completionRate)}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Chưa báo cáo</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {evaluation ? (
                          <div className="text-center">
                            <div className="font-bold text-lg text-gray-900">
                              {formatNumber(evaluation.final_score)}
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              {[...Array(Math.floor(evaluation.quality_rating))].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Chưa đánh giá</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {performanceLevel ? (
                          <Badge className={`${performanceLevel.bgColor} ${performanceLevel.color} border-0`}>
                            {performanceLevel.label}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Chưa xếp loại</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          assignment.status === 'evaluated' ? 'default' :
                          assignment.status === 'submitted' ? 'secondary' :
                          assignment.status === 'in_progress' ? 'outline' : 'destructive'
                        }>
                          {assignment.status === 'evaluated' ? 'Đã đánh giá' :
                           assignment.status === 'submitted' ? 'Chờ đánh giá' :
                           assignment.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {assignment.status === 'submitted' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEvaluate(assignment)}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Đánh giá
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Dialog */}
      <Dialog open={showEvaluationForm} onOpenChange={setShowEvaluationForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Đánh giá KPI - {selectedAssignment?.employees?.full_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Assignment Info */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h4 className="font-semibold text-gray-900">Thông tin KPI</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Nhân viên:</span>
                    <div className="font-medium text-gray-900">{selectedAssignment?.employees?.full_name}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Nhóm công việc:</span>
                    <div className="font-medium text-gray-900">{selectedAssignment?.work_groups?.name}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Chu kỳ:</span>
                    <div className="font-medium text-gray-900">{selectedAssignment?.performance_cycles?.name}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">KPI mục tiêu:</span>
                    <div className="font-medium text-gray-900">
                      {formatNumber(selectedAssignment?.kpi_target || 0)} {selectedAssignment?.kpi_unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tỷ lệ lương:</span>
                    <div className="font-medium text-gray-900">{selectedAssignment?.salary_percentage}%</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Kết quả thực hiện:</span>
                    <div className="font-medium text-gray-900">
                      {formatNumber(selectedAssignment?.performance_reports?.[0]?.actual_quantity || 0)} {selectedAssignment?.kpi_unit}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Form */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="quantity_score">Điểm khối lượng (% hoàn thành KPI) *</Label>
                <Input
                  id="quantity_score"
                  type="number"
                  min="0"
                  max="200"
                  step="0.1"
                  value={formData.quantity_score}
                  onChange={(e) => setFormData({...formData, quantity_score: parseFloat(e.target.value) || 0})}
                  placeholder="VD: 95.5 (nghĩa là hoàn thành 95.5% KPI)"
                  required
                />
                <p className="text-sm text-gray-500">
                  Nhập % hoàn thành so với KPI đề ra (có thể {'>'}100% nếu vượt mục tiêu)
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="quality_rating">Điểm chất lượng (1-10 sao) *</Label>
                <Select value={formData.quality_rating.toString()} onValueChange={(value) => setFormData({...formData, quality_rating: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span>{rating} sao ({rating * 10}%)</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(formData.quality_rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {[...Array(10 - formData.quality_rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({formData.quality_rating * 10}%)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="comments">Nhận xét và góp ý</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  placeholder="Nhận xét về chất lượng công việc, điểm mạnh, điểm cần cải thiện..."
                  rows={4}
                />
              </div>

              {/* Preview final score */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-4">Xem trước kết quả đánh giá</h5>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <span className="text-sm text-blue-700">Điểm khối lượng</span>
                    <div className="text-2xl font-bold text-blue-900">{formData.quantity_score}%</div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-blue-700">Điểm chất lượng</span>
                    <div className="text-2xl font-bold text-blue-900">{formData.quality_rating * 10}%</div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-blue-700">Điểm cuối cùng</span>
                    <div className="text-3xl font-bold text-blue-900">
                      {formatNumber((formData.quantity_score + (formData.quality_rating * 10)) / 2)}%
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  {(() => {
                    const finalScore = (formData.quantity_score + (formData.quality_rating * 10)) / 2;
                    const level = getPerformanceLevel(finalScore);
                    return (
                      <Badge className={`${level.bgColor} ${level.color} border-0 text-lg px-4 py-2`}>
                        {level.label}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={() => setShowEvaluationForm(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={createEvaluation.isPending} className="bg-blue-600 hover:bg-blue-700">
                {createEvaluation.isPending ? 'Đang lưu...' : 'Hoàn thành đánh giá'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
