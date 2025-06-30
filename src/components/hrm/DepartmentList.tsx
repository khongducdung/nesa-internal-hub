
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useDepartments } from '@/hooks/useDepartments';

export function DepartmentList() {
  const { data: departments, isLoading } = useDepartments();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {departments?.map((department) => (
        <div key={department.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold">{department.name}</h3>
                {getStatusBadge(department.status || 'active')}
              </div>
              <div className="text-sm text-gray-600">
                {department.description && <p>{department.description}</p>}
                <p>Ngày tạo: {new Date(department.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
