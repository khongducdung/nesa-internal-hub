
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, User, Target, Calendar, Briefcase } from 'lucide-react';
import { usePerformanceAssignments, useCreatePerformanceAssignment, usePerformanceCycles, useWorkGroups } from '@/hooks/usePerformance';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/hooks/useAuth';

export function PerformanceAssignmentManagement() {
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const { data: assignments, isLoading } = usePerformanceAssignments(selectedCycle);
  const { data: cycles } = usePerformanceCycles();
  const { data: workGroups } = useWorkGroups();
  const { data: employees } = useEmployees();
  const createAssignment = useCreatePerformanceAssignment();
  const { profile } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    performance_cycle_id: '',
    employee_id: '',
    work_group_id: '',
    kpi_target: 0,
    kpi_unit: '',
    description: '',
    salary_percentage: 0
  });

  const activeCycles = cycles?.filter(c => c.status === 'active') || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.employee_id) return;

    const selectedWorkGroup = workGroups?.find(wg => wg.id === formData.work_group_id);
    
    await createAssignment.mutateAsync({
      ...formData,
      salary_percentage: selectedWorkGroup?.salary_percentage || 0,
      created_by: profile.employee_id
    });

    setFormData({
      performance_cycle_id: '',
      employee_id: '',
      work_group_id: '',
      kpi_target: 0,
      kpi_unit: '',
      description: '',
      salary_percentage: 0
    });
    setShowCreateForm(false);
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
          <h2 className="text-lg font-semibold text-gray-900">Quản lý phân công công việc</h2>
          <p className="text-sm text-gray-500 mt-1">
            Phân công công việc và KPI cho nhân viên theo từng chu kỳ đánh giá
          </p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Phân công công việc
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Phân công công việc mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="performance_cycle_id">Chu kỳ đánh giá *</Label>
                  <Select value={formData.performance_cycle_id} onValueChange={(value) => setFormData({...formData, performance_cycle_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chu kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCycles.map((cycle) => (
                        <SelectItem key={cycle.id} value={cycle.id}>
                          {cycle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee_id">Nhân viên *</Label>
                  <Select value={formData.employee_id} onValueChange={(value) => setFormData({...formData, employee_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.full_name} ({employee.employee_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_group_id">Nhóm công việc *</Label>
                  <Select value={formData.work_group_id} onValueChange={(value) => setFormData({...formData, work_group_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm công việc" />
                    </SelectTrigger>
                    <SelectContent>
                      {workGroups?.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.salary_percentage}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpi_unit">Đơn vị KPI</Label>
                  <Input
                    id="kpi_unit"
                    value={formData.kpi_unit}
                    onChange={(e) => setFormData({...formData, kpi_unit: e.target.value})}
                    placeholder="VD: đơn hàng, sản phẩm, ..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="kpi_target">KPI mục tiêu *</Label>
                  <Input
                    id="kpi_target"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.kpi_target}
                    onChange={(e) => setFormData({...formData, kpi_target: parseFloat(e.target.value) || 0})}
                    placeholder="Nhập số lượng mục tiêu"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Mô tả công việc</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Mô tả chi tiết về công việc và yêu cầu"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={createAssignment.isPending}>
                  {createAssignment.isPending ? 'Đang phân công...' : 'Phân công công việc'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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

      {/* Assignments Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách phân công</h3>
        </div>

        <div className="overflow-x-auto">
          {assignments?.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phân công nào</h3>
              <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
                Tạo phân công công việc đầu tiên cho nhân viên
              </p>
              <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Phân công đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="font-medium text-gray-700">Nhân viên</TableHead>
                  <TableHead className="font-medium text-gray-700">Chu kỳ</TableHead>
                  <TableHead className="font-medium text-gray-700">Nhóm công việc</TableHead>
                  <TableHead className="font-medium text-gray-700">KPI mục tiêu</TableHead>
                  <TableHead className="font-medium text-gray-700">% Lương</TableHead>
                  <TableHead className="font-medium text-gray-700">Trạng thái</TableHead>
                  <TableHead className="font-medium text-gray-700">Ngày phân công</TableHead>
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
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {assignment.performance_cycles?.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {assignment.work_groups?.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {assignment.kpi_target} {assignment.kpi_unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        {assignment.salary_percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        assignment.status === 'evaluated' ? 'default' :
                        assignment.status === 'submitted' ? 'secondary' :
                        assignment.status === 'in_progress' ? 'outline' : 'destructive'
                      }>
                        {assignment.status === 'evaluated' ? 'Đã đánh giá' :
                         assignment.status === 'submitted' ? 'Đã nộp' :
                         assignment.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(assignment.assigned_at).toLocaleDateString('vi-VN')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
