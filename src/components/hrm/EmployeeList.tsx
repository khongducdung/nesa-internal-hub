
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Search, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeForm } from './EmployeeForm';

export function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const filteredEmployees = employees?.filter(employee =>
    employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'level_1': return 'Cấp 1';
      case 'level_2': return 'Cấp 2';
      case 'level_3': return 'Cấp 3';
      default: return 'Chưa xác định';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Danh sách nhân viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Danh sách nhân viên ({employees?.length || 0})
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
              </DialogHeader>
              <EmployeeForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredEmployees?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Không tìm thấy nhân viên nào' : 'Chưa có nhân viên nào'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees?.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{employee.full_name}</h3>
                      <p className="text-sm text-gray-600">{employee.employee_code}</p>
                    </div>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditingEmployee(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
                          </DialogHeader>
                          <EmployeeForm 
                            employee={editingEmployee} 
                            onClose={() => setEditingEmployee(null)} 
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {employee.email}
                    </div>
                    {employee.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {employee.phone}
                      </div>
                    )}
                    {employee.hire_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Ngày vào: {new Date(employee.hire_date).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="space-y-1">
                      <Badge className={getStatusColor(employee.work_status || 'active')}>
                        {employee.work_status === 'active' ? 'Đang làm việc' : 
                         employee.work_status === 'inactive' ? 'Nghỉ việc' : 'Chờ xử lý'}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {getLevelLabel(employee.employee_level || 'level_3')}
                      </div>
                    </div>
                    <div className="text-right">
                      {employee.departments && (
                        <div className="text-sm font-medium">{employee.departments.name}</div>
                      )}
                      {employee.positions && (
                        <div className="text-xs text-gray-500">{employee.positions.name}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
