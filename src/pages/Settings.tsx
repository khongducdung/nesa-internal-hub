
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemSettingsCard } from '@/components/settings/SystemSettingsCard';
import { SystemInfoCard } from '@/components/settings/SystemInfoCard';
import { UserManagementCard } from '@/components/settings/UserManagementCard';
import { AuditLogsCard } from '@/components/settings/AuditLogsCard';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground mt-2">Quản lý cấu hình và người dùng hệ thống - app.nesagroups.com</p>
        </div>

        {/* Two Column Layout - Optimized for wide content */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
          {/* Left Column - Full width on smaller screens */}
          <div className="space-y-8 min-w-0">
            <SystemSettingsCard />
            <SystemInfoCard />
          </div>

          {/* Right Column - Full width on smaller screens */}
          <div className="space-y-8 min-w-0">
            <UserManagementCard />
            <AuditLogsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
