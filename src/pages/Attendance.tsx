
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Calendar, TrendingUp } from 'lucide-react';

export default function Attendance() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chấm công & Tính lương</h1>
          <p className="text-gray-600 mt-1">Hệ thống chấm công và tính lương toàn diện</p>
        </div>

        {/* Coming Soon Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Module chấm công & Tính lương
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Đang phát triển lại từ đầu</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Module chấm công và tính lương đang được phát triển lại hoàn toàn với kiến trúc mới. 
                Vui lòng theo dõi các cập nhật từ hệ thống.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chấm công</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tính lương</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Báo cáo</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
