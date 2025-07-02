
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OKRDashboard } from './OKRDashboard';
import { OKRProgressAndReporting } from './OKRProgressAndReporting';
import { MyOKRTasks } from './MyOKRTasks';
import { CompanyOKRView } from './CompanyOKRView';
import { DepartmentOKRView } from './DepartmentOKRView';
import { OKRSettings } from './OKRSettings';
import { useAuth } from '@/hooks/useAuth';
import { Target, Users, BarChart3, Settings, Building2, TrendingUp, Building } from 'lucide-react';

export function OKRManagement() {
  const { profile, isAdmin } = useAuth();
  
  // Kiểm tra nếu user là manager (level 1 hoặc 2)
  const isManager = profile?.employee_level === 'level_1' || profile?.employee_level === 'level_2';
  
  // Xác định số lượng tabs dựa trên quyền
  const getGridCols = () => {
    if (isAdmin) return 'grid-cols-6'; // Admin có tất cả tabs
    if (isManager) return 'grid-cols-5'; // Manager có thêm tab phòng ban và báo cáo
    return 'grid-cols-3'; // Nhân viên thường chỉ có 3 tabs
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* Navigation Tabs - Menu chính với variant primary */}
          <div className="mb-8">
            <TabsList variant="primary" className={`grid ${getGridCols()}`}>
              <TabsTrigger variant="primary" value="dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              
              <TabsTrigger variant="primary" value="company-okr">
                <Building2 className="h-4 w-4 mr-2" />
                OKR Công ty
              </TabsTrigger>
              
              {/* Tab OKR Phòng ban - chỉ hiện cho manager và admin */}
              {(isManager || isAdmin) && (
                <TabsTrigger variant="primary" value="department-okr">
                  <Building className="h-4 w-4 mr-2" />
                  OKR Phòng ban
                </TabsTrigger>
              )}
              
              <TabsTrigger variant="primary" value="my-okrs">
                <Target className="h-4 w-4 mr-2" />
                OKR của tôi
              </TabsTrigger>
              
              {/* Tab Báo cáo - chỉ hiện cho manager và admin */}
              {(isManager || isAdmin) && (
                <TabsTrigger variant="primary" value="progress-reporting">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Tiến độ & Báo cáo
                </TabsTrigger>
              )}

              {/* Tab Settings - chỉ hiện cho admin */}
              {isAdmin && (
                <TabsTrigger variant="primary" value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt OKR
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            <TabsContent value="dashboard" className="m-0">
              <OKRDashboard />
            </TabsContent>

            <TabsContent value="company-okr" className="m-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <CompanyOKRView />
              </div>
            </TabsContent>

            {/* Tab OKR Phòng ban */}
            {(isManager || isAdmin) && (
              <TabsContent value="department-okr" className="m-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <DepartmentOKRView />
                </div>
              </TabsContent>
            )}

            <TabsContent value="my-okrs" className="m-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <MyOKRTasks />
              </div>
            </TabsContent>

            {/* Tab Báo cáo */}
            {(isManager || isAdmin) && (
              <TabsContent value="progress-reporting" className="m-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <OKRProgressAndReporting />
                </div>
              </TabsContent>
            )}

            {/* Tab Settings */}
            {isAdmin && (
              <TabsContent value="settings" className="m-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <OKRSettings />
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
