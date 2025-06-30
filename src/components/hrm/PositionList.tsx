
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { usePositions } from '@/hooks/usePositions';

export function PositionList() {
  const { data: positions, isLoading } = usePositions();

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

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'level_1':
        return <Badge className="bg-purple-100 text-purple-800 border border-purple-200">Cấp 1 (Lãnh đạo)</Badge>;
      case 'level_2':
        return <Badge className="badge-blue">Cấp 2 (Quản lý)</Badge>;
      case 'level_3':
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Cấp 3 (Nhân viên)</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
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
      {positions?.map((position) => (
        <div key={position.id} className="card-blue rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-blue-900">{position.name}</h3>
                {getLevelBadge(position.level)}
                {getStatusBadge(position.status || 'active')}
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                {position.description && <p>{position.description}</p>}
                {position.departments && <p>Phòng ban: {position.departments.name}</p>}
                <p>Ngày tạo: {new Date(position.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
