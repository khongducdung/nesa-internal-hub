
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Search, Award, FileText } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useDeleteEmployee } from '@/hooks/useEmployeeMutations';
import { useCompetencyFrameworks } from '@/hooks/useCompetencyFrameworks';
import { EmployeeEditDialog } from './EmployeeEditDialog';
import { EmployeeFormDialog } from './EmployeeFormDialog';

export function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();
  const { data: competencyFrameworks } = useCompetencyFrameworks();
  const deleteEmployee = useDeleteEmployee();
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompetencyDialog, setShowCompetencyDialog] = useState(false);
  const [showJobDescriptionDialog, setShowJobDescriptionDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

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

  const handleViewCompetency = (employee: any) => {
    setSelectedEmployee(employee);
    setShowCompetencyDialog(true);
  };

  const handleViewJobDescription = (employee: any) => {
    setSelectedEmployee(employee);
    setShowJobDescriptionDialog(true);
  };

  const getEmployeeCompetencyFramework = (employee: any) => {
    return competencyFrameworks?.find(
      framework => framework.position_id === employee.position_id
    );
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
                        onClick={() => handleViewCompetency(employee)}
                        title="Xem khung năng lực"
                      >
                        <Award className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewJobDescription(employee)}
                        title="Xem mô tả công việc"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
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

      {/* Khung năng lực Dialog */}
      <Dialog open={showCompetencyDialog} onOpenChange={setShowCompetencyDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Khung năng lực - {selectedEmployee?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {(() => {
              const framework = getEmployeeCompetencyFramework(selectedEmployee);
              if (!framework) {
                return (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có khung năng lực cho vị trí này</p>
                  </div>
                );
              }
              
              // Parse the competencies from JSON to array
              let competencies = [];
              try {
                if (typeof framework.competencies === 'string') {
                  competencies = JSON.parse(framework.competencies);
                } else if (Array.isArray(framework.competencies)) {
                  competencies = framework.competencies;
                } else if (framework.competencies && typeof framework.competencies === 'object') {
                  competencies = Array.isArray(framework.competencies) ? framework.competencies : [];
                }
              } catch (error) {
                console.error('Error parsing competencies:', error);
                competencies = [];
              }
              
              return (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{framework.name}</h3>
                    <p className="text-gray-600">{framework.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-3">Năng lực yêu cầu:</h4>
                    {competencies.length > 0 ? (
                      <div className="space-y-4">
                        {competencies.map((competency: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{competency.name || 'Không có tên'}</h5>
                              <Badge variant="outline">
                                Cấp độ {competency.required_level || 'N/A'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{competency.description || 'Không có mô tả'}</p>
                            {competency.skills && Array.isArray(competency.skills) && competency.skills.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">Kỹ năng cần thiết:</p>
                                <div className="flex flex-wrap gap-1">
                                  {competency.skills.map((skill: string, skillIndex: number) => (
                                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Chưa có yêu cầu năng lực nào được định nghĩa</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mô tả công việc Dialog */}
      <Dialog open={showJobDescriptionDialog} onOpenChange={setShowJobDescriptionDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mô tả công việc - {selectedEmployee?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Mã nhân viên:</label>
                <p className="text-gray-900">{selectedEmployee?.employee_code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Chức vụ:</label>
                <p className="text-gray-900">{selectedEmployee?.positions?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phòng ban:</label>
                <p className="text-gray-900">{selectedEmployee?.departments?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Cấp bậc:</label>
                <p className="text-gray-900">
                  {selectedEmployee?.employee_level === 'level_1' ? 'Cấp 1' :
                   selectedEmployee?.employee_level === 'level_2' ? 'Cấp 2' : 'Cấp 3'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Mô tả công việc:</label>
              {selectedEmployee?.job_description ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedEmployee.job_description}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Chưa có mô tả công việc</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
