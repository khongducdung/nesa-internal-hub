
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemSettingsCard } from '@/components/settings/SystemSettingsCard';
import { SystemInfoCard } from '@/components/settings/SystemInfoCard';
import { UserManagementCard } from '@/components/settings/UserManagementCard';
import { AuditLogsCard } from '@/components/settings/AuditLogsCard';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý cấu hình, người dùng và hoạt động hệ thống - app.nesagroups.com
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - System Configuration */}
          <div className="space-y-8">
            <SystemSettingsCard />
            <SystemInfoCard />
          </div>

          {/* Right Column - User Management & Audit */}
          <div className="space-y-8">
            <UserManagementCard />
            <AuditLogsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
