
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemStatsCard } from '@/components/settings/SystemStatsCard';
import { SystemSettingsCard } from '@/components/settings/SystemSettingsCard';
import { SystemInfoCard } from '@/components/settings/SystemInfoCard';
import { UserManagementCard } from '@/components/settings/UserManagementCard';
import { AuditLogsCard } from '@/components/settings/AuditLogsCard';

export default function Settings() {

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cài đặt hệ thống</h1>
            <p className="text-muted-foreground mt-1">Quản lý cấu hình và người dùng hệ thống</p>
          </div>
        </div>

        {/* System Overview */}
        <SystemStatsCard />

        {/* System Settings */}
        <SystemSettingsCard />

        {/* User Management */}
        <UserManagementCard />

        {/* Audit Logs */}
        <AuditLogsCard />

        {/* System Information */}
        <SystemInfoCard />
      </div>
    </DashboardLayout>
  );
}
