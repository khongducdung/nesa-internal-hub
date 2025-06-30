
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Edit, Trash2 } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useDeleteEmployee } from '@/hooks/useEmployeeMutations';
import { EmployeeEditDialog } from './EmployeeEditDialog';

export function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();
  const deleteEmployee = useDeleteEmployee();
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NV</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phòng ban</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead>Cấp bậc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.employee_code}</TableCell>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.departments?.name || 'N/A'}</TableCell>
                <TableCell>{employee.positions?.name || 'N/A'}</TableCell>
                <TableCell>{getLevelBadge(employee.employee_level || 'level_3')}</TableCell>
                <TableCell>{getStatusBadge(employee.work_status || 'active')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEmployee(employee.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingEmployee(employee.id)}
                      className="text-red-600 hover:text-red-700"
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

      {/* Edit Dialog */}
      {editingEmployee && (
        <EmployeeEditDialog
          employeeId={editingEmployee}
          open={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
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
