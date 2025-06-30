
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-1">Quản lý các cài đặt và tùy chỉnh hệ thống</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-blue-600" />
                Quản lý người dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Quản lý tài khoản người dùng, phân quyền và vai trò trong hệ thống
              </p>
              <div className="text-sm text-amber-600">
                Đang phát triển...
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-green-600" />
                Thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Cấu hình thông báo email, SMS và thông báo trong ứng dụng
              </p>
              <div className="text-sm text-amber-600">
                Đang phát triển...
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-red-600" />
                Bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Cài đặt bảo mật, mật khẩu và xác thực hai yếu tố
              </p>
              <div className="text-sm text-amber-600">
                Đang phát triển...
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-5 w-5 text-purple-600" />
                Sao lưu dữ liệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Cấu hình sao lưu tự động và khôi phục dữ liệu hệ thống
              </p>
              <div className="text-sm text-amber-600">
                Đang phát triển...
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <SettingsIcon className="h-5 w-5 text-gray-600" />
                Cài đặt chung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Cấu hình múi giờ, ngôn ngữ và các thiết lập cơ bản khác
              </p>
              <div className="text-sm text-amber-600">
                Đang phát triển...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
