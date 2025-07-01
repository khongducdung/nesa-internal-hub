
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

export default function Performance() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hiệu suất</h1>
          <p className="text-gray-600 mt-1">Theo dõi và đánh giá hiệu suất làm việc của nhân viên</p>
        </div>

        {/* Coming Soon Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Module quản lý hiệu suất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tính năng đang phát triển</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Module quản lý hiệu suất và KPI sẽ được triển khai trong phiên bản tiếp theo. 
                Vui lòng theo dõi các cập nhật từ hệ thống.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đánh giá hoàn thành</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Điểm trung bình</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
