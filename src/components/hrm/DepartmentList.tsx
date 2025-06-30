
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useDepartments } from '@/hooks/useDepartments';

export function DepartmentList() {
  const { data: departments, isLoading } = useDepartments();

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
      {departments?.map((department) => (
        <div key={department.id} className="card-blue rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-blue-900">{department.name}</h3>
                {getStatusBadge(department.status || 'active')}
              </div>
              <div className="text-sm text-blue-700">
                {department.description && <p className="mb-2">{department.description}</p>}
                <p>Ngày tạo: {new Date(department.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
