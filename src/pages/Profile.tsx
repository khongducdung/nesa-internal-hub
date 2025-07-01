
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfileSettings } from '@/components/profile/ProfileSettings';

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt tài khoản</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và cài đặt bảo mật</p>
        </div>

        <ProfileSettings />
      </div>
    </DashboardLayout>
  );
}
