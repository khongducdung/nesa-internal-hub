
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useEmployees } from '@/hooks/useEmployees';

export function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="status-active">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="status-inactive">Ngưng hoạt động</Badge>;
      case 'pending':
        return <Badge className="status-pending">Chờ duyệt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {employees?.map((employee) => (
        <div key={employee.id} className="card-blue rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-blue-900">{employee.full_name}</h3>
                {getStatusBadge(employee.status || 'active')}
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Mã NV: <span className="font-medium">{employee.employee_code}</span></p>
                {employee.email && <p>Email: {employee.email}</p>}
                {employee.phone && <p>SĐT: {employee.phone}</p>}
                {employee.departments && <p>Phòng ban: {employee.departments.name}</p>}
                {employee.positions && <p>Vị trí: {employee.positions.name}</p>}
                <p>Ngày tham gia: {new Date(employee.hire_date).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
