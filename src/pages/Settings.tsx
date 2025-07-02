import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemOverviewCard } from '@/components/settings/SystemOverviewCard';
import { SystemConfigCard } from '@/components/settings/SystemConfigCard';
import { UserManagementCard } from '@/components/settings/UserManagementCard';
import { SecurityCard } from '@/components/settings/SecurityCard';
import { NotificationsCard } from '@/components/settings/NotificationsCard';
import { APIConfigCard } from '@/components/settings/APIConfigCard';
import { SystemLogsCard } from '@/components/settings/SystemLogsCard';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý cấu hình, bảo mật và các thiết lập hệ thống NESA
          </p>
        </div>

        {/* System Overview - Full Width */}
        <div className="mb-8">
          <SystemOverviewCard />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <SystemConfigCard />
            <SecurityCard />
            <NotificationsCard />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <UserManagementCard />
            <APIConfigCard />
            <SystemLogsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}