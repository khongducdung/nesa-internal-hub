
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Search, Award, FileText } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useDeleteEmployee } from '@/hooks/useEmployeeMutations';
import { EmployeeEditDialog } from './EmployeeEditDialog';
import { EmployeeFormDialog } from './EmployeeFormDialog';
import { CompetencyFrameworkViewDialog } from './CompetencyFrameworkViewDialog';
import { EmployeeJobDescriptionDialog } from './EmployeeJobDescriptionDialog';

export function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();
  const deleteEmployee = useDeleteEmployee();
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingCompetencyEmployee, setViewingCompetencyEmployee] = useState<string | null>(null);
  const [viewingJobDescEmployee, setViewingJobDescEmployee] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Ngưng hoạt động</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'level_1':
        return <Badge className="bg-purple-100 text-purple-800">Cấp 1</Badge>;
      case 'level_2':
        return <Badge className="bg-blue-100 text-blue-800">Cấp 2</Badge>;
      case 'level_3':
        return <Badge className="bg-gray-100 text-gray-800">Cấp 3</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
    }
  };

  const handleDelete = async () => {
    if (deletingEmployee) {
      await deleteEmployee.mutateAsync(deletingEmployee);
      setDeletingEmployee(null);
    }
  };

  const filteredEmployees = employees?.filter(employee =>
    employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.phone && employee.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
    employee.departments?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.positions?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header with search and create button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo nhân viên
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã NV</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead>Cấp bậc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employee_code}</TableCell>
                  <TableCell>{employee.full_name}</TableCell>
                  <TableCell>{employee.phone || 'Chưa có'}</TableCell>
                  <TableCell>{employee.departments?.name || 'N/A'}</TableCell>
                  <TableCell>{employee.positions?.name || 'N/A'}</TableCell>
                  <TableCell>{getLevelBadge(employee.employee_level || 'level_3')}</TableCell>
                  <TableCell>{getStatusBadge(employee.work_status || 'active')}</TableCell>
                   <TableCell className="text-right">
                     <div className="flex items-center justify-end gap-2">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setViewingCompetencyEmployee(employee.id)}
                         title="Xem khung năng lực"
                       >
                         <Award className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setViewingJobDescEmployee(employee.id)}
                         title="Xem mô tả công việc"
                       >
                         <FileText className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setEditingEmployee(employee.id)}
                         title="Chỉnh sửa"
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setDeletingEmployee(employee.id)}
                         className="text-red-600 hover:text-red-700"
                         title="Xóa"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Form Dialog */}
      <EmployeeFormDialog
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />

      {/* Edit Dialog */}
      {editingEmployee && (
        <EmployeeEditDialog
          employeeId={editingEmployee}
          open={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
        />
      )}

      {/* Competency Framework Dialog */}
      {viewingCompetencyEmployee && (
        <CompetencyFrameworkViewDialog
          open={!!viewingCompetencyEmployee}
          onClose={() => setViewingCompetencyEmployee(null)}
          frameworkId={employees?.find(emp => emp.id === viewingCompetencyEmployee)?.position_id}
        />
      )}

      {/* Job Description Dialog */}
      {viewingJobDescEmployee && (
        <EmployeeJobDescriptionDialog
          open={!!viewingJobDescEmployee}
          onClose={() => setViewingJobDescEmployee(null)}
          employeeId={viewingJobDescEmployee}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingEmployee} onOpenChange={() => setDeletingEmployee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
