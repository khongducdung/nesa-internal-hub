
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTrainingPrograms } from '@/hooks/useTrainingPrograms';

export function TrainingList() {
  const { data: trainingPrograms, isLoading } = useTrainingPrograms();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang diễn ra</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
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
      {trainingPrograms?.map((program) => (
        <div key={program.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold">{program.name}</h3>
                {getStatusBadge(program.status)}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
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
