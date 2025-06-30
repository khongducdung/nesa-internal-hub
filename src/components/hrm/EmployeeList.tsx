
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useEmployees } from '@/hooks/useEmployees';

export function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {employees?.map((employee) => (
        <div key={employee.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold">{employee.full_name}</h3>
                <span className="text-sm text-gray-500">({employee.employee_code})</span>
                {getLevelBadge(employee.employee_level || 'level_3')}
                {getStatusBadge(employee.work_status || 'active')}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Email: {employee.email}</p>
                {employee.phone && <p>Điện thoại: {employee.phone}</p>}
                {employee.departments && <p>Phòng ban: {employee.departments.name}</p>}
                {employee.positions && <p>Vị trí: {employee.positions.name}</p>}
                {employee.hire_date && (
                  <p>Ngày vào làm: {new Date(employee.hire_date).toLocaleDateString('vi-VN')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
