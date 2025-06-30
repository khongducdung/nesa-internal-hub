
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
import { Star, User, Target, FileText, Plus } from 'lucide-react';
import { usePerformanceAssignments, useCreatePerformanceEvaluation, usePerformanceCycles } from '@/hooks/usePerformance';
import { useAuth } from '@/hooks/useAuth';

export function PerformanceEvaluationManagement() {
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const { data: assignments, isLoading } = usePerformanceAssignments(selectedCycle);
  const { data: cycles } = usePerformanceCycles();
  const createEvaluation = useCreatePerformanceEvaluation();
  const { profile } = useAuth();
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [formData, setFormData] = useState({
    quantity_score: 0,
    quality_rating: 1,
    comments: ''
  });

  // Filter assignments that need evaluation (submitted status)
  const pendingEvaluations = assignments?.filter(a => a.status === 'submitted') || [];

  const handleEvaluate = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowEvaluationForm(true);
    setFormData({
      quantity_score: 0,
      quality_rating: 1,
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
          <h2 className="text-lg font-semibold text-gray-900">Quản lý đánh giá hiệu suất</h2>
          <p className="text-sm text-gray-500 mt-1">
            Đánh giá hiệu suất làm việc của nhân viên sau khi họ nộp báo cáo
          </p>
        </div>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Đánh giá chờ xử lý ({pendingEvaluations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingEvaluations.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đánh giá nào chờ xử lý</h3>
              <p className="text-gray-500">
                Tất cả báo cáo đã được đánh giá hoặc chưa có nhân viên nào nộp báo cáo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvaluations.map((assignment) => (
                <div key={assignment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {assignment.employees?.full_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {assignment.employees?.employee_code} • {assignment.work_groups?.name}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleEvaluate(assignment)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Đánh giá
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">KPI Target:</span>
                      <div className="font-medium">
                        {assignment.kpi_target} {assignment.kpi_unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Chu kỳ:</span>
                      <div className="font-medium">
                        {assignment.performance_cycles?.name}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Tỷ lệ lương:</span>
                      <div className="font-medium">
                        {assignment.salary_percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Assignments Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tất cả phân công</h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-medium text-gray-700">Nhân viên</TableHead>
                <TableHead className="font-medium text-gray-700">Nhóm công việc</TableHead>
                <TableHead className="font-medium text-gray-700">KPI mục tiêu</TableHead>
                <TableHead className="font-medium text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-medium text-gray-700">Điểm số</TableHead>
                <TableHead className="font-medium text-gray-700">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments?.map((assignment) => (
                <TableRow key={assignment.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
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
                    <span className="font-medium text-gray-900">
                      {assignment.work_groups?.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {assignment.kpi_target} {assignment.kpi_unit}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      assignment.status === 'evaluated' ? 'default' :
                      assignment.status === 'submitted' ? 'secondary' :
                      assignment.status === 'in_progress' ? 'outline' : 'destructive'
                    }>
                      {assignment.status === 'evaluated' ? 'Đã đánh giá' :
                       assignment.status === 'submitted' ? 'Đã nộp báo cáo' :
                       assignment.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">
                      {/* Show evaluation score if available */}
                      -
                    </span>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Evaluation Dialog */}
      <Dialog open={showEvaluationForm} onOpenChange={setShowEvaluationForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Đánh giá hiệu suất - {selectedAssignment?.employees?.full_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Assignment Info */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-gray-900">Thông tin công việc</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nhóm công việc:</span>
                  <div className="font-medium">{selectedAssignment?.work_groups?.name}</div>
                </div>
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
                <div>
                  <span className="text-gray-500">Tỷ lệ lương:</span>
                  <div className="font-medium">{selectedAssignment?.salary_percentage}%</div>
                </div>
              </div>
            </div>

            {/* Evaluation Form */}
            <div className="space-y-4">
              <div className="space-y-2">
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
                <p className="text-xs text-gray-500">
                  Nhập % hoàn thành so với KPI đề ra (có thể > 100% nếu vượt mục tiêu)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality_rating">Điểm chất lượng (1-10 sao) *</Label>
                <Select value={formData.quality_rating.toString()} onValueChange={(value) => setFormData({...formData, quality_rating: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} sao ({rating * 10}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  {[...Array(formData.quality_rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  {[...Array(10 - formData.quality_rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-300" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({formData.quality_rating * 10}%)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
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
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Xem trước điểm số cuối cùng</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Điểm khối lượng:</span>
                    <div className="font-medium">{formData.quantity_score}%</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Điểm chất lượng:</span>
                    <div className="font-medium">{formData.quality_rating * 10}%</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Điểm cuối cùng:</span>
                    <div className="font-bold text-lg">
                      {((formData.quantity_score + (formData.quality_rating * 10)) / 2).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEvaluationForm(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={createEvaluation.isPending}>
                {createEvaluation.isPending ? 'Đang lưu...' : 'Hoàn thành đánh giá'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
