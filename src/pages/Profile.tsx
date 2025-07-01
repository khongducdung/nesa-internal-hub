
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { useSettings } from '@/components/ui/settings-context';

export default function Profile() {
  const { hideDescriptions } = useSettings();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt tài khoản</h1>
          {!hideDescriptions && (
            <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và cài đặt bảo mật</p>
          )}
        </div>

        <ProfileSettings />
      </div>
    </DashboardLayout>
  );
}
