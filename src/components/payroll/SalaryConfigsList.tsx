
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Star } from 'lucide-react';
import { useSalaryConfigs } from '@/hooks/usePayroll';

export function SalaryConfigsList() {
  const { data: configs = [], isLoading } = useSalaryConfigs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Cấu hình tính lương</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configs.map((config) => (
          <Card key={config.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>{config.name}</span>
                </CardTitle>
                {config.is_default && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Mặc định
                  </Badge>
                )}
              </div>
              {config.description && (
                <p className="text-sm text-gray-600">{config.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Hệ số tăng ca:</span>
                    <p className="text-gray-600">{config.overtime_rate}x</p>
                  </div>
                  <div>
                    <span className="font-medium">Thuế TNCN:</span>
                    <p className="text-gray-600">{config.tax_rate}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Bảo hiểm:</span>
                    <p className="text-gray-600">{config.insurance_rate}%</p>
                  </div>
                  <div>
                    <span className="font-medium">Giờ làm/ngày:</span>
                    <p className="text-gray-600">{config.min_working_hours_per_day}h</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Phạt đi muộn:</span>
                    <p className="text-gray-600">{config.late_penalty_per_hour.toLocaleString('vi-VN')} VNĐ/h</p>
                  </div>
                  <div>
                    <span className="font-medium">Phạt vắng mặt:</span>
                    <p className="text-gray-600">{config.absent_penalty_per_day.toLocaleString('vi-VN')} VNĐ/ngày</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium">Ngày làm chuẩn/tháng:</span>
                  <p className="text-gray-600">{config.standard_working_days_per_month} ngày</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {configs.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có cấu hình</h3>
          <p className="mt-1 text-sm text-gray-500">Chưa có cấu hình tính lương nào được thiết lập.</p>
        </div>
      )}
    </div>
  );
}
