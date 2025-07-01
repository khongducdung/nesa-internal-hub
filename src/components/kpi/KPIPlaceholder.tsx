
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Target } from 'lucide-react';

export function KPIPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý KPI</h1>
        <p className="text-gray-600 mt-1">Theo dõi và đánh giá các chỉ số hiệu suất chính</p>
      </div>

      <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-gray-700">
            Module KPI đang được phát triển
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Chúng tôi đang xây dựng hệ thống quản lý KPI toàn diện để giúp bạn theo dõi và đánh giá hiệu suất làm việc một cách hiệu quả.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border">
              <Target className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Thiết lập mục tiêu</h3>
              <p className="text-sm text-gray-600 text-center">Xây dựng và quản lý các chỉ số KPI</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border">
              <TrendingUp className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Theo dõi tiến độ</h3>
              <p className="text-sm text-gray-600 text-center">Giám sát hiệu suất theo thời gian</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border">
              <Calendar className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">Báo cáo định kỳ</h3>
              <p className="text-sm text-gray-600 text-center">Tạo báo cáo và phân tích xu hướng</p>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Sắp ra mắt:</strong> Module KPI sẽ được tích hợp đầy đủ trong các phiên bản tiếp theo với nhiều tính năng mạnh mẽ.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
