
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTrainingPrograms } from '@/hooks/useTrainingPrograms';

export function TrainingList() {
  const { data: trainingPrograms, isLoading } = useTrainingPrograms();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="status-active">Đang diễn ra</Badge>;
      case 'completed':
        return <Badge className="status-completed">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="status-inactive">Đã hủy</Badge>;
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
      {trainingPrograms?.map((program) => (
        <div key={program.id} className="card-blue rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-blue-900">{program.name}</h3>
                {getStatusBadge(program.status)}
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                {program.description && <p className="line-clamp-2">{program.description}</p>}
                {program.trainer && <p>Giảng viên: {program.trainer}</p>}
                <div className="flex items-center space-x-4">
                  <span>Bắt đầu: {new Date(program.start_date).toLocaleDateString('vi-VN')}</span>
                  <span>Kết thúc: {new Date(program.end_date).toLocaleDateString('vi-VN')}</span>
                </div>
                {program.max_participants && (
                  <p>Số lượng tối đa: {program.max_participants} người</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
