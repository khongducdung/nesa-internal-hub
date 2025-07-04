
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemOverviewCard } from '@/components/settings/SystemOverviewCard';
import { SystemHealthCard } from '@/components/settings/SystemHealthCard';
import { DeploymentConfigCard } from '@/components/settings/DeploymentConfigCard';
import { PerformanceMonitorCard } from '@/components/settings/PerformanceMonitorCard';
import { IntegrationConfigCard } from '@/components/settings/IntegrationConfigCard';
import { UserManagementCard } from '@/components/settings/UserManagementCard';
import { SecurityCard } from '@/components/settings/SecurityCard';
import { SystemLogsCard } from '@/components/settings/SystemLogsCard';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý cấu hình, triển khai và giám sát hệ thống NESA
          </p>
        </div>

        {/* System Overview - Full Width */}
        <div className="mb-8">
          <SystemOverviewCard />
        </div>

        {/* System Health - Full Width */}
        <div className="mb-8">
          <SystemHealthCard />
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            <DeploymentConfigCard />
            <IntegrationConfigCard />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <PerformanceMonitorCard />
            <SecurityCard />
          </div>
        </div>

        {/* Management & Logs Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <UserManagementCard />
          <SystemLogsCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
