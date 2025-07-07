
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemOverviewCard } from '@/components/settings/SystemOverviewCard';
import { SystemHealthCard } from '@/components/settings/SystemHealthCard';
import { DeploymentConfigCard } from '@/components/settings/DeploymentConfigCard';
import { PerformanceMonitorCard } from '@/components/settings/PerformanceMonitorCard';
import { IntegrationConfigCard } from '@/components/settings/IntegrationConfigCard';
import { UserManagementCard } from '@/components/settings/UserManagementCard';
import { SecurityCard } from '@/components/settings/SecurityCard';
import { SystemLogsCard } from '@/components/settings/SystemLogsCard';
import { SystemSettingsCard } from '@/components/settings/SystemSettingsCard';
import { SystemPermissionsOverviewCard } from '@/components/settings/SystemPermissionsOverviewCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Settings as SettingsIcon, Users, Shield, BarChart3, Globe, Database, Activity } from 'lucide-react';

export default function Settings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const settingsTabs = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: BarChart3,
      description: 'Thống kê và tình trạng hệ thống'
    },
    {
      id: 'users',
      label: 'Người dùng',
      icon: Users,
      description: 'Quản lý tài khoản và phân quyền'
    },
    {
      id: 'security',
      label: 'Bảo mật',
      icon: Shield,
      description: 'Cài đặt an ninh và quyền truy cập'
    },
    {
      id: 'system',
      label: 'Hệ thống',
      icon: SettingsIcon,
      description: 'Cấu hình chung và monitoring'
    },
    {
      id: 'integrations',
      label: 'Tích hợp',
      icon: Globe,
      description: 'API và kết nối bên ngoài'
    },
    {
      id: 'logs',
      label: 'Nhật ký',
      icon: Database,
      description: 'Audit logs và lịch sử hoạt động'
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/50">
        {/* Modern Header with Search */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <SettingsIcon className="h-6 w-6 text-primary" />
                  </div>
                  Cài đặt hệ thống
                </h1>
                <p className="text-muted-foreground">
                  Quản lý cấu hình, triển khai và giám sát hệ thống NESA
                </p>
              </div>
              
              <div className="relative w-80">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Tìm kiếm cài đặt..." 
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Enhanced Tab Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
              <TabsList className="w-full h-auto bg-transparent p-0 space-x-1">
                {settingsTabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id}
                    className="flex-1 flex flex-col items-center gap-2 p-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-50 transition-all"
                  >
                    <tab.icon className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs opacity-80 font-normal mt-1">
                        {tab.description}
                      </div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemOverviewCard />
                <SystemHealthCard />
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserManagementCard />
              <SystemPermissionsOverviewCard />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SecurityCard />
                <PerformanceMonitorCard />
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemSettingsCard />
                <DeploymentConfigCard />
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <IntegrationConfigCard />
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <SystemLogsCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
